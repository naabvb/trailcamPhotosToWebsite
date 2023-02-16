import { Typography } from '@material-ui/core';
import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip, LabelList } from 'recharts';
import { BarGraphProps } from '../interfaces/graphs';
import { stylesService } from '../services/stylesService';

class BarGraph extends Component<BarGraphProps> {
  render() {
    const data = [
      {
        date: this.props.data?.j1.lastLastYear.year.toString(),
        j1: this.props.data?.j1.lastLastYear.total,
        j2: this.props.data?.j2.lastLastYear.total,
        j3: this.props.data?.j3.lastLastYear.total,
        j4: this.props.data?.j4.lastLastYear.total,
      },
      {
        date: this.props.data?.j1.lastYear.year.toString(),
        j1: this.props.data?.j1.lastYear.total,
        j2: this.props.data?.j2.lastYear.total,
        j3: this.props.data?.j3.lastYear.total,
        j4: this.props.data?.j4.lastYear.total,
      },
      {
        date: this.props.data?.j1.thisYear.year.toString(),
        j1: this.props.data?.j1.thisYear.total,
        j2: this.props.data?.j2.thisYear.total,
        j3: this.props.data?.j3.thisYear.total,
        j4: this.props.data?.j4.thisYear.total,
      },
    ];
    const axisLabelColors = stylesService.usingDarkTheme() ? '#c9c5c5' : '#3c4043';
    const barLabelColors = stylesService.usingDarkTheme() ? '#ffffff' : '#3c4043';
    const labelFontSize = stylesService.isMobile() ? '12px' : 'none';
    return (
      <div style={{ width: '100%', height: 300 }}>
        <Typography className="graphTitle" align="center" variant="h6">
          Yhteenveto
        </Typography>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barGap={6}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 50,
            }}
          >
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis tick={{ fill: axisLabelColors }} dataKey="date" />
            <YAxis padding={{ top: 20 }} tick={{ fill: axisLabelColors }} />
            {stylesService.isMobile() ? null : <Tooltip />}
            <Legend
              payload={[
                { value: 'Jätkälä 1', type: 'square', color: '#4caf50' },
                { value: 'Jätkälä 2', type: 'square', color: '#f44336' },
                { value: 'Jätkälä 3', type: 'square', color: '#0288d1' },
                { value: 'Jätkälä 4', type: 'square', color: '#ff8a65' },
              ]}
              wrapperStyle={{ marginLeft: '25px' }}
            />
            <Bar dataKey="j1" fill="#4caf50">
              <LabelList dataKey="j1" position={'top'} fill={barLabelColors} style={{ fontSize: labelFontSize }} />
            </Bar>
            <Bar dataKey="j2" fill="#f44336">
              <LabelList dataKey="j2" position={'top'} fill={barLabelColors} style={{ fontSize: labelFontSize }} />
            </Bar>
            <Bar dataKey="j3" fill="#0288d1">
              <LabelList dataKey="j3" position={'top'} fill={barLabelColors} style={{ fontSize: labelFontSize }} />
            </Bar>
            <Bar dataKey="j4" fill="#ff8a65">
              <LabelList dataKey="j4" position={'top'} fill={barLabelColors} style={{ fontSize: labelFontSize }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default BarGraph;
