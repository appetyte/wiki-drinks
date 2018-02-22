const fs = require('fs');
const ibaOfficialCocktails = require('../json/iba_official_cocktails.json');

const file = fs.createWriteStream('../json/input.json');

Object.keys(ibaOfficialCocktails)
  .map(name => Object.assign({ name }, ibaOfficialCocktails[name]))
  .forEach(line => file.write(`${JSON.stringify(line)}\n`));

file.end();
