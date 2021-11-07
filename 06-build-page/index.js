const path = require('path');
const fs = require('fs');
const mainPath = path.join(__dirname, 'project-dist');
const newIndexFilePath = path.join(mainPath, 'index.html');
const assetsPath = path.join(__dirname, 'assets');
const stylesPath = path.join(__dirname, 'styles');
const newAsetsPath = path.join(mainPath, 'assets');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');

fs.promises.mkdir(mainPath, {recursive: true}, (err) => {
    if (err) throw err;
});

const deepCopyDir = async (itemPath, copyItemPath) => {
    await fs.promises.mkdir(copyItemPath, {recursive: true}, (err) => {
        if (err) throw err;
    });
    
    const items = await fs.promises.readdir(itemPath, {withFileTypes:true});

    for (let item of items) {
        const srcPath = path.join(itemPath, item.name);
        const destPath = path.join(copyItemPath, item.name);
        
        if (item.isDirectory()) await deepCopyDir(srcPath, destPath);
        else await fs.promises.copyFile(srcPath, destPath);
    }
}

const removeDist = async (path) => {
    await fs.promises.rm(path, {recursive: true}, (err) => {
        if (err) throw err;
    });
}

const collectStyles = async (stylePath, mainPath) => {
    const newStyleFilePath = path.join(mainPath, 'style.css');

    fs.writeFile(newStyleFilePath, '', (err) => {
        if (err) throw err;
    });

    await fs.promises.readdir(stylePath, {withFileTypes: true})
        .then((res) => res.forEach(item => {
            if (path.extname(item.name) != '.css') return;
            const itemPath = path.join(stylePath, item.name);
            const readStream = fs.createReadStream(itemPath, 'utf8');
            readStream.on('data', (data) => {
                fs.promises.appendFile(newStyleFilePath, data);
            });
        }));
}

const createIndex = async (templatePath) => {
    fs.writeFile(newIndexFilePath, '', (err) => {
        if (err) throw err;
    });

    const readStream = fs.createReadStream(templatePath, 'utf8');
    readStream.on('data', (data) => {
        fs.promises.appendFile(newIndexFilePath, data);
    });
}

const addComponent = async () => {
    const templateFile = fs.promises.readFile(templatePath, 'utf8');
    let templateFileData = await templateFile;
    let arr = [];
    let fileNames = [];

    fs.readdir(componentsPath, {
        withFileTypes: true
    }, (err, data) => {
        if (err) throw err;
        data.forEach(item => {
            if (path.extname(item.name) != '.html') return;
            const fileName = `{{${path.parse(item.name).name}}}`;
            const filePath = path.join(componentsPath, item.name);
            let componentFile = fs.promises.readFile(filePath, 'utf8');
            arr.push(componentFile);
            fileNames.push(fileName);
        });

        Promise.all(arr).then(val => {
            val.forEach((item, index) => {
                templateFileData = templateFileData.replace(fileNames[index], item);
            });
            fs.writeFile(newIndexFilePath, templateFileData, (err) => {
                if (err) throw err;
            });
        });
    });
}

const buildProj = async () => {
    await removeDist(mainPath);
    await deepCopyDir(assetsPath, newAsetsPath);
    await collectStyles(stylesPath, mainPath);
    await createIndex(templatePath);
    await addComponent();
}

buildProj();