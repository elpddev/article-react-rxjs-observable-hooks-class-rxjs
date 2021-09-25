import React from "react";
import Calculator from "./Calculator";
import "./styles.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      calcMode: "scientific"
    };
  }
  render() {
    return <Calculator mode={this.state.calcMode} />;
  }
}
