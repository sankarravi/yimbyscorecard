import json
import csv
import pprint
import os

as_json = {}

dir = os.path.dirname(__file__)

input_file = os.path.join(dir, '../data/politicians.csv')
with open(input_file, 'rb') as csvfile:
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

output_file = os.path.join(dir, '../data/politicians.json')
with open(output_file, 'w') as outfile:
  json.dump(as_json, outfile)
