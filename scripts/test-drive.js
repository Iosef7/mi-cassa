const https = require('https');

https.get('https://drive.google.com/file/d/1oVHpWppLMr49NUQJAVM-CDWAMhUhm-yA/preview', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const match = data.match(/<meta property="og:image" content="([^"]+)"/);
    console.log(match ? match[1] : 'no match');
  });
});
