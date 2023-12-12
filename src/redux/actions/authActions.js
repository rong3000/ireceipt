import auth from './firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export const login = (email, password) => async (dispatch) => {
  try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('from firebase ', userCredential)

        const user = { email: userCredential.user.email, accessToken: userCredential.user.accessToken };

        dispatch({
      type: 'LOGIN_SUCCESS',
      payload: user,
    });
  } catch (error) {
    // Handle login error
    dispatch({
      type: 'LOGIN_FAILED',
      payload: error.code
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
        dispatch({ type: 'LOGOUT_SUCCESS' });
  } catch (error) {
    // Handle logout error
  }
};

export const authInit = () => async (dispatch) => {
  try {
    dispatch({ type: 'AUTHINIT' });
  } catch (error) {
    // Handle logout error
  }
};

export const signup = (email, password) => async (dispatch) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log(userCredential.user.accessToken)
    console.log(userCredential.user.email)

    const user = { email: userCredential.user.email, accessToken: userCredential.user.accessToken };

    dispatch({
      type: 'SIGNUP_SUCCESS',
      payload: user,
    });
  } catch (error) {
    // Handle login error
    dispatch({
      type: 'SIGNUP_FAILED',
      payload: error.code
    });
  }
};