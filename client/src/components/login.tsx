import React, { ChangeEvent } from 'react';
import { userService } from '../services/userService';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { getRole } from '../services/userService';
import { stylesService } from '../services/stylesService';
import { LoginProps, LoginState } from '../interfaces/login';
import { routeService } from '../services/routeService';

class LoginPage extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);

    this.state = {
      username: '',
      password: '',
      submitted: false,
      loading: false,
      error: '',
      role: '',
    };
  }

  async componentDidMount() {
    stylesService.setFooter();
    const response = await getRole();
    this.setState({ role: response });
  }

  componentDidUpdate() {
    window.onpopstate = () => {
      stylesService.setFooter();
    };
  }

  updateUsername(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const { value } = e.target;
    this.setState({ username: value });
  }

  updatePassword(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const { value } = e.target;
    this.setState({ password: value });
  }

  handleSubmit() {
    this.setState({ submitted: true });
    const { username, password } = this.state;
    if (!(username && password)) {
      return;
    }

    this.setState({ loading: true });
    userService.login(username, password).then(
      () => {
        const { from } = this.props.location.state || { from: { pathname: '/' } };
        window.location.pathname = from.pathname;
      },
      (error) => this.setState({ error, loading: false })
    );
  }

  render() {
    const { username, password, loading, error } = this.state;
    if (userService.hasRole(this.state.role)) {
      window.location.pathname = routeService.getDefaultRoute();
    }
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div>
          <Typography component="h1" variant="h5">
            Kirjaudu sisään
          </Typography>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              this.handleSubmit();
            }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              InputLabelProps={{
                required: false,
                style: {
                  color: 'darkgrey',
                },
              }}
              InputProps={{
                style: {
                  color: '#2F4F4F',
                },
              }}
              required
              fullWidth
              value={username}
              onChange={(e) => this.updateUsername(e)}
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
                },
              }}
              InputProps={{
                style: {
                  color: '#2F4F4F',
                },
              }}
              name="password"
              value={password}
              onChange={(e) => this.updatePassword(e)}
              label="Salasana"
              placeholder="Salasana"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button type="submit" fullWidth disabled={loading} variant="contained" color="primary">
              Kirjaudu sisään
            </Button>
          </form>
        </div>
        {error && <div className="virhe_login">{error.toString()}</div>}
      </Container>
    );
  }
}

export { LoginPage };
