const path = require('path');
const fs = require('fs');
const filePath = path.join(__dirname, 'files');
const copyFilePath = path.join(__dirname, 'files-copy');


fs.promises.mkdir(copyFilePath, {recursive: true}, (err) => {
    if (err) throw err;
});

const  copyDir = (filePath, copyFilePath) => {

    fs.promises
    .readdir(filePath, {withFileTypes: true})
    .then((res) => res.forEach(item => {
        const filesSRC = path.join(filePath, item.name);
        const filesDest = path.join(copyFilePath, item.name);
        fs.promises.copyFile(filesSRC, filesDest);
    }));
}

copyDir(filePath, copyFilePath);