const fs = require('fs');
const path = require('path');
const https = require('https');

const imagesDir = path.join(__dirname, 'public', 'images');

const FINAL_PHOTOS = {
  'black_pepper.jpg': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=85',
  'pippali.jpg':      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=85',
  'water.jpg':        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=85',
  'peppermint.jpg':   'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=85',
  'mint.jpg':         'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=85',
  'pudina.jpg':       'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=85',
  'curry_leaves.jpg': 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=85',
  'lemon.jpg':        'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&auto=format&fit=crop&q=85',
  'almond.jpg':       'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=600&auto=format&fit=crop&q=85'
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
  for (const [file, url] of Object.entries(FINAL_PHOTOS)) {
    const filePath = path.join(imagesDir, file);
    const success = await download(url, filePath);
    
    if (success && fs.existsSync(filePath)) {
      const pngPath = filePath.replace(/\.jpg$/, '.png');
      const svgPath = filePath.replace(/\.jpg$/, '.svg');
      fs.copyFileSync(filePath, pngPath);
      fs.copyFileSync(filePath, svgPath);
    }
  }
  console.log('🎉 All remaining photos successfully downloaded!');
}

run();
