import json
import csv
import pprint

as_json = {}

with open('politicians.csv', 'rb') as csvfile:
  reader = csv.reader(csvfile)
  next(reader, None)
  for row in reader:
    name = row[2]
    entry = {
      'name': name,
      'score': row[3],
      'notes': row[4],
      'actionNotes': row[5],
    }
    # we'll be looking people up by name, since we don't have any real IDs
    as_json[name] = entry

with open('politicians.json', 'w') as outfile:
  json.dump(as_json, outfile)
