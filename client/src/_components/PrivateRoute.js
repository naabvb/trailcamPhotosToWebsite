import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { userService } from '../_services/user.service';

async function PrivateRoute({ component: Component, ...rest }) {
    const { authTokens } = await userService.getRole();
    console.log(authTokens);
    return (
        <Route
            {...rest}
            render={props =>
                authTokens ? (
                    <Component {...props} />
                ) : (
                        <Redirect
                            to={{ pathname: "/login", state: { referer: props.location } }}
                        />
                    )
            }
        />
    );
}

export default PrivateRoute;