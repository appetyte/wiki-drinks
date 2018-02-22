aggregateByCategory = () => {
  return db.recipes.aggregate([{
      $match: {}
    },
    {
      $group: {
        _id: '$category',
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        count: -1
      }
    }
  ]);
};

aggregateByAlcholic = () => {
  return db.recipes.aggregate([{
      $match: {}
    },
    {
      $group: {
        _id: '$alcoholic',
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        count: -1
      }
    }
  ]);
};

aggregateByGlass = () => {
  return db.recipes.aggregate([{
      $match: {}
    },
    {
      $group: {
        _id: '$glassType',
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        count: -1
      }
    }
  ]);
};

aggregateByIngredients = () => {
  let counterHash = {};
  let arr = [];

  db.recipes.find().forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      let temp = counterHash[ingredient.name] || 0;
      counterHash[ingredient.name] = temp + 1;
    })
  })

  Object.keys(counterHash).forEach(drink => {
    arr.push({
      drink,
      count: counterHash[drink]
    });
  });

  counterHash = {};
  arr.sort((a, b) => a.count < b.count);

  arr.forEach(obj => {
    counterHash[obj.drink] = obj.count;
  });

  return counterHash;
};
