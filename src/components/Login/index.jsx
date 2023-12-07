import { connect } from 'react-redux'

import { login, logout } from '../../redux/actions/authActions';

const Login = ({ isLoggedIn, user, count, login, logout }) => {

  const handleLogin = () => {
    const USERNAME = process.env.REACT_APP_USERNAME
    const PASSWORD = process.env.REACT_APP_PASSWORD
    console.log('username is ', USERNAME)
    login(USERNAME, PASSWORD);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h2>Welcome, {user.email}!</h2>

          <h1>In Component above Current Sum is: {count}</h1>
          <h2>Token is, {user.accessToken}!</h2>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <h2>Please log in</h2>
          <button onClick={handleLogin}>Login</button>
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.authx.isLoggedIn,
  user: state.authx.user,
  count: state.count
});

export default connect(mapStateToProps, { login, logout })(Login);