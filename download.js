const https = require('https');
const fs = require('fs');

https.get('https://upload.wikimedia.org/wikipedia/commons/f/f0/Google_Bard_logo.svg', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('bard.svg', data);
    console.log('Downloaded Bard SVG');
  });
});
