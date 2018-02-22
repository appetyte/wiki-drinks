const fs = require('fs');
const txtparse = require('txtwiki');
const json = require('./file.json');

Object.keys(json).forEach((key) => {
  json[key].ingredients = txtparse.parseWikitext(json[key].ingredients);
});

const jsonOut = JSON.stringify(json);
fs.writeFile('output_file.json', jsonOut, 'utf8');
