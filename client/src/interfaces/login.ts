export interface LoginState {
  username: string;
  password: string;
  submitted: boolean;
  loading: boolean;
  error: string;
  role: string;
}

export interface LoginProps {
  location: {
    state: {
      from: {
        pathname: string;
      };
    };
  };
}
