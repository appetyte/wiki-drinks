const fs = require('fs');
const input = require('../json/temp_tk.json');

const recipeFile = fs.createWriteStream('../json/cocktail_db_recipes.json');
let ingredients = new Set();

const getIngredients = oldDrink => {
  const recipeIngredients = [];
  for (let i = 1; i <= 15; i++) {
    const _id = oldDrink[`strIngredient${i}`];
    let amount = oldDrink[`strMeasure${i}`];

    if (_id !== '' && _id !== '\n' && _id !== null) {
      if (amount === '\n') amount = '';
      ingredients.add(_id);
      recipeIngredients.push({
        _id,
        amount
      });
    }
  }
  return recipeIngredients;
};

Array.prototype.has = function(id){
  for (let i = 0; i < this.length; i++) {
    if (this[i]["_id"] === id) return this[i];
  }
  return false;
};

const curryIds = (prefix = "") => {
  const counter = {};
  return name => {
    let id = name.split(" ").map(str => str[0]).join('');
    if (counter[id] === undefined) {
      counter[id] = 0;
      return prefix + id;
    } else {
      counter[id]++;
      return prefix + id + '-' + counter[id];
    }
  };
};

const recipes = Object.keys(input).map(id => {
  const oldDrink = input[id];
  const newDrink = {
    '_id': oldDrink['strDrink'],
    'type': 'R',
    'instructions': oldDrink['strInstructions'],
    'alcoholic': oldDrink['strAlcoholic'],
    'category': oldDrink['strCategory'],
    'imgUrl': oldDrink['strDrinkThumb'],
    'glassType': oldDrink['strGlass'],
    'ingredients': getIngredients(oldDrink),
    'recipes': [],
  };
  return newDrink;
});

const ingredientHash = {};
ingredients.forEach(ing => {
  ingredientHash[ing] = [];
});

recipes.forEach(recipe => {
  recipe['ingredients'].forEach(ingredient => {
    ingredientHash[ingredient['_id']].push(recipe['_id']);
  });
});

Object.keys(ingredientHash).forEach(_id => {
  let recipe = recipes.has(_id);
  if (recipe) {
    recipe['type'] = "RI";
    recipe['recipes'] = ingredientHash[_id];
  } else {
    recipes.push({
      '_id': _id,
      'type': 'I',
      'recipes': ingredientHash[_id],
      'ingredients': []
    });
  }
});

recipes.forEach(line => recipeFile.write(`${JSON.stringify(line)}\n`));

recipeFile.end();
