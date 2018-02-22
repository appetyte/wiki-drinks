aggregateByType = () => {
  return db.recipes.aggregate([{
      $match: {}
    },
    {
      $group: {
        _id: '$type',
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
  let ingdList = db.recipes.distinct('ingredients.name');
  let counterHash = {};
  let arr = [];

  db.recipes.find().forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      let temp = counterHash[ingredient.name] || 0;
      counterHash[ingredient.name] = temp + 1;
    })
  })

  Object.keys(counterHash).forEach(_id => {
    arr.push({
      _id,
      count: counterHash[_id]
    });
  });

  arr.sort((a, b) => a.count < b.count);
  return arr;
};
