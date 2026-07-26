const fs = require('fs');
const path = require('path');
const https = require('https');

const imagesDir = path.join(__dirname, 'public', 'images');

const GUARANTEED_MAP = {
  'water.jpg':        'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?w=600&auto=format&fit=crop&q=85',
  'peppermint.jpg':   'https://images.unsplash.com/photo-1628714986218-ab18e15e2f2e?w=600&auto=format&fit=crop&q=85',
  'mint.jpg':         'https://images.unsplash.com/photo-1628714986218-ab18e15e2f2e?w=600&auto=format&fit=crop&q=85',
  'pudina.jpg':       'https://images.unsplash.com/photo-1628714986218-ab18e15e2f2e?w=600&auto=format&fit=crop&q=85',
  'anjeer.jpg':       'https://images.unsplash.com/photo-1601493700637-93c5cd4a2028?w=600&auto=format&fit=crop&q=85',
  'almond.jpg':       'https://images.unsplash.com/photo-1508061252966-f72740272e0d?w=600&auto=format&fit=crop&q=85',
  'lemon.jpg':        'https://images.unsplash.com/photo-1534531141161-e41d133a4b50?w=600&auto=format&fit=crop&q=85'
};

function download(url, dest) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve);
      }
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve(true)));
      } else {
        file.close(() => fs.unlink(dest, () => resolve(false)));
      }
    });
    req.on('error', () => fs.unlink(dest, () => resolve(false)));
  });
}

async function fix() {
  for (const [file, url] of Object.entries(GUARANTEED_MAP)) {
    const dest = path.join(imagesDir, file);
    const ok = await download(url, dest);
    if (ok && fs.existsSync(dest)) {
      fs.copyFileSync(dest, dest.replace(/\.jpg$/, '.png'));
      fs.copyFileSync(dest, dest.replace(/\.jpg$/, '.svg'));
      console.log(`  ✅ Fixed ${file} (${Math.round(fs.statSync(dest).size / 1024)} KB)`);
    } else {
      console.error(`  ❌ Failed ${file}`);
    }
  }
}

fix();
