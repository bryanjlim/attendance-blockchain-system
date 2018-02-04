import React from 'react';
import ReactDOM from 'react-dom';
import './styling/index.css';
import App from './App';
import registerServiceWorker from './javascripts/RegisterServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
