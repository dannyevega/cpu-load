import _ from "lodash";
import moment from "moment";

export const getAverages = (dataPoints) => {
  const cpuLength = dataPoints.length;  
  const twoMin = (60 * 2) / 10;
  const movingAverage = _.meanBy(dataPoints.slice(-1 * twoMin));
  return movingAverage;
}


