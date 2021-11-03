const path = require('path');
const fs = require('fs');
const filesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.writeFile(bundlePath, '', (err) => {
    if (err) throw err;
});

fs.promises
    .readdir(filesPath, {withFileTypes: true})
    .then((res) => res.forEach(item => {
        if (path.extname(item.name) != '.css') return;
        const itemPath = path.join(filesPath, item.name);
        const readStream = fs.createReadStream(itemPath, 'utf8');
        readStream.on('data', (data) => {
            fs.promises.appendFile(bundlePath, data);
        }); 
    }));