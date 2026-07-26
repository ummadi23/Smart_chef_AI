const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public', 'images');

const PAIRS = {
  'sarpagandha.jpg': 'mulethi.jpg',
  'kutki.jpg':       'mulethi.jpg',
  'varuna.jpg':      'arjuna.jpg',
  'camphor.jpg':     'rock_salt.jpg',
  'trikatu.jpg':     'saunth.jpg',
};

for (const [target, source] of Object.entries(PAIRS)) {
  const srcPath = path.join(imagesDir, source);
  const tgtPath = path.join(imagesDir, target);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, tgtPath);
    fs.copyFileSync(srcPath, tgtPath.replace(/\.jpg$/, '.png'));
    fs.copyFileSync(srcPath, tgtPath.replace(/\.jpg$/, '.svg'));
    console.log(`  ✅ Synced ${target} from ${source}`);
  }
}
