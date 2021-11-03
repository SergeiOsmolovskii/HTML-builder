const path = require('path');
const fs = require('fs');
const filePath = path.join(__dirname, 'secret-folder');

fs.promises
    .readdir(filePath, {
        withFileTypes: true
    })
    .then((res) => res.forEach(item => {
        if (!item.isFile()) return;
        const itemPath = path.join(__dirname, 'secret-folder', item.name);
        fs.stat(itemPath, (err, stats) => {
            if (err) throw err;
            console.log(`${path.parse(item.name).name} - ${(path.extname(item.name)).slice(1)} - ${(stats.size / 1024).toFixed(3)}kb`);
        });
    }));
