import React from 'react';
import queryString from 'query-string';

import ListEntry from './ListEntry';
import politiciansExtraData from './politicians.json';

const gapi = window.gapi;
const API_KEY = 'AIzaSyCu5mDa-j8751oDEp-pVnj8zjZKnA4A4T0';

export default class ListPage extends React.Component {
  constructor(props) {
    super(props);

    const paramString = this.props.location.search;
    const params = paramString ? queryString.parse(paramString) : {};

    this.state = {
      address: params.address || '',
      zipcode: params.zipcode || '',
      results: {},
    };
  }

  componentDidMount() {
    gapi.load('client', () => {
      gapi.client.setApiKey(API_KEY);

      if (this.state.address !== '' && this.state.zipcode !== '') {
        this.fetchResults();
      }
    });
  }

  fetchResults = () => {
    const address = `${this.state.address}, ${this.state.zipcode}`;

    const req = gapi.client.request({
      path: '/civicinfo/v2/representatives',
      params: {
        address: address,
        key: API_KEY,
      },
    });

    req.execute(response => {
      this.setState({
        results: response || {},
      });
    });
  };

  getRelevantOffices = () => {
    const relevantStateRoles = [
      'Governor',
      'Lieutenant Governor',
      'United States Senate',
    ];
    const allOffices = this.state.results.offices || [];

    // Goals:
    // 1. Exclude the President, VP, National Senate, etc.
    // 2. Exclude state-level officials like Treasurers that we won't be lobbying (in CA)
    return allOffices.filter(office => {
      const isNationalOffice = office.divisionId.indexOf('state:') === -1;
      const isIgnorableStateOffice =
        office.divisionId === 'ocd-division/country:us/state:ca' &&
        relevantStateRoles.indexOf(office.name) === -1;

      return !isNationalOffice && !isIgnorableStateOffice;
    });
  };

  renderPoliticianResults() {
    const officeOfficialPairs = [];
    // 1. Filter the list of offices down to ones we actually want to display
    // 2. Figure out the officials associated with those offices, so we have
    //    a list of (office, official) groups that we can render
    this.getRelevantOffices().forEach(office => {
      office.officialIndices.forEach(officialIndex => {
        officeOfficialPairs.push({
          office: office,
          official: this.state.results.officials[officialIndex],
        });
      });
    });

    return officeOfficialPairs.map((pair, index) => (
      <ListEntry
        key={index}
        office={pair.office}
        official={pair.official}
        politicianExtraData={politiciansExtraData[pair.official.name]}
        index={index}
      />
    ));
  }

  render() {
    return (
      <div className="ListPage">
        <nav className="navbar navbar-dark bg-dark">
          <a className="navbar-brand" href="./">
            YIMBY Representative Tracker
          </a>
        </nav>

        <div className="container">
          <div className="row">
            <div className="col" style={{ padding: '20px' }}>
              <form id="addressForm" onSubmit={this.submitAddress}>
                <div className="form-row addressForm">
                  <div
                    className="col-8 col-sm-2"
                    style={{ marginBottom: '10px' }}
                  >
                    <input
                      id="address"
                      className="form-control"
                      type="text"
                      placeholder="Enter your street address"
                      required={true}
                      value={this.state.address}
                    />
                  </div>
                  <div className="col-4 col-sm-1">
                    <input
                      id="zipcode"
                      className="form-control"
                      type="number"
                      placeholder="zipcode"
                      required={true}
                      value={this.state.zipcode}
                    />
                  </div>
                  <div className="col-12 col-sm-1">
                    <button
                      type="submit"
                      className="btn btn-outline-primary btn-block"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div id="accordion" role="tablist" aria-multiselectable="true">
            {this.renderPoliticianResults(this.state.results)}
          </div>
        </div>
      </div>
    );
  }
}
