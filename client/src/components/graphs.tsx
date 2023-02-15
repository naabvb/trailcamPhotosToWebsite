import React, { Component } from 'react';
import { LoadingState } from '../constants/constants';
import { GraphsState } from '../interfaces/graphs';
import { getGraphsDataFromApi } from '../services/apiService';
import LineGraph from './lineGraph';
import { stylesService } from '../services/stylesService';
import BarGraph from './barGraph';

class Graphs extends Component<{}, GraphsState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      graphsData: null,
      loading: LoadingState.Loading,
    };
  }

  async componentDidMount() {
    const response = await getGraphsDataFromApi();
    if (response && response.data) {
      this.setState({ graphsData: response.data.graphs, loading: LoadingState.Loaded });
    }
  }

  render() {
    stylesService.setGraphsStyles();
    const wrapperStyles = stylesService.isMobile()
      ? { paddingTop: '20px', paddingBottom: '100px' }
      : { paddingTop: '50px' };
    const j1 = this.state.graphsData?.j1;
    const j2 = this.state.graphsData?.j2;
    const j3 = this.state.graphsData?.j3;
    const j4 = this.state.graphsData?.j4;
    const isLoaded = this.state.loading === LoadingState.Loaded;
    return isLoaded && j1 && j2 && j3 && j4 ? (
      <div style={wrapperStyles}>
        <LineGraph data={j1} title="Jätkälä 1" />
        <LineGraph data={j2} title="Jätkälä 2" />
        <LineGraph data={j3} title="Jätkälä 3" />
        <LineGraph data={j4} title="Jätkälä 4" />
        <BarGraph data={this.state.graphsData} />
      </div>
    ) : null;
  }
}

export default Graphs;
