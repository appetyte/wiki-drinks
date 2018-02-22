const fs = require('fs');
const input = require('../json/temp_tk.json');

const file = fs.createWriteStream('../json/cocktail_db.json');

const getIngredients = oldDrink => {
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const name = oldDrink[`strIngredient${i}`];
    let amount = oldDrink[`strMeasure${i}`];

    if (name !== '' && name !== '\n' && name !== null) {
      if (amount === '\n') amount =  '';
      ingredients.push({
        name,
        amount
      });
    }
  }
  return ingredients;
};

const curryIds = () => {
  const counter = {};
  return name => {
    let id = name.split(" ").map(str => str[0]).join('');
    if (counter[id] === undefined) {
      counter[id] = 0;
      return id;
    } else {
      counter[id]++;
      return id + '-' + counter[id];
    }
  };
};

const output = {};
const getId = curryIds();

const docs = Object.keys(input).map(id => {
  const oldDrink = input[id];
  const newDrink = {
    '_id': getId(oldDrink['strDrink']),
    'name': oldDrink['strDrink'],
    'instructions': oldDrink['strInstructions'],
    'alcoholic': oldDrink['strAlcoholic'],
    'category': oldDrink['strCategory'],
    'imgUrl': oldDrink['strDrinkThumb'],
    'glassType': oldDrink['strGlass'],
    'ingredients': getIngredients(oldDrink)
  };
  return newDrink;
});

docs.forEach(line => file.write(`${JSON.stringify(line)}\n`));

file.end();
