import wptools
import json
from time import sleep

ibas = [
  "Bellini (cocktail)",
  "Black Russian",
  "Bloody Mary (cocktail)",
  "Caipirinha",
  "Champagne Cocktail",
  "Cosmopolitan (cocktail)",
  "Cuba Libre",
  "French 75 (cocktail)",
  "French Connection (cocktail)",
  "Godfather (cocktail)",
  "Golden dream (cocktail)",
  "Grasshopper (cocktail)",
  "Harvey Wallbanger",
  "Hemingway Special",
  "Horse's Neck",
  "Irish Coffee",
  "Kir (cocktail)",
  "Long Island Iced Tea",
  "Mai Tai",
  "Margarita",
  "Mimosa (cocktail)",
  "Mint Julep",
  "Mojito",
  "Moscow Mule",
  "Piña Colada",
  "Rose (cocktail)",
  "Sea Breeze (cocktail)",
  "Sex on the Beach",
  "Singapore Sling",
  "Tequila Sunrise (cocktail)",
  "B-52 (cocktail)",
  "Barracuda (cocktail)",
  "Bramble (cocktail)",
  "Dark 'N' Stormy",
  "Espresso Martini",
  "French Martini",
  "Kamikaze (cocktail)",
  "Lemon Drop Martini",
  "Martini (cocktail)",
  "Pisco sour",
  "Russian Spring Punch",
  "Spritz Veneziano",
  "Tommy's Margarita",
  "Vampiro (cocktail)",
  "Vesper (cocktail)",
  "Yellow Bird (cocktail)",
  "Alexander (cocktail)",
  "Americano (cocktail)",
  "Angel Face (cocktail)",
  "Aviation (cocktail)",
  "Bacardi cocktail",
  "Between the Sheets (cocktail)",
  "Casino (cocktail)",
  "Clover Club Cocktail",
  "Daiquiri",
  "Derby (cocktail)",
  "Fizz (cocktail)",
  "John Collins (cocktail)",
  "Manhattan (cocktail)",
  "Mary Pickford (cocktail)",
  "Monkey Gland",
  "Negroni",
  "Old Fashioned",
  "Paradise (cocktail)",
  "Planter's Punch",
  "Porto flip",
  "Rusty Nail (cocktail)", # FIXME
  "Sazerac",
  "Screwdriver (cocktail)",
  "Sidecar (cocktail)",
  "Sour (cocktail)",
  "Stinger (cocktail)",
  "Tuxedo (cocktail)",
  "Whiskey sour"
]

iba_data = {};

def field_data(field_name):
    if field_name in page.data['infobox']:
        return page.data['infobox'][field_name]
    else:
        return ''

for iba in ibas:
    page = wptools.page(iba)
    page.get_parse()

    name = page.data['infobox']['name']
    garnish = field_data('garnish')
    ingredients = field_data('ingredients')
    drinkware = field_data('drinkware')
    prep = field_data('prep')
    served = field_data('served')
    notes = field_data('notes')
    type = field_data('type')

    if page.images():
        img_url = page.images()[0]['url']
    else:
        img_url = ''

    summary = page.get_restbase('/page/summary/').data['exrest']

    iba_data[name] = {
        'summary': summary,
        'prep': prep,
        'ingredients': ingredients,
        'drinkware': drinkware,
        'prep': prep,
        'notes': notes,
        'served': served,
        'type': type,
        'img_url': img_url,
        'garnish': garnish
    }

    sleep(5)

with open('iba_data.json', 'w') as outfile:
    json.dump(iba_data, outfile)
