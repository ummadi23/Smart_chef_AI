const fs = require('fs');
const path = require('path');
const https = require('https');

const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Wikimedia Commons DIRECT original image URLs (no thumb/ redirect needed)
const DIRECT_COMMONS = {
  'giloy.jpg':        'https://upload.wikimedia.org/wikipedia/commons/c/c5/Tinospora_cordifolia_-_Amrita.jpg',
  'tulsi.jpg':        'https://upload.wikimedia.org/wikipedia/commons/2/29/Holy_basil_Tulsi_leaves.jpg',
  'black_pepper.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Black_pepper_grain.jpg',
  'ginger.jpg':       'https://upload.wikimedia.org/wikipedia/commons/2/2c/Ginger_root.jpg',
  'saunth.jpg':       'https://upload.wikimedia.org/wikipedia/commons/4/4e/Ground_ginger.jpg',
  'honey.jpg':        'https://upload.wikimedia.org/wikipedia/commons/f/ff/Honey_in_jar.jpg',
  'water.jpg':        'https://upload.wikimedia.org/wikipedia/commons/c/c3/Glass_of_water.jpg',
  'mulethi.jpg':      'https://upload.wikimedia.org/wikipedia/commons/c/ca/Liquorice_roots.jpg',
  'turmeric.jpg':     'https://upload.wikimedia.org/wikipedia/commons/5/5b/Turmeric_powder.jpg',
  'garlic.jpg':       'https://upload.wikimedia.org/wikipedia/commons/3/36/Garlic.jpg',
  'lemon.jpg':        'https://upload.wikimedia.org/wikipedia/commons/e/e4/Lemon.jpg',
  'milk.jpg':         'https://upload.wikimedia.org/wikipedia/commons/a/a5/Glass_of_Milk.jpg',
  'almond.jpg':       'https://upload.wikimedia.org/wikipedia/commons/2/28/Almonds.jpg',
  'mint.jpg':         'https://upload.wikimedia.org/wikipedia/commons/9/91/Mint-leaves.jpg',
  'clove.jpg':        'https://upload.wikimedia.org/wikipedia/commons/a/a0/Cloves.jpg',
  'cardamom.jpg':     'https://upload.wikimedia.org/wikipedia/commons/4/4c/Green_cardamom.jpg',
  'jeera.jpg':        'https://upload.wikimedia.org/wikipedia/commons/7/75/Cumin_seeds.jpg',
  'fenugreek.jpg':    'https://upload.wikimedia.org/wikipedia/commons/b/b5/Fenugreek_seeds.jpg',
  'neem.jpg':         'https://upload.wikimedia.org/wikipedia/commons/3/38/Neem_leaves.jpg',
  'amla.jpg':         'https://upload.wikimedia.org/wikipedia/commons/0/07/Phyllanthus_emblica_fruit.jpg',
  'curry_leaves.jpg': 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Curry_leaves.jpg',
  'karela.jpg':       'https://upload.wikimedia.org/wikipedia/commons/0/0d/Bitter_gourd.jpg',
  'anjeer.jpg':       'https://upload.wikimedia.org/wikipedia/commons/7/7b/Dried_figs.jpg',
  'ghee.jpg':         'https://upload.wikimedia.org/wikipedia/commons/a/a2/Desi_Ghee.jpg',
  'sesame_oil.jpg':   'https://upload.wikimedia.org/wikipedia/commons/b/b3/Sesame_oil.jpg',
  'mustard_oil.jpg':  'https://upload.wikimedia.org/wikipedia/commons/1/1b/Mustard_oil.jpg',
  'saffron.jpg':      'https://upload.wikimedia.org/wikipedia/commons/1/15/Saffron_Crocus_sativus.jpg',
  'rose_water.jpg':   'https://upload.wikimedia.org/wikipedia/commons/e/e0/Rosewater.jpg',
  'salt.jpg':         'https://upload.wikimedia.org/wikipedia/commons/2/23/Pink_Himalayan_salt.jpg',
};

function fetchFile(url, dest) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'SmartChefApp/1.0 (https://smartchef.app; contact@smartchef.app) Node.js/18'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchFile(res.headers.location, dest).then(resolve);
      }
      if (res.statusCode !== 200) {
        console.warn(`  ❌ HTTP ${res.statusCode} for ${path.basename(dest)}`);
        file.close(() => fs.unlink(dest, () => resolve()));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          const sz = fs.statSync(dest).size;
          console.log(`  ✅ ${path.basename(dest)} saved! (${Math.round(sz / 1024)} KB)`);
          resolve();
        });
      });
    }).on('error', (err) => {
      console.warn(`  ❌ Error ${path.basename(dest)}: ${err.message}`);
      fs.unlink(dest, () => resolve());
    });
  });
}

async function run() {
  console.log('🌿 Downloading direct original Wikipedia photos...');
  for (const [file, url] of Object.entries(DIRECT_COMMONS)) {
    const dest = path.join(imagesDir, file);
    await fetchFile(url, dest);
  }
  console.log('🎉 Done fetching direct original images!');
}

run();
