const fs = require('fs');
const path = require('path');
const https = require('https');

const imagesDir = path.join(__dirname, 'public', 'images');

const REMAINING_HERB_PHOTOS = {
  // Fresh Ginger: Knobby ginger root
  'ginger.jpg':       'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=85',

  // Neem: Green leaves
  'neem.jpg':         'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=85',

  // Black pepper: Peppercorns
  'black_pepper.jpg': 'https://images.unsplash.com/photo-1509358211425-24953c9cb675?w=600&auto=format&fit=crop&q=85',

  // Fresh Water: Glass of clear water
  'water.jpg':        'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?w=600&auto=format&fit=crop&q=85',

  // Pippali: Long pepper pods / spices
  'pippali.jpg':      'https://images.unsplash.com/photo-1509358211425-24953c9cb675?w=600&auto=format&fit=crop&q=85',

  // Mint / Pudina / Peppermint: Green mint leaves
  'peppermint.jpg':   'https://images.unsplash.com/photo-1628714986218-ab18e15e2f2e?w=600&auto=format&fit=crop&q=85',
  'mint.jpg':         'https://images.unsplash.com/photo-1628714986218-ab18e15e2f2e?w=600&auto=format&fit=crop&q=85',
  'pudina.jpg':       'https://images.unsplash.com/photo-1628714986218-ab18e15e2f2e?w=600&auto=format&fit=crop&q=85',

  // Curry leaves: Fresh green curry leaves
  'curry_leaves.jpg': 'https://images.unsplash.com/photo-1628714986218-ab18e15e2f2e?w=600&auto=format&fit=crop&q=85',

  // Anjeer: Dried figs
  'anjeer.jpg':       'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&auto=format&fit=crop&q=85',

  // Lemon: Fresh yellow lemon
  'lemon.jpg':        'https://images.unsplash.com/photo-1534531141161-e41d133a4b50?w=600&auto=format&fit=crop&q=85',

  // Almond: Whole almonds
  'almond.jpg':       'https://images.unsplash.com/photo-1508061252966-f72740272e0d?w=600&auto=format&fit=crop&q=85'
};

function download(url, dest) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve);
      }
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => file.close(() => {
          console.log(`  ✅ ${path.basename(dest)} updated (${Math.round(fs.statSync(dest).size / 1024)} KB)`);
          resolve(true);
        }));
      } else {
        console.warn(`  ⚠️ HTTP ${res.statusCode} for ${path.basename(dest)}`);
        file.close(() => fs.unlink(dest, () => resolve(false)));
      }
    }).on('error', (err) => {
      console.warn(`  ❌ Error ${path.basename(dest)}: ${err.message}`);
      fs.unlink(dest, () => resolve(false));
    });
  });
}

async function run() {
  for (const [file, url] of Object.entries(REMAINING_HERB_PHOTOS)) {
    const filePath = path.join(imagesDir, file);
    const success = await download(url, filePath);
    
    if (success && fs.existsSync(filePath)) {
      const pngPath = filePath.replace(/\.jpg$/, '.png');
      const svgPath = filePath.replace(/\.jpg$/, '.svg');
      fs.copyFileSync(filePath, pngPath);
      fs.copyFileSync(filePath, svgPath);
    }
  }
  console.log('🎉 All remaining herb photos updated and synced!');
}

run();
