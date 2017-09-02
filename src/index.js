import React from 'react';
import { render } from 'react-snapshot';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'

import './index.css';
import IndexPage from './IndexPage';
import ListPage from './ListPage';
import registerServiceWorker from './registerServiceWorker';

render(
  <Router>
    <div className="App">
      <Route exact path="/" component={IndexPage}/>
      <Route path="/list" component={ListPage}/>
    </div>
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();
