const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public', 'images');

const MAP = {
  'water.jpg':        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=85',
  'peppermint.jpg':   'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=85',
  'mint.jpg':         'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=85',
  'pudina.jpg':       'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=85',
  'anjeer.jpg':       'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&auto=format&fit=crop&q=85',
  'almond.jpg':       'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=85',
  'lemon.jpg':        'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=600&auto=format&fit=crop&q=85'
};

async function fix() {
  for (const [file, url] of Object.entries(MAP)) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const dest = path.join(imagesDir, file);
        fs.writeFileSync(dest, buffer);
        fs.writeFileSync(dest.replace(/\.jpg$/, '.png'), buffer);
        fs.writeFileSync(dest.replace(/\.jpg$/, '.svg'), buffer);
        console.log(`  ✅ Downloaded ${file} (${Math.round(buffer.length / 1024)} KB)`);
      } else {
        console.error(`  ❌ HTTP ${res.status} for ${file}`);
      }
    } catch (e) {
      console.error(`  ❌ Error ${file}: ${e.message}`);
    }
  }
}

fix();
