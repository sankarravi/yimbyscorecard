"""
  Pulls the latest data from the YIMBY Scorecard Google Sheet
  (https://docs.google.com/spreadsheets/d/1pG5n1P7KdFFCvdTOCpQ3tR0S-Db8dmfN2oOCNfyl27Y)
  and converts it to JSON that the app can use.

  Mostly copied from https://developers.google.com/sheets/api/quickstart/python
"""
from __future__ import print_function
import httplib2
import os
import json

from apiclient import discovery
from oauth2client import client
from oauth2client import tools
from oauth2client.file import Storage

try:
  import argparse
  flags = argparse.ArgumentParser(parents=[tools.argparser]).parse_args()
except ImportError:
  flags = None

# If modifying these scopes, delete your previously saved credentials
# at ~/.credentials/sheets.googleapis.com-python-yimbyscorecard.json
SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly'
cur_dir = os.path.dirname(__file__)
CLIENT_SECRET_FILE = os.path.join(cur_dir, 'google_client.json')
APPLICATION_NAME = 'YIMBY Scorecard'


def get_credentials():
  """
    Gets valid user credentials from storage or run an OAuth2 flow
  """
  home_dir = os.path.expanduser('~')
  credential_dir = os.path.join(home_dir, '.credentials')
  if not os.path.exists(credential_dir):
    os.makedirs(credential_dir)
  credential_path = os.path.join(credential_dir,
                   'sheets.googleapis.com-python-yimbyscorecard.json')

  store = Storage(credential_path)
  credentials = store.get()
  if not credentials or credentials.invalid:
    flow = client.flow_from_clientsecrets(CLIENT_SECRET_FILE, SCOPES)
    flow.user_agent = APPLICATION_NAME
    if flags:
      credentials = tools.run_flow(flow, store, flags)
    else: # Needed only for compatibility with Python 2.6
      credentials = tools.run(flow, store)
    print('Storing credentials to ' + credential_path)
  return credentials

def main():
  """
  """
  credentials = get_credentials()
  http = credentials.authorize(httplib2.Http())
  discoveryUrl = ('https://sheets.googleapis.com/$discovery/rest?'
          'version=v4')
  service = discovery.build('sheets', 'v4', http=http,
                discoveryServiceUrl=discoveryUrl)

  spreadsheetId = '1pG5n1P7KdFFCvdTOCpQ3tR0S-Db8dmfN2oOCNfyl27Y'
  rangeName = 'politicians!C2:F'
  result = service.spreadsheets().values().get(
    spreadsheetId=spreadsheetId, range=rangeName).execute()
  values = result.get('values', [])

  as_json = {}

  if not values:
    print('No data found.')
  else:
    print('Updating politicians.json')
    for row in values:
      row += ['' for i in range(4 - len(row))]
      name = row[0]
      entry = {
        'name': name,
        'score': row[1],
        'notes': row[2],
        'actionNotes': row[3],
      }
      
      # we'll be looking people up by name, since we don't have any real IDs
      as_json[name] = entry

  cur_dir = os.path.dirname(__file__)
  output_file = os.path.join(cur_dir, '../data/politicians.json')
  with open(output_file, 'w') as outfile:
    json.dump(as_json, outfile)


if __name__ == '__main__':
  main()
