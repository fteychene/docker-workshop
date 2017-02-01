import React, { Component } from 'react';
import ChartistGraph from 'react-chartist'
import logo from './docker.svg';
import './App.css';

var simpleLineChartData = {
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  series: [
    [12, 9, 7, 8, 5],
    [2, 1, 3.5, 7, 3],
    [1, 3, 4, 5, 6]
  ]
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Basic React app for Docker workshop</h2>
        </div>
        <div style={{padding:"50px"}}>
          <p className="App-intro">
            Line chart
          </p>
          <ChartistGraph data={simpleLineChartData} type={'Line'} />
        </div>
      </div>
    );
  }
}

export default App;
