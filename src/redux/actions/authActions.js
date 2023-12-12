import auth from './firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const saveUserDataToLocalStorage = (user) => {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('user', JSON.stringify(user));
};

const removeUserDataFromLocalStorage = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('user');
};

export const login = (email, password) => async (dispatch) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(userCredential.user.accessToken)
    console.log(userCredential.user.email)

    const user = { email: userCredential.user.email, accessToken: userCredential.user.accessToken };

    saveUserDataToLocalStorage(user);

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
    removeUserDataFromLocalStorage();

    dispatch({ type: 'LOGOUT_SUCCESS' });
  } catch (error) {
  }
};

export const authInit = () => async (dispatch) => {
  try {
    removeUserDataFromLocalStorage();
    dispatch({ type: 'AUTHINIT' });
  } catch (error) {
  }
};

export const signup = (email, password) => async (dispatch) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log(userCredential.user.accessToken)
    console.log(userCredential.user.email)

    const user = { email: userCredential.user.email, accessToken: userCredential.user.accessToken };

    saveUserDataToLocalStorage(user);

    dispatch({
      type: 'SIGNUP_SUCCESS',
      payload: user,
    });
  } catch (error) {
    dispatch({
      type: 'SIGNUP_FAILED',
      payload: error.code
    });
  }
};