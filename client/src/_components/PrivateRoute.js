import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import { getRole } from '../_services/user.service';

class PrivateRoute extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            isAuthenticated: false
        }
    }

    componentDidMount() {
        getRole(true).then((isAuthenticated) => {
            this.setState({
                loading: false,
                isAuthenticated
            })
        })
    }

    render() {
        const { component: Component, ...rest } = this.props
        return (
            <Route
                {...rest}
                render={props =>
                    this.state.isAuthenticated ? (
                        <Component {...props} stage={this.props.stage} status={this.props.status}/>
                    ) : (
                            this.state.loading ? (
                                <Paper>
                                </Paper>
                            ) : (
                                    <Redirect to={{ pathname: '/login', state: { from: this.props.location } }} />
                                )
                        )
                }
            />
        )
    }
}

export default PrivateRoute;