const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2'
};

const server = http.createServer(function (req, res) {
    // Quita parametros (?x=1) y decodifica caracteres especiales
    var urlPath = decodeURIComponent(req.url.split('?')[0]);
    var filePath = urlPath === '/' ? '/index.html' : urlPath;
    filePath = path.join(PUBLIC_DIR, filePath);

    // Seguridad: no permitir salir de la carpeta public
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>403 - Acceso denegado</h1>');
        return;
    }

    var ext = path.extname(filePath).toLowerCase();
    var contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>404 - Archivo no encontrado</h1>');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, function () {
    console.log('Servidor corriendo en http://localhost:' + PORT);
});