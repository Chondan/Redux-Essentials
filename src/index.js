import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import store from "./app/store";
import { Provider } from 'react-redux';
import "./api/server";
import { fetchUsers } from './features/users/usersSlice';

store.dispatch(fetchUsers());

ReactDOM.render(
  <Provider store={store}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
