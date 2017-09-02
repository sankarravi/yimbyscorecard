import React from 'react';
import queryString from 'query-string';

export default class IndexPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      address: '',
      zipcode: '',
    }
  }

  submitAddress = () => {
    const qs = queryString.stringify({
      address: this.state.address,
      zipcode: this.state.zipcode,
    })

    const url = `/list?${qs}`;
    this.props.history.push(url);
  }

  formIsValid = () => {
    return this.state.address !== '' && this.state.zipcode !== ''
  }

  updateField = (fieldName) => (e) => {
    this.setState({ [fieldName]: e.target.value })
  }

  render() {
    return (
      <div className="IndexPage container">
        <h2 className="display-4 text-center">
          YIMBY Representative Tracker
        </h2>
        <p className="lead text-center">
          Find your reps and take action!
        </p>
        <hr className="my-4" />

        <form
          id="addressForm"
          onSubmit={this.submitAddress}
        >
          <div className="form-row addressForm">
            <div className="col-4">
              <input
                id="address"
                className="form-control form-control-lg"
                type="text"
                placeholder="Enter your street address"
                onChange={this.updateField('address')}
                required={true}
                value={this.state.address}
              />
            </div>
            <div className="col-2">
              <input
                id="zipcode"
                className="form-control form-control-lg"
                type="number"
                placeholder="zipcode"
                onChange={this.updateField('zipcode')}
                required={true}
                value={this.state.zipcode}
              />
            </div>
            <div className="col-2">
              <button
                type="submit"
                className="btn btn-primary btn-lg pull-right"
                disabled={!this.formIsValid()}
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
