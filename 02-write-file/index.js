const fs = require('fs');
const readline = require('readline');
const process = require('process');
const path = require('path');
const filePath = path.join(__dirname, 'data.txt');

const rl = readline.createInterface({
  input: process.stdin
});

fs.writeFile(filePath, '', (err) => {
  if (err) throw err;
})

console.log('Write some text');

process.stdin.on('data', (data) => {
  fs.appendFile(filePath, data.toString(), function(error) {
    if (error) throw error;
  });
});

rl.on('line', (line) => {
  if (line.trim() === 'exit') {
    console.log('Goodbye');
    process.exit();
  }
});

process.on('SIGINT', () => {
  console.log('Goodbye');
  process.exit();
}); 