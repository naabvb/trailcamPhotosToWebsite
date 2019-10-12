import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link, Route, BrowserRouter, Switch, Redirect } from "react-router-dom";
import ImagesG  from "./Images";
import ImagesG2 from "./Images2";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function CenteredTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BrowserRouter>
    <Paper className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="Riistakamera 1" component={Link} to="/one" />
        <Tab label="Riistakamera 2" component={Link} to="/two" />
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