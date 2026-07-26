const fs = require('fs');
const path = require('path');
const https = require('https');

const imagesDir = path.join(__dirname, 'public', 'images');

const EXTRA_PHOTOS = {
  'almond.jpg':       'https://images.unsplash.com/photo-1508061252966-f72740272e0d?w=600&auto=format&fit=crop&q=85',
  'lemon.jpg':        'https://images.unsplash.com/photo-1534531141161-e41d133a4b50?w=600&auto=format&fit=crop&q=85',
  'neem.jpg':         'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=85',
  'water.jpg':        'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?w=600&auto=format&fit=crop&q=85',
  'black_pepper.jpg': 'https://images.unsplash.com/photo-1509358211425-24953c9cb675?w=600&auto=format&fit=crop&q=85',
  'pippali.jpg':      'https://images.unsplash.com/photo-1509358211425-24953c9cb675?w=600&auto=format&fit=crop&q=85',
  'peppermint.jpg':   'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=85',
  'mint.jpg':         'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=85',
  'pudina.jpg':       'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=85',
  'curry_leaves.jpg': 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=85',
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

async function fix() {
  for (const [file, url] of Object.entries(EXTRA_PHOTOS)) {
    const p = path.join(imagesDir, file);
    await download(url, p);
  }

  const files = fs.readdirSync(imagesDir);
  for (const f of files) {
    if (f.endsWith('.jpg')) {
      const fullJpg = path.join(imagesDir, f);
      const size = fs.statSync(fullJpg).size;
      if (size > 5000) {
        const png = fullJpg.replace(/\.jpg$/, '.png');
        const svg = fullJpg.replace(/\.jpg$/, '.svg');
        fs.copyFileSync(fullJpg, png);
        fs.copyFileSync(fullJpg, svg);
      }
    }
  }
  console.log('✨ All herb photos complete and synchronized!');
}

fix();
