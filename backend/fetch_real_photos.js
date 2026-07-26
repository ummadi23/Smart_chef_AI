const fs = require('fs');
const path = require('path');
const https = require('https');

const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Map generated & real photo files
const PHOTO_URLS = {
  'rose_water.jpg': 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400',
  'ghee.jpg':       'https://images.pexels.com/photos/4199094/pexels-photo-4199094.jpeg?auto=compress&cs=tinysrgb&w=400',
  'saffron.jpg':    'https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?auto=compress&cs=tinysrgb&w=400',
  'amla.jpg':       'https://images.pexels.com/photos/5945848/pexels-photo-5945848.jpeg?auto=compress&cs=tinysrgb&w=400',
  'karela.jpg':     'https://images.pexels.com/photos/7195272/pexels-photo-7195272.jpeg?auto=compress&cs=tinysrgb&w=400',
  'cardamom.jpg':   'https://images.pexels.com/photos/4198566/pexels-photo-4198566.jpeg?auto=compress&cs=tinysrgb&w=400',
  'clove.jpg':      'https://images.pexels.com/photos/4198565/pexels-photo-4198565.jpeg?auto=compress&cs=tinysrgb&w=400',
  'ajwain.jpg':     'https://images.pexels.com/photos/4198567/pexels-photo-4198567.jpeg?auto=compress&cs=tinysrgb&w=400',
  'jeera.jpg':      'https://images.pexels.com/photos/4198567/pexels-photo-4198567.jpeg?auto=compress&cs=tinysrgb&w=400',
  'fenugreek.jpg':  'https://images.pexels.com/photos/4198567/pexels-photo-4198567.jpeg?auto=compress&cs=tinysrgb&w=400',
  'sandalwood.jpg': 'https://images.unsplash.com/photo-1546852199-2d7e9125420d?w=400&auto=format&fit=crop&q=80',
  'sesame_oil.jpg': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
  'mustard_oil.jpg':'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
  'rock_salt.jpg':  'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&auto=format&fit=crop&q=80',
  'anjeer.jpg':     'https://images.unsplash.com/photo-1601493700637-93c5cd4a2028?w=400&auto=format&fit=crop&q=80',
};

function download(url, dest) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve);
      }
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      } else {
        file.close(() => fs.unlink(dest, () => resolve()));
      }
    }).on('error', () => {
      fs.unlink(dest, () => resolve());
    });
  });
}

async function run() {
  console.log('📸 Fetching real photos for Rose Water, Sandalwood, Ghee, Neem, Aloe Vera, Saffron, Amla, Karela, Cloves...');
  for (const [file, url] of Object.entries(PHOTO_URLS)) {
    const dest = path.join(imagesDir, file);
    await download(url, dest);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`  ✅ ${file} downloaded (${Math.round(fs.statSync(dest).size / 1024)} KB)`);
    }
  }
}

run();
