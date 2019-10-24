import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { userService } from './_services/user.service';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';


class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        userService.logout();

        this.state = {
            username: '',
            password: '',
            submitted: false,
            loading: false,
            error: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        document.getElementById("footer_block").style.display = "block";
        document.getElementById("footer_block").style.position = "absolute"
        document.getElementById("root").style.minHeight = 0;
    }

    componentDidUpdate() {
        window.onpopstate = (e) => {
            document.getElementById("footer_block").style.display = "block";
            document.getElementById("footer_block").style.position = "absolute"
            document.getElementById("root").style.minHeight = 0;
        }
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        //e.preventDefault();
        console.log(e);
        this.setState({ submitted: true });
        const { username, password, returnUrl } = this.state;
        console.log(username)
        console.log(password)
        // stop here if form is invalid
        if (!(username && password)) {
            console.log("fail")
            return;
        }

        this.setState({ loading: true });
        userService.login(username, password)
            .then(
                role => {
                    const { from } = this.props.location.state || { from: { pathname: "/" } };
                    window.location.pathname = from.pathname;
                },
                error => this.setState({ error, loading: false })
            );
    }

    render() {
        const { username, password, submitted, loading, error } = this.state;
        const useStyles = makeStyles({
            textField: {
                '&::placeholder': {
                    fontStyle: 'italic',
                }
            },
        });
        console.log(error);
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={useStyles.paper}>

                    <Typography component="h1" variant="h5">
                        Kirjaudu sisään
        </Typography>
                    <form className={useStyles.form} onSubmit={(e) => {e.preventDefault(); this.handleSubmit();}}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            InputLabelProps={{
                                required: false,
                                style: {
                                    color: 'darkgrey',
                                }
                            }}
                            InputProps={{
                                style: {
                                    color: '#2F4F4F',
                                }
                            }}
                            required
                            fullWidth
                            value={username}
                            onChange={this.handleChange}
                            id="username"
                            name="username"
                            label="Käyttäjänimi"
                            autoComplete="username"
                            placeholder="Käyttäjänimi"
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            InputLabelProps={{
                                required: false,
                                style: {
                                    color: 'darkgrey',
                                }
                            }}
                            InputProps={{
                                style: {
                                    color: '#2F4F4F',
                                }
                            }}
                            name="password"
                            value={password}
                            onChange={this.handleChange}
                            label="Salasana"
                            placeholder="Salasana"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            disabled={loading}
                            variant="contained"
                            color="primary"
                            className={useStyles.submit}
                        >
                            Kirjaudu sisään
          </Button>
                    </form>
                </div>
                {error &&
                        <div class="virhe_login">{error.toString()}</div>
                    }
            </Container>
            
        );
    }
}

export { LoginPage }; 