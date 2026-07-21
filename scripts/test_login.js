const http = require('http');

http.get('http://localhost:3000/api/auth/csrf', (res) => {
  let body = '';
  const cookies = res.headers['set-cookie'];
  res.on('data', d => body += d);
  res.on('end', () => {
    const csrfToken = JSON.parse(body).csrfToken;
    console.log("Got CSRF Token:", csrfToken);

    const postData = new URLSearchParams({
      email: 'hidalgoiosef@gmail.com',
      password: 'admin123',
      csrfToken: csrfToken
    }).toString();

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/callback/credentials',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'Cookie': cookies ? cookies.join('; ') : ''
      }
    };

    const req = http.request(options, (res2) => {
      console.log(`STATUS: ${res2.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(res2.headers, null, 2)}`);
    });
    req.write(postData);
    req.end();
  });
});
