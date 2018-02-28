getDrinksFromShelf = shelf => {
  const shelfCursor = db.docs.find({
    _id: {
      $in: shelf
    }
  });
  const recipes = new Set();
  const ingredients = [];

  shelfCursor.forEach( ingredient => {
    ingredient['owns'] = true;
    ingredient.recipes.forEach( id => {
      recipes.add(id);
    });
    ingredients.push(ingredient);
  });

  return db.docs.aggregate([
    {
      $match: {
        _id: {$in: Array.from(recipes)}
      }
    },
    {
      $bucket: {
        groupBy: {
          $subtract: [
            {$size: '$ingredients._id'},
            {$size: {$setIntersection: ['$ingredients._id', shelf]}},
          ]
        },
        boundaries: [0,1,2,3,4,5,6,7],
        default: "8+",
        output: {
          "count": { $sum: 1 },
          "recipeNames" : {
            $push: {
              _id: '$_id',
              missingIngredients: {
                $setDifference: [
                  '$ingredients._id',
                  {$setIntersection: ['$ingredients._id', shelf]}
                ]
              }
            }
          }
        }
      }
    }
  ]);
};

aggregateByCategory = () => {
  return db.recipes_v4.aggregate([{
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
  return db.recipes_v4.aggregate([{
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
  return db.recipes_v4.aggregate([{
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

  db.recipes_v4.find().forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      let temp = counterHash[ingredient.name] || 0;
      counterHash[ingredient.name] = temp + 1;
    });
  });

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
