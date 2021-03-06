"""
 This script was used to create the initial politicians.csv
 file that turned into our Google Spreadsheet at
 https://docs.google.com/spreadsheets/d/1pG5n1P7KdFFCvdTOCpQ3tR0S-Db8dmfN2oOCNfyl27Y.

 We probably don't need to run it again, but it's here for documentation /
 in case we need to rerun that process at some point.
"""
import json
import requests
import urllib
import csv
import os

API_KEY = "AIzaSyCu5mDa-j8751oDEp-pVnj8zjZKnA4A4T0"

dir = os.path.dirname(__file__)

input_file = os.path.join(dir, '../data/politicians.csv')
ocdDivisions = [str(d).strip() for d in open(os.path.join(dir, './ocd_divisions.txt')).readlines()]
zipCodes = [int(z) for z in open(os.path.join(dir, './ca_zip_codes.txt')).readlines()]

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

politicians = sorted(list(politicians), key=lambda tuple: tuple[0])

with open(os.path.join(dir, '../data/politicians.csv'), 'wb') as politicians_file:
  csvwriter = csv.writer(politicians_file)
  csvwriter.writerow(["Open Civic Data Division ID","Role","Name","Score (A-F)","Blurb", "Action Notes"])
  for row in politicians:
    csvwriter.writerow(row)
