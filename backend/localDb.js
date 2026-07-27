const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Fixes M-009: use UUID instead of Math.random()

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Collection {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    this.data = [];
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const content = fs.readFileSync(this.filePath, 'utf8');
        this.data = JSON.parse(content);
      } else {
        this.data = [];
        this.saveSync();
      }
    } catch (e) {
      console.error(`Error loading local DB collection ${this.name}:`, e);
      this.data = [];
    }
  }

  saveSync() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error(`Error saving local DB collection ${this.name}:`, e);
    }
  }

  async save() {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error(`Error saving local DB collection ${this.name}:`, e);
    }
  }

  createInstance(objData) {
    const self = this;
    const instance = { ...objData };

    if (!instance._id) {
      instance._id = uuidv4(); // Cryptographically secure UUID (Fixes M-009)
    }
    if (!instance.createdAt) {
      instance.createdAt = new Date().toISOString();
    }

    // Default fields based on collection name
    if (self.name === 'posts') {
      if (!instance.likedBy) instance.likedBy = [];
      if (!instance.comments) instance.comments = [];
      if (instance.likes === undefined) instance.likes = 0;
    }
    if (self.name === 'recipes') {
      if (!instance.ingredients) instance.ingredients = [];
      if (!instance.instructions) instance.instructions = [];
    }

    // Add standard mongoose save method
    instance.save = async function() {
      const idx = self.data.findIndex(x => x._id === instance._id);
      
      const cleanInstance = {};
      for (const k in instance) {
        if (typeof instance[k] !== 'function') {
          cleanInstance[k] = instance[k];
        }
      }

      if (idx !== -1) {
        self.data[idx] = cleanInstance;
      } else {
        self.data.push(cleanInstance);
      }
      await self.save();
      return instance;
    };

    return instance;
  }

  // Mimic mongoose constructor: const user = new User(data)
  create(data) {
    return this.createInstance(data);
  }

  find(query) {
    let results = [...this.data];
    if (query) {
      results = results.filter(item => {
        for (const key in query) {
          if (item[key] !== query[key]) return false;
        }
        return true;
      });
    }

    const self = this;
    const chain = {
      data: results.map(item => self.createInstance(item)),
      sort(sortOptions) {
        if (sortOptions) {
          const keys = Object.keys(sortOptions);
          if (keys.length > 0) {
            const key = keys[0];
            const direction = sortOptions[key]; // -1 for desc, 1 for asc
            this.data.sort((a, b) => {
              const valA = a[key];
              const valB = b[key];
              if (valA < valB) return direction === -1 ? 1 : -1;
              if (valA > valB) return direction === -1 ? -1 : 1;
              return 0;
            });
          }
        }
        return this;
      },
      then(onFulfilled, onRejected) {
        return Promise.resolve(this.data).then(onFulfilled, onRejected);
      }
    };
    return chain;
  }

  findOne(query) {
    const results = this.data.filter(item => {
      for (const key in query) {
        const val = query[key];
        const itemVal = item[key];
        
        // Handle regex (mongoose title search)
        if (val && typeof val === 'object' && val.$regex) {
          const regex = val.$regex;
          if (!regex.test(itemVal)) return false;
        } else if (val instanceof RegExp) {
          if (!val.test(itemVal)) return false;
        } else {
          // Direct match
          if (itemVal !== val) return false;
        }
      }
      return true;
    });

    if (results.length > 0) {
      return Promise.resolve(this.createInstance(results[0]));
    }
    return Promise.resolve(null);
  }

  findById(id) {
    const results = this.data.filter(item => item._id === id);
    if (results.length > 0) {
      return Promise.resolve(this.createInstance(results[0]));
    }
    return Promise.resolve(null);
  }

  async insertMany(items) {
    const self = this;
    const created = items.map(item => {
      const instance = self.createInstance(item);
      const cleanInstance = {};
      for (const k in instance) {
        if (typeof instance[k] !== 'function') {
          cleanInstance[k] = instance[k];
        }
      }
      return cleanInstance;
    });
    this.data.push(...created);
    await this.save();
    return created.map(item => self.createInstance(item));
  }
}

// Mimic the new keyword constructor by wrapper function
function ModelWrapper(collectionName) {
  const col = new Collection(collectionName);
  
  // The actual function returned acts like a constructor: new User(data)
  function Model(data) {
    return col.create(data);
  }

  // Attach all methods of Collection class to constructor so User.findOne(...) works
  Model.findOne = (q) => col.findOne(q);
  Model.find = (q) => col.find(q);
  Model.findById = (id) => col.findById(id);
  Model.insertMany = (items) => col.insertMany(items);

  return Model;
}

const User = ModelWrapper('users');
const Post = ModelWrapper('posts');
const Recipe = ModelWrapper('recipes');

module.exports = { User, Post, Recipe };
