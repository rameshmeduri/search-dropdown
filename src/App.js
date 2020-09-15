import React, { Component } from 'react';
import Dropdown from './Dropdown';
import fruit from './data.json';

class App extends Component {

  state = { fruit };

  resetThenSet = (id, key) => {
    let temp = JSON.parse(JSON.stringify(this.state[key]));
    temp.forEach((item) => (item.selected = false));
    temp[id].selected = true;
    this.setState({
      [key]: temp
    });
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-4 mt-3">
            <Dropdown
              searchable={['Search', 'No Results']}
              title="Select"
              list={this.state.fruit}
              resetThenSet={this.resetThenSet}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
