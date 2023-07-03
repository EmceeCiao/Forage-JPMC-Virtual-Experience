import {ServerRespond} from './DataStreamer';

//Updating Row Interface to match Schema in Graph.tsx
export interface Row {
  price_abc: number,
  price_def: number,
  upperbound: number,
  lowerbound: number,
  alert: number | undefined
  ratio: number,
  timestamp: Date,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
  //Calculating price_abc, price_def, upperbound, lowerbound, ratio
  //upperbound and lowerbound will be +- 5 percent, since doing ratio, 1 is 100 percent
     const price_abc = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price)/2;
     const price_def = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price)/2;
     const upperbound = 1 + 0.05;
     const lowerbound = 1 - 0.05;
     const ratio = price_abc/price_def;
      return {
        price_abc,
        price_def,
        ratio,
        upperbound,
        lowerbound,
        //Ternary Operator to have timestamp be more recent
        timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
        serverRespond[0].timestamp : serverRespond[1].timestamp,
        //Ternary Operator to have alert be set
        alert: (ratio > upperbound || ratio < lowerbound)? ratio : undefined,
      };
      }
      }
