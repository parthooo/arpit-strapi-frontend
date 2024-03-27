import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import './main.css';

const domain = 'partho.us.auth0.com';
const clientId = 'oGHU6tcca8d0XC9ltVO7idhIMoVy81zj';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
      >
        <App />
      </Auth0Provider>
    </Router>
  </React.StrictMode>,
)