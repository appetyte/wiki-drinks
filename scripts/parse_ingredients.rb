require 'json'

file = File.open("file.json", "r:UTF-8", &:read)
iba_data = JSON.parse(file)

regex = /(.+cl|oz|dashes|barspoon\))\s(.+)$/

iba_data.each do |name, data|
  ingredients = data["ingredients"].split("*").drop(1)
  data["ingredients"] = []

  ingredients.each do |ingredient|
    match = regex.match(ingredient.strip)

    if match.nil?
      ingredient_data = {
        "name": ingredient.strip,
        "amount": ""
      }
    else
      amount, name = match.captures
      ingredient_data = {
        "name": name.to_s,
        "amount": amount.to_s
      }
    end

    data["ingredients"] << ingredient_data
  end
end

File.open("merged_with_parsed_ingredients_objects.json", "w:UTF-8") do |f|
  f.write(JSON.pretty_generate(iba_data))
end
