// Local preview only. Production continues to use the static files.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const routes = new Map([
    ['/', ['index.html', 'text/html; charset=utf-8']],
    ['/index.html', ['index.html', 'text/html; charset=utf-8']],
    ['/style.css', ['style.css', 'text/css; charset=utf-8']],
    ['/script.js', ['script.js', 'text/javascript; charset=utf-8']],
    ['/assets/profile.jpg', ['assets/profile.jpg', 'image/jpeg']],
    ['/assets/favicon.svg', ['assets/favicon.svg', 'image/svg+xml']],
    ['/assets/articles.json', ['assets/articles.json', 'application/json; charset=utf-8']]
]);

const server = http.createServer((request, response) => {
    if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405, { Allow: 'GET, HEAD' }).end();
        return;
    }
    const route = routes.get(request.url.split('?')[0]);
    if (!route) {
        response.writeHead(404).end('Not found');
        return;
    }
    fs.readFile(path.join(root, route[0]), (error, data) => {
        if (error) {
            response.writeHead(500).end('Unable to read file');
            return;
        }
        response.writeHead(200, { 'Content-Type': route[1], 'Cache-Control': 'no-store' });
        response.end(request.method === 'HEAD' ? undefined : data);
    });
});
server.on('error', error => {
    console.error(error.message);
    process.exitCode = 1;
});
server.listen(4173, '127.0.0.1', () => {
    console.log('Preview: http://127.0.0.1:4173');
});
