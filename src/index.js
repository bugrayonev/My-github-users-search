import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { Auth0Provider } from "@auth0/auth0-react";
import GithubProvider from "./context/context";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GithubProvider>
 
       <Auth0Provider
      domain={process.env.REACT_APP_DOMAIN_ID}
      clientId={process.env.REACT_APP_CLEINT_ID}
      redirectUri={window.location.origin}
      cacheLocation="localstorage"
    >
      <GithubProvider>
        <App />
      </GithubProvider>
    </Auth0Provider>
  </GithubProvider>
);


serviceWorker.unregister();


