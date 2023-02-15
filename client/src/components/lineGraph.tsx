import React, { Component } from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Legend, Line, Tooltip } from 'recharts';
import { Typography } from '@material-ui/core';
import { LineGraphProps } from '../interfaces/graphs';
import { stylesService } from '../services/stylesService';
class LineGraph extends Component<LineGraphProps> {
  render() {
    const thisYear = this.props.data.thisYear;
    const lastYear = this.props.data.lastYear;
    const lastLastYear = this.props.data.lastLastYear;
    const title = this.props.title;
    const labelColors = stylesService.usingDarkTheme() ? '#c9c5c5' : '#3c4043';
    return (
      <div style={{ width: '100%', height: 300 }}>
        <Typography className="graphTitle" align="center" variant="h6">
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 50,
            }}
          >
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis tick={{ fill: labelColors }} dataKey="date" allowDuplicatedCategory={false} />
            <YAxis tick={{ fill: labelColors }} />
            {stylesService.isMobile() ? null : <Tooltip />}
            <Legend wrapperStyle={{ marginLeft: '25px' }} />
            <Line
              strokeWidth={2}
              type="monotone"
              data={lastLastYear.graphData}
              dataKey="amount"
              name={lastLastYear.year.toString()}
              stroke="#4caf50"
              dot={false}
            />
            <Line
              strokeWidth={2}
              type="monotone"
              data={lastYear.graphData}
              dataKey="amount"
              name={lastYear.year.toString()}
              stroke="#f44336"
              dot={false}
            />
            <Line
              strokeWidth={2}
              type="monotone"
              data={thisYear.graphData}
              dataKey="amount"
              name={thisYear.year.toString()}
              stroke="#0288d1"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default LineGraph;
