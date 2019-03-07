import React, { Component } from 'react';
import './App.css';

import RepositoriesTable from './components/RepositoriesTable'

class App extends Component {
  render() {
    return (
      <div className="App">
        <RepositoriesTable/>
      </div>
    );
  }
}

export default App;
