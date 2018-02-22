const fs = require('fs');
const input = require('../json/temp_tk.json');

const file = fs.createWriteStream('../json/cocktail_db.json');

const getIngredients = oldDrink => {
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const name = oldDrink[`strIngredient${i}`];
    let amount = oldDrink[`strMeasure${i}`];

    if (name !== '' && name !== '\n') {
      if (amount === '\n') amount =  '';
      ingredients.push({
        name,
        amount
      });
    }
  }
  return ingredients;
};

Object.keys(input).map(id => {
  const oldDrink = input[id];
  const newDrink = {
    'name': oldDrink['strDrink'],
    'instructions': oldDrink['strInstructions'],
    'alcoholic': oldDrink['strAlcoholic'],
    'category': oldDrink['strCategory'],
    'imgUrl': oldDrink['strDrinkThumb'],
    'glass type': oldDrink['strGlass'],
    'IBA': oldDrink['strIBA'],
    'videoUrl': oldDrink['strVideo'],
    'ingredients': getIngredients(oldDrink)
  };
  return newDrink;
}).forEach(line => file.write(`${JSON.stringify(line)}\n`));

// tempArray.forEach(line => file.write(`${JSON.stringify(line)}\n`));

// const fs = require('fs');
// const ibaOfficialCocktails = require('../json/iba_official_cocktails.json');
//
// const file = fs.createWriteStream('../json/input.json');
//
// Object.keys(ibaOfficialCocktails)
//   .map(name => Object.assign({ name }, ibaOfficialCocktails[name]))
//   .forEach(line => file.write(`${JSON.stringify(line)}\n`));
//
file.end();
