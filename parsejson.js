const myJson = require("./iba_official_cocktails.json");
const fs = require('fs');

let file = fs.createWriteStream('input.json');

Object.keys(myJson).map(key => Object.assign({
  "name": key
}, myJson[key])).forEach(line => {
  file.write(JSON.stringify(line) + '\n');
});

file.end();
