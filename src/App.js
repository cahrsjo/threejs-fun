import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Globe } from './Globe';
export class App extends Component {
  render() {
    return (
      <Globe />
    );
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);