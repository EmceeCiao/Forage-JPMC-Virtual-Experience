import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],

  // Adding showGraph Boolean Property Below:

  showGraph: boolean,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      // hiding initial state of graph
      showGraph: false,
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
  //Tried doing this.showGraph without state and it didn't work
  //Doing this.state.showGraph in order to not have it render before button is clicked
    if (this.state.showGraph) {
    return (<Graph data={this.state.data}/>)
  }
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
  // Defining x in order to serve as a stopping condition later in tandem with clearInterval
    let x = 0;
    const interval = setInterval(() => {
        DataStreamer.getData((serverResponds: ServerRespond[]) => {
      // Update the state by creating a new array of data that consists of
      // Previous data in the state and the new data from server
      // set showGraph to true when setting state as we want to see the graph when we hit start streaming
      // Figured out that using set interval on the entire function leads to values not showing after a while
            this.setState({
        data: serverResponds,
        showGraph: true,
      });
     });
     x++;
     //This way once we repeat the function 500 times it'll stop
     if(x > 500){
     clearInterval(interval);
     }
    }, 100);
}

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
