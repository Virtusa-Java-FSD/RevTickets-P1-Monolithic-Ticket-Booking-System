const http = require('http');

// Test all endpoints
const testEndpoints = [
  '/api/movies',
  '/api/concerts', 
  '/api/events',
  '/api/theaters'
];

console.log('Testing backend endpoints...\n');

testEndpoints.forEach(endpoint => {
  const options = {
    hostname: 'localhost',
    port: 8080,
    path: endpoint,
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        console.log(`✅ ${endpoint}: ${parsed.length} items`);
      } catch (e) {
        console.log(`❌ ${endpoint}: Invalid JSON`);
      }
    });
  });

  req.on('error', (err) => {
    console.log(`❌ ${endpoint}: ${err.message}`);
  });

  req.end();
});