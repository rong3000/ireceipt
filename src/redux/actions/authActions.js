import auth from '../../firebase'
import { signInWithEmailAndPassword } from "firebase/auth";

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
    console.log(error)
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: 'LOGOUT_SUCCESS' });
  } catch (error) {
    console.log(error)
  }
};