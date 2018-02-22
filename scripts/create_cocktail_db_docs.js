const fs = require('fs');
const input = require('../json/temp_tk.json');

const recipeFile = fs.createWriteStream('../json/cocktail_db_recipes.json');
const ingredientFile = fs.createWriteStream('../json/cocktail_db_ingredients.json');

const ingredients = new Set();

const getIngredients = oldDrink => {
  const recipeIngredients = [];
  for (let i = 1; i <= 15; i++) {
    const name = oldDrink[`strIngredient${i}`];
    let amount = oldDrink[`strMeasure${i}`];

    if (name !== '' && name !== '\n' && name !== null) {
      if (amount === '\n') amount = '';
      ingredients.add(name);
      recipeIngredients.push({
        name,
        amount
      });
    }
  }
  return recipeIngredients;
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

const getRecipeId = curryIds();
const getIngredientId = curryIds();

const recipes = Object.keys(input).map(id => {
  const oldDrink = input[id];
  const newDrink = {
    '_id': getRecipeId(oldDrink['strDrink']),
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

recipes.forEach(line => recipeFile.write(`${JSON.stringify(line)}\n`));
ingredients.forEach(line => ingredientFile.write(`{"_id": "${getIngredientId(line)}", "name": "${line}"}\n`));

recipeFile.end();
ingredientFile.end();
