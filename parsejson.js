const myJson = require("./iba_official_cocktails.json");
const fs = require('fs');

let data = Object.keys(myJson);

data = data.map(key => {
  let temp = myJson[key];
  temp["name"] = key;
  return temp;
});

let file = fs.createWriteStream('input.txt');

data.forEach( line => {
  file.write(JSON.stringify(line) + '\n');
});

file.end();
