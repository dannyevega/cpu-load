import React, { Component } from "react";
import _ from "lodash";
import moment from "moment";
import Chart from "chart.js";
import Table from "./Table";
import "./style.css";

const canvas = document.createElement("canvas");
const chart = new Chart(canvas, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "CPU Load Time",
        fill: false,
        lineTension: 0.3,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [],
        spanGaps: false
      },
      {
        label: "Threshold",
        fill: false,
        lineTension: 0.3,
        backgroundColor: "red",
        borderColor: "red",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [],
        spanGaps: false
      },
      {
        label: "Moving Average",
        fill: false,
        lineTension: 0.3,
        backgroundColor: "orange",
        borderColor: "orange",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [],
        spanGaps: false
      }
    ]
  }
});

const getCPU = () => {
  return fetch("https://real-bakery.glitch.me/cpu-load")
    .then(response => {
      return response.json();
    })
    .catch(e => console.log(e.message));
};

export default class CPULoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      threshold: 1,
      interval: 10,
      averages: [],
      listeningId: null,
      movingAverage: null,
      currentState: "PASS",
      data: []
    };
  }

  componentDidMount() {
    const main = document.getElementById("main");
    main.appendChild(canvas);
  }

  componentDidUpdate() {
    const { data } = this.state;
    chart.data.labels = _.map(data, d =>
      moment(d.timestamp).format("hh:mm:ss a")
    );
    chart.data.datasets[0].data = _.map(data, d => d.value);
    chart.data.datasets[2].data = _.map(data, d => d.movingAverage);

    chart.data.datasets[1].data = _.times(
      data.length,
      () => this.state.threshold
    );
    chart.update();
  }

  startListening = () => {
    const listeningId = setInterval(() => {
      const { data, averages } = this.state;
      getCPU().then(results => {
        const newCpuPoint = {
          value: results.cpuLoad[0],
          timestamp: Date.now()
        };

        const tenMin = 60 * 10 / this.state.interval;
        const twoMin = 60 * 2 / this.state.interval;

        data.push(newCpuPoint);

        if (data.length > tenMin) {
          data.shift();
        }

        const lastState = this.state.currentState;
        let currentState, msg;
        const movingAverage = _.meanBy(data.slice(-1 * twoMin), "value");

        if (movingAverage > this.state.threshold) {
          currentState = "FAIL";
          msg = "High CPU Load generated an alert - load:";
        } else {
          currentState = "PASS";
          msg = "CPU Load recovered - load:";
        }

        _.last(data).movingAverage = movingAverage;

        if (currentState !== lastState) {
          averages.unshift({
            timestamp: moment().format("hh:mm:ss a"),
            message: msg,
            average: movingAverage
          });
        }
        this.setState({ data, movingAverage, currentState, averages });
      });
    }, this.state.interval * 1000);
    this.setState({ listeningId });
  };

  stopListening() {
    clearInterval(this.state.listeningId);
    this.setState({ listeningId: null });
  }

  render() {
    const { averages, listeningId } = this.state;
    return (
      <div className="container">
        <div id="main">
          <div className="header">
            <h2>CPU Load Monitor</h2>
            <div>
              Current Threshold: <b>{this.state.threshold}</b>
            </div>
            <div>
              Current State: <b>{this.state.currentState}</b>
            </div>
            <div>
              Current 2 Min Moving Average: <b>{this.state.movingAverage}</b>
            </div>            
            {listeningId ? (
              <button onClick={() => this.stopListening()}>Stop</button>
            ) : (
              <button onClick={() => this.startListening()}>Start</button>
            )}
          </div>
          {averages.length > 0 ? <Table data={averages} /> : <div />}
        </div>
      </div>
    );
  }
}
