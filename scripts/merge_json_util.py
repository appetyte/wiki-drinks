import glob
import json

new_list = {}

read_files = glob.glob("*.json")

for filename in read_files:
    with open(filename, 'r+') as f:
        dictionary = json.load(f)
        new_list.update(dictionary)

with open('output.json', 'w') as outfile:
    json.dump(new_list, outfile)
