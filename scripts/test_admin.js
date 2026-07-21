const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET',
  headers: {
    'Cookie': 'authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiYi14d2plNUhCakV6ejgzZHlHbWxLWEhIa2tGcTAzRVZmZWRhTFgtczFFVGd2U0toa1R0MkNOUFFreFhUaDd3NVZTUGN2S0FGVXduWEdsYXFsM3VZaHcifQ..XjVJEOpdJVBMP-Y6cqhs7w._e46YjK5wmS8lOF5NcM7BYDUy0aYDpmay9J8pB-K7lTExq1eK54MZtckSiq35275zgShGh8Vf5IJ-UxdZGr22W84NpNcjQ3OXmcWJ3jvGBEFS9fZz843x_Vlf5I29IbdnbGeBf8eOn4qF--jgrLXlUyCMPhetT218IIIHLAxXfULsVfzOYlLHGO996CPtBsNiUPuAW8BLr5oOIj3keFenpQ9qfPUtviABemI1M17Skk-ylOdLrmoSaLONBjaOgcXWLrKDyIb_v0sa3OURoj7HYRQT6biU-jAdaiLQ1kh9Q0u6Wzx6ov_1r49zxXPeBPApZyDgcJth_5cl6aYFCxdMg.hyfCOdJQcyk9BGKjT6LIL9gPT4ZjemrnBWBkHr5zgyg'
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers, null, 2)}`);
  res.on('data', () => {});
});
req.end();
