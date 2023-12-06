import { connect } from 'react-redux'

import React, { useEffect, useState, useRef } from 'react';

import { login, logout } from '../../redux/actions/authActions';

import { useGetReceiptsQuery } from '../../datamodel/rtkQuerySlice';

const Login = ({ isLoggedIn, user, count, login, logout }) => {

  const { data, error, isLoading, refetch } = useGetReceiptsQuery(
    {
      pollingInterval: 3000,
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );
  const handleLogin = () => {
    const USERNAME = process.env.REACT_APP_USERNAME
    const PASSWORD = process.env.REACT_APP_PASSWORD
    console.log('username is ', USERNAME)
    login(USERNAME, PASSWORD);
  };

  const handleLogout = () => {
    logout();
  };

  const getUserReceipts = () => {
    refetch();
  }

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h2>Welcome, {user.email}!</h2>

          <h1>In Component above Current Sum is: {count}</h1>
          <h2>Token is, {user.accessToken}!</h2>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={getUserReceipts}>getUserReceipts</button>
          <div>
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Error: {error.message}</div>
            ) : data ? (
              <div>
                <h2>Welcome, {data?.messageCode}!</h2>
                <h2>Hi, {data?.isSuccess.toString()}!</h2>
                <h2>companyName, {data?.obj[0]?.companyName}!</h2>
              </div>
            ) : null}
          </div>
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
