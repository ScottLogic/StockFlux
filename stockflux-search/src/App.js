import React, { Component } from 'react';
import Search from './components/Search';
import Titlebar from './components/Titlebar';

class App extends Component {
  render() {
    return (
      <div>
        <Titlebar />
        <Search
          favourites={{codes: [], names: {}}}
          selection={{}}
        />
      </div>
    );
  }
}

export default App;
