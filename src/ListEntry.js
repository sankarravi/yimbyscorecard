import React from 'react';
import { find, propEq } from 'ramda';
import classnames from 'classnames';

var caAssemblyDistrictRe = /state:ca\/sldl:(\d+)/;
var caSenateDistrictRe = /state:ca\/sldu:(\d+)/;
var emailText =
  'body=As%20your%20constituent%20and%20a%20member%20of%20the%20pro-housing%20YIMBY%20movement%2C%20I%20ask%20you%20to%20please%20vote%20in%20favor%20of%20the%20Housing%20Package%20that%20will%20increase%20both%20overall%20housing%20production%20and%20funding%20for%20Affordable%20Housing.%20We%20hope%20this%20package%20will%20include%20bills%20like%20SB%2035%2C%20SB%202%2C%20SB%203%2C%20AB%20678%2FSB167%2C%20and%20any%20other%20bills%20that%20will%20create%20significantly%20more%20housing.%0A%0ACalifornia%20is%20experiencing%20a%20SEVERE%20housing%20shortage%20that%20is%20devastating%20to%20low-income%20people%2C%20stunting%20young%20people%2C%20and%20driving%20Californians%20to%20commute%20long%20distances%20for%20work.%20Every%20city%20needs%20to%20do%20its%20part%20to%20bring%20down%20prices%20by%20building%20more%20housing.%0A%0AWe%20need%20to%20streamline%20housing%20production%20to%20create%20more%20subsidized%20Affordable%20Housing%20and%20make%20market%20rate%20housing%20more%20affordable.%0A%0AThis%20housing%20package%20is%20major%20step%20towards%20addressing%20the%20needs%20of%20low-income%20Californians.%20About%201.7%20million%20low-income%20California%20renters%20spend%20more%20than%20half%20their%20income%20on%20housing.%20We%20need%20policies%20that%20increase%20funding%20for%20low-income%20housing%20projects%20and%20speed%20up%20the%20production%20of%20all%20housing%20NOW.%0A%0APlease%20support%20a%20housing%20package%20that%20takes%20major%20steps%20in%20the%20right%20direction.%0A%0AThank%20you.';

const getYimbyMailerLink = divisionId => {
  const assemblyMatch = divisionId.match(caAssemblyDistrictRe);
  const senateMatch = divisionId.match(caSenateDistrictRe);

  let yimbyMailerLink = undefined;
  if (assemblyMatch && assemblyMatch.length === 2) {
    yimbyMailerLink =
      'https://sf-yimby-emailer.appspot.com/asm-district-' + assemblyMatch[1];
  } else if (senateMatch && senateMatch.length === 2) {
    yimbyMailerLink =
      'https://sf-yimby-emailer.appspot.com/senate-district-' + senateMatch[1];
  }

  if (yimbyMailerLink !== undefined) {
    yimbyMailerLink += '?' + emailText;
  }

  return yimbyMailerLink;
};

const ListEntryHeader = props => {
  const { index, office, official, politicianExtraData } = props;

  const { actionNotes } = politicianExtraData;
  const defaultExpand = actionNotes && actionNotes.trim() !== '';

  return (
    <div className="row" style={{ marginBottom: '5px' }}>
      <div className="col-1 col-md-2" />
      <div className="col-3 col-md-2">
        <a
          data-toggle="collapse"
          data-parent="#accordion"
          href={`#collapse${index}`}
          aria-expanded={defaultExpand}
          aria-controls={`collapse${index}`}
        >
          {official.name}
        </a>
      </div>
      <div className="col-5 col-md-4">
        {office.name}
        {actionNotes && <b> (action alert!)</b>}
      </div>
      <div className="col-3 col-md-2">
        <span className="badge badge-default badge-pill">
          {politicianExtraData.score}
        </span>
        <a
          data-toggle="collapse"
          data-parent="#accordion"
          href={`#collapse${index}`}
          aria-expanded={defaultExpand}
          aria-controls={`collapse${index}`}
        >
          Details
        </a>
      </div>
    </div>
  );
};

const ListEntryExpandable = props => {
  const { index, office, official, politicianExtraData } = props;

  const { actionNotes, score } = politicianExtraData;
  const defaultExpand = actionNotes && actionNotes.trim() !== '';

  const classNames = classnames(['collapse', defaultExpand && 'show']);

  const yimbyMailerLink = getYimbyMailerLink(office.divisionId);

  const emails = official.emails || [];
  const phones = official.phones || [];
  const twitter = find(propEq('type', 'Twitter'), official.channels || []);
  const url = (official.urls || [])[0];

  return (
    <div
      id={`collapse${index}`}
      className={classNames}
      role="tabpanel"
      aria-labelledby="headingOne"
    >
      <div className="card" style={{ border: 'none', boxShadow: 'none' }}>
        <div className="card-block">
          <div className="row" style={{ padding: '10px' }}>
            <div className="col-0 col-md-2" />

            <div className="col-12 col-md-8">
              <div className="card">
                <div className="card-header">
                  <div className="row">
                    <div className="col-8">
                      <h4>{official.name}</h4>
                    </div>
                    {score && (
                      <div className="col-4 text-right">
                        <h4>YIMBY Score: {score}</h4>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-block">
                  <p className="card-text">
                    {official.photoUrl && (
                      <img
                        style={{ width: '150px', padding: '0px 15px 0px 0px' }}
                        align="left"
                        src={official.photoUrl}
                        alt={official.name}
                      />
                    )}
                    <p>
                      <b>{actionNotes}</b>
                    </p>
                    {yimbyMailerLink && (
                      <a
                        className="btn btn-primary"
                        target="_blank"
                        href={yimbyMailerLink}
                      >
                        YIMBY Mailer
                      </a>
                    )}
                    <p>{politicianExtraData.notes}</p>
                  </p>
                </div>
                <div className="card-block row">
                  <div className="col-md-12 col-lg">Contact:</div>
                  {emails.map(email => (
                    <div className="card-block-item col-12 col-md">
                      <a href={`mailto:${email}`}>{email}</a>
                    </div>
                  ))}
                  {phones.map(phone => (
                    <div className="card-block-item col-12 col-md">
                      <a href={`tel:${phone}`} className="card-link">
                        {phone}
                      </a>
                    </div>
                  ))}
                  {twitter &&
                  twitter.id && (
                    <div className="card-block-item col-12 col-md">
                      <a
                        href={`https://twitter.com/${twitter.id}`}
                        target="_blank"
                        className="card-link"
                      >
                        @{twitter.id}
                      </a>
                    </div>
                  )}
                </div>
                {url && (
                  <div className="card-block">
                    <a href={url} target="_blank" className="card-link">
                      {url}
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="col-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default class ListEntry extends React.Component {
  static defaultProps = {
    office: {},
    official: {},
    politicianExtraData: {},
  };

  render() {
    return (
      <div>
        <ListEntryHeader {...this.props} />
        <ListEntryExpandable {...this.props} />
      </div>
    );
  }
}
