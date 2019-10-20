import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link, Route, BrowserRouter, Switch, Redirect } from "react-router-dom";
import ImagesG from "./Images";
import ImagesG2 from "./Images2";

export default class CenteredTabs extends Component {
  constructor() {
    super()
    this.state = { tabValue: "/one" }
  }

  toggle(event) {
    this.setState({ tabValue: event })
  }

  componentDidMount() {
    if (performance.navigation.type === 1) {
      this.setState({ tabValue: window.location.pathname })
    }
    else {
      this.setState({ tabValue: window.location.pathname })
    }
  }

  componentDidUpdate() {
    window.onpopstate = (e) => {
      this.setState({ tabValue: window.location.pathname })
    }
  }

  render() {
    const tabValue = this.state.tabValue
    let trueValue
    if (tabValue === '/' || tabValue === null) {
      trueValue = '/one'
    }
    else {
      trueValue = tabValue
    }

    const useStyles = makeStyles({
      root: {
        flexGrow: 1,
      },
    });

    return (
      <BrowserRouter>
        <Paper className={useStyles.root}>
          <Tabs
            value={trueValue}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab value={'/one'} onClick={(e) => this.toggle("/one")} label="Riistakamera 1" component={Link} to="/one" />
            <Tab value={'/two'} onClick={(e) => this.toggle("/two")} label="Riistakamera 2" component={Link} to="/two" />
          </Tabs>
        </Paper>

        <Switch>
          <Route exact path="/">
            <Redirect to="/one"></Redirect>
          </Route>
          <Route path="/one" children={<Cam1 />} />
          <Route path="/two" children={<Cam2 />} />
        </Switch>
      </BrowserRouter>
    );
  }
}

function Cam1() {
  return (
    <ImagesG></ImagesG>
  );
}

function Cam2() {
  return (
    <ImagesG2></ImagesG2>
  );
}