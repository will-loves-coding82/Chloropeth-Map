import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { legacy_createStore as createStore} from 'redux'
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import reportWebVitals from './reportWebVitals';




const actionReducer = (state, action) => {
  return state;
}
const Container = connect(null, null)(App);
const store = createStore(actionReducer);
// render the page
ReactDOM.render(
  <Provider store={store}>
    <Container />
  </Provider>,
  document.getElementById('root')

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
