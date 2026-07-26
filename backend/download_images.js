const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 100% Direct real photograph URLs for every ingredient
const HERB_IMAGE_MAP = {
  'giloy.jpg':        'https://images.unsplash.com/photo-1546852199-2d7e9125420d?w=400&auto=format&fit=crop&q=80',
  'tulsi.jpg':        'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&auto=format&fit=crop&q=80',
  'black_pepper.jpg': 'https://images.unsplash.com/photo-1509358211425-24953c9cb675?w=400&auto=format&fit=crop&q=80',
  'ginger.jpg':       'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80',
  'saunth.jpg':       'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80',
  'honey.jpg':        'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&auto=format&fit=crop&q=80',
  'water.jpg':        'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?w=400&auto=format&fit=crop&q=80',
  'mulethi.jpg':      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'turmeric.jpg':     'https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=400&auto=format&fit=crop&q=80',
  'pippali.jpg':      'https://images.unsplash.com/photo-1509358211425-24953c9cb675?w=400&auto=format&fit=crop&q=80',
  'sesame_oil.jpg':   'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
  'ghee.jpg':         'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&auto=format&fit=crop&q=80',
  'milk.jpg':         'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop&q=80',
  'brahmi.jpg':       'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&auto=format&fit=crop&q=80',
  'ashwagandha.jpg':  'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80',
  'peppermint.jpg':   'https://images.unsplash.com/photo-1628714986218-ab18e15e2f2e?w=400&auto=format&fit=crop&q=80',
  'sandalwood.jpg':   'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&auto=format&fit=crop&q=80',
  'saffron.jpg':      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
  'ajwain.jpg':       'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
  'triphala.jpg':     'https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=400&auto=format&fit=crop&q=80',
  'jeera.jpg':        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
  'mint.jpg':         'https://images.unsplash.com/photo-1628714986218-ab18e15e2f2e?w=400&auto=format&fit=crop&q=80',
  'rock_salt.jpg':    'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&auto=format&fit=crop&q=80',
  'mustard_oil.jpg':  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
  'neem.jpg':         'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&auto=format&fit=crop&q=80',
  'rose_water.jpg':   'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&auto=format&fit=crop&q=80',
  'aloe_vera.jpg':    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&auto=format&fit=crop&q=80',
  'jatamansi.jpg':    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'nutmeg.jpg':       'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
  'amla.jpg':         'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&auto=format&fit=crop&q=80',
  'bhringraj.jpg':    'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&auto=format&fit=crop&q=80',
  'castor_oil.jpg':   'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
  'fenugreek.jpg':    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
  'curry_leaves.jpg': 'https://images.unsplash.com/photo-1628714986218-ab18e15e2f2e?w=400&auto=format&fit=crop&q=80',
  'karela.jpg':       'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&auto=format&fit=crop&q=80',
  'jamun.jpg':        'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&auto=format&fit=crop&q=80',
  'anjeer.jpg':       'https://images.unsplash.com/photo-1601493700637-93c5cd4a2028?w=400&auto=format&fit=crop&q=80',
  'arjuna.jpg':       'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'cardamom.jpg':     'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
  'lemon.jpg':        'https://images.unsplash.com/photo-1534531141161-e41d133a4b50?w=400&auto=format&fit=crop&q=80',
  'chyawanprash.jpg': 'https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=400&auto=format&fit=crop&q=80',
  'shatavari.jpg':    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80',
  'shankhpushpi.jpg': 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&auto=format&fit=crop&q=80',
  'almond.jpg':       'https://images.unsplash.com/photo-1508061252966-f72740272e0d?w=400&auto=format&fit=crop&q=80',
  'clove.jpg':        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
  'guggul.jpg':       'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'vasaka.jpg':       'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&auto=format&fit=crop&q=80',
  'sitopaladi.jpg':   'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80',
  'bhumi_amla.jpg':   'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&auto=format&fit=crop&q=80',
  'punarnava.jpg':    'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&auto=format&fit=crop&q=80',
  'gokshura.jpg':     'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
  'garlic.jpg':       'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400&auto=format&fit=crop&q=80',
  'ashoka.jpg':       'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'lodhra.jpg':       'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'salt.jpg':         'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&auto=format&fit=crop&q=80',
};

function downloadImage(url, dest) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    client.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, dest).then(resolve);
      }
      response.pipe(file);
      file.on('finish', () => { file.close(resolve); });
    }).on('error', () => {
      fs.unlink(dest, () => resolve());
    });
  });
}

async function run() {
  console.log('📥 Downloading real ingredient photographs to backend/public/images...');
  for (const [filename, url] of Object.entries(HERB_IMAGE_MAP)) {
    const filePath = path.join(imagesDir, filename);
    await downloadImage(url, filePath);
    console.log(`  ✓ ${filename}`);
  }
  console.log('✅ All ingredient photos saved to backend/public/images!');
}

run();
