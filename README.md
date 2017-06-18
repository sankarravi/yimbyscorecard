# yimbyscorecard

h1. Overview

This project uses the Google Civic Information API (https://developers.google.com/civic-information/) to get the list of representatives for an address and display their contact info, alongside curated notes / a YIMBY grade.

The notes and grade come from a spreadsheet (data/politicians.csv), which gets converted to JSON by a script (scripts/convert_csv_to_json.py). The initial list in the spreadsheet was created by crawling the Civic Information API with another script (scripts/pull_list_of_politicians.py).

The site is hosted on Github Pages.
