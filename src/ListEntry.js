import React from 'react';

export default class ListEntry extends React.Component {
  render() {
    const { index } = this.props

    return <div>Hi</div>

    // return (
    //   <div className="row" style={{ marginBottom: '5px' }}>
    //     <div className="col-1 col-md-2"></div>
    //     <div className="col-3 col-md-2">
    //       <a data-toggle="collapse" data-parent="#accordion" href="#collapse{{index}}" aria-expanded="{{defaultExpand}}" aria-controls="collapse{{index}}">{{officialName}}</a>
    //     </div>
    //     <div className="col-5 col-md-4">
    //      {{officialTitle}}
    //      {{#if actionNotes}}
    //       <b> (action alert!)</b>
    //      {{/if}}
    //     </div>
    //     <div className="col-3 col-md-2">
    //       <span className="badge badge-default badge-pill">{{officialScore}}</span>
    //       <a data-toggle="collapse" data-parent="#accordion" href="#collapse{{index}}" aria-expanded="{{defaultExpand}}" aria-controls="collapse{{index}}">
    //         {{#if officialScore}}
    //           Score Card
    //         {{else}}
    //           Details
    //         {{/if}}
    //       </a>
    //     </div>
    //   </div>

    //   <div id="collapse{{index}}" className="collapse {{#if defaultExpand}}show{{/if}}" role="tabpanel" aria-labelledby="headingOne">
    //     <div className="card"  style={{ border: 'none', boxShadow: 'none' }}">
    //       <div className="card-block">

    //         <div className="row" style={{ padding: '10px' }}>
    //           <div className="col-0 col-md-2"></div>

    //           <div className="col-12 col-md-8">
                
    //             <div className="card">
    //               <div className="card-header">
    //                 <div className="row">
    //                   <div className="col-8"><h4>{{officialName}}</h4></div>
    //                   {{#if officialScore}}
    //                     <div className="col-4 text-right"><h4>YIMBY Score: {{officialScore}}</h4></div>
    //                   {{/if}}
    //                 </div>
    //               </div>
                 
    //               <div className="card-block">
    //                 <p className="card-text">
    //                   {{#if photoUrl}}
    //                     <img style={{ width: '150px', padding: '0px 15px 0px 0px' }} align="left" src="{{photoUrl}}" alt="Card image cap">
    //                   {{/if}}
    //                   <p><b>{{actionNotes}}</b></p>
    //                   {{#if yimbyMailerLink}}
    //                     <a className="btn btn-primary" target="_blank" href="{{yimbyMailerLink}}">
    //                       YIMBY Mailer
    //                     </a>
    //                   {{/if}}
    //                   <p>{{notes}}</p>
    //                 </p>
    //               </div>
    //               <div className="card-block row">
    //                 <div className="col-md-12 col-lg">Contact:</div>
    //                 {{#each emails as |email emailId|}}
    //                   <div className="card-block-item col-12 col-md">
    //                     <a href="mailto:{{email}}">{{email}}</a>
    //                   </div>
    //                 {{/each}}
    //                 {{#each phones as |phone phoneId|}}
    //                   <div className="card-block-item col-12 col-md">
    //                     <a href="tel:{{phone}}" className="card-link">{{phone}}</a>
    //                   </div>
    //                 {{/each}}
    //                 {{#if twitter}}
    //                   <div className="card-block-item col-12 col-md">
    //                     <a href="https://twitter.com/{{twitter}}" target="_blank" className="card-link">@{{twitter}}</a>
    //                   </div>
    //                 {{/if}}
    //               </div>
    //               {{#if url}}
    //                 <div className="card-block">
    //                   <a href="{{url}}" target="_blank" className="card-link">{{url}}</a>
    //                 </div>
    //                 {{/if}}
                    
    //             </div>
    //           <div className="col-2"></div>
    //         </div>

    //       </div>
    //     </div>
    //   </div>
    // )
  }
}
