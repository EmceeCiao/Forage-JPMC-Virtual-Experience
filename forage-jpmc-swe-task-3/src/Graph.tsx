import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      //Getting rid of top_ask_price and top_bid_price since we just care about the ratio this time
      //Also getting rid of stock in schema as we don't care about identifying between the two
      timestamp: 'date',
      //Adding ratio, upper bound and lower bound, and the alert for trader to see on graph
      //Ratio will be price of abc/def
      ratio: 'float',
      upperbound: 'float',
      lowerbound: 'float',
      price_abc: 'float',
      price_def: 'float',
      alert: 'float',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      //Removed Column pivots setAttribute as we had removed stock from schema
      elem.setAttribute('row-pivots', '["timestamp"]');
      //Need to modify columns to reflect the 4 things we want to see on our graph ratio, upper and lower bound
      elem.setAttribute('columns', '["upperbound","ratio", "lowerbound", "alert"]');
      elem.setAttribute('aggregates', JSON.stringify({
        //Getting rid of top_ask_price, top_bid_price, and stock since unnecessary info now
        //Modifying Aggregates to contain the things we now want to see within the graph
        lowerbound: 'avg',
        upperbound: 'avg',
        price_abc: 'avg',
        price_def: 'avg',
        ratio: 'avg',
        alert: 'avg',
        timestamp: 'distinct count',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update([
        DataManipulator.generateRow(this.props.data),
        ] as unknown as 'TableData'
        //The program did not like unknown as TableData and wouldn't compile but changing it
        //to 'TableData' seemed to fix the issue
      );
    }
  }
}

export default Graph;
