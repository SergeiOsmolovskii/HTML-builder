const path = require('path');
const fs = require('fs');
const filePath = path.join(__dirname, 'files');
const copyFilePath = path.join(__dirname, 'files-copy');

fs.promises.mkdir(copyFilePath, {
    recursive: true
}, (err) => {
    if (err) throw err;
});

const copyDir = async (filePath, copyFilePath) => {
    let newFilesNames = [];

    try {
        await fs.promises
            .readdir(filePath, {withFileTypes: true
            })
            .then((res) => res.forEach(item => {
                const filesSRC = path.join(filePath, item.name);
                const filesDest = path.join(copyFilePath, item.name);
                fs.promises.copyFile(filesSRC, filesDest);
                newFilesNames.push(item.name);
            }));

        await fs.promises
            .readdir(copyFilePath, {withFileTypes: true
            })
            .then((res) => res.forEach(item => {
                if (!newFilesNames.includes(item.name)) {
                    const deleteFilePath = path.join(copyFilePath, item.name);
                    fs.promises.rm(deleteFilePath);
                }
            }));

    } catch (err) {
        throw err;
    }
}

copyDir(filePath, copyFilePath);