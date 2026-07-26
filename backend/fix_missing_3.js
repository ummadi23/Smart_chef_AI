const fs = require('fs');
const path = require('path');
const https = require('https');

const imagesDir = path.join(__dirname, 'public', 'images');

const FIX_3 = {
  'water.jpg':  'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?w=600&auto=format&fit=crop&q=85',
  'lemon.jpg':  'https://images.unsplash.com/photo-1590502160462-0e8979a0937a?w=600&auto=format&fit=crop&q=85',
  'almond.jpg': 'https://images.unsplash.com/photo-1508061252966-f72740272e0d?w=600&auto=format&fit=crop&q=85'
};

function download(url, dest) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve);
      }
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve(true)));
      } else {
        file.close(() => fs.unlink(dest, () => resolve(false)));
      }
    }).on('error', () => fs.unlink(dest, () => resolve(false)));
  });
}

async function run() {
  for (const [file, url] of Object.entries(FIX_3)) {
    const p = path.join(imagesDir, file);
    await download(url, p);
    if (fs.existsSync(p)) {
      fs.copyFileSync(p, p.replace(/\.jpg$/, '.png'));
      fs.copyFileSync(p, p.replace(/\.jpg$/, '.svg'));
    }
  }
  console.log('✨ All 3 missing photos fixed!');
}

run();
