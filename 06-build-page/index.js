const path = require('path');
const fs = require('fs');
const { text } = require('stream/consumers');
const { Console } = require('console');
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

    await fs.writeFile(newIndexFilePath, '', (err) => {
        if (err) throw err;
    });

    const readStream = fs.createReadStream(templatePath, 'utf8');
    
        readStream.on('data', (data) => {
        fs.promises.appendFile(newIndexFilePath, data);
    });
    
}

const addComponent = async () => {

    let index = [];

    const readStream = fs.createReadStream(templatePath, 'utf8');
    readStream.on('data', (data) => {
        return data;
    })
    
    console.log(index);

    await fs.promises.readdir(componentsPath, {
        withFileTypes: true
    })
    .then((res) => res.forEach(item => {
        console.log(`{{${path.parse(item.name).name}}}`);   
//                                console.log(str.replace(`{{${path.parse(item.name).name}}}`, *************));
    }));

}

const buildProj = async () => {
    await removeDist(mainPath);
    await deepCopyDir(assetsPath, newAsetsPath);
    await collectStyles(stylesPath, mainPath);
    await createIndex(templatePath);
    await addComponent();
}



buildProj();