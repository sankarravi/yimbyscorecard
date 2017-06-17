import json
import requests
import urllib
import pprint
import csv

API_KEY = "AIzaSyCu5mDa-j8751oDEp-pVnj8zjZKnA4A4T0"

ocdDivisions = [str(d).strip() for d in open('./ocd_divisions.txt').readlines()]
zipCodes = [int(z) for z in open('./ca_zip_codes.txt').readlines()]

politicians = set()

for division in ocdDivisions:
  payload = {'alt': 'json', 'key': API_KEY}
  urlDivision = urllib.quote_plus(division)
  request = requests.get('https://content.googleapis.com/civicinfo/v2/representatives/%s' % (urlDivision), params=payload)
  response = request.json()

  if 'offices' in response:
    officesInCA = [o for o in response['offices']] 
  else:
    officesInCA = []

  for office in officesInCA:
    for officialIndex in office['officialIndices']:
      politicians.add((office['divisionId'], office['name'], response['officials'][officialIndex]['name']))

for zipCode in zipCodes:
  payload = {'alt': 'json', 'key': API_KEY, 'address': zipCode}
  request = requests.get('https://content.googleapis.com/civicinfo/v2/representatives', params=payload)
  response = request.json()

  if 'offices' in response:
    officesInCA = [o for o in response['offices']] 
  else:
    officesInCA = []

  for office in officesInCA:
    for officialIndex in office['officialIndices']:
      divisionId = office['divisionId']
      if 'state:ca' in divisionId:
        politicians.add((divisionId, office['name'], response['officials'][officialIndex]['name']))


politicians_file = open('./politicians.csv', 'w+')
politicians = sorted(list(politicians), key=lambda tuple: tuple[0])

with open('./politicians.csv', 'wb') as politicians_file:
  csvwriter = csv.writer(politicians_file)
  csvwriter.writerow(["Open Civic Data Division ID","Role","Name","Score (A-F)","Blurb"])
  for row in politicians:
    csvwriter.writerow(row)
