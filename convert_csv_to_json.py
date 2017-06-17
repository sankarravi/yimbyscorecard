import json
import csv
import pprint

as_json = []

with open('politicians.csv', 'rb') as csvfile:
  reader = csv.reader(csvfile)
  for row in reader:
    entry = {
      'name': row[2],
      'score': row[3],
      'notes': row[4],
    }
    as_json.append(entry)

with open('politicians.json', 'w') as outfile:
  json.dump(as_json, outfile, indent=4)
