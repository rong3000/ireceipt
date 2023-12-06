let user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user || null,
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true' || false
    // isLoggedIn: user ? true : false
  };

export default function authReducer (state = initialState, action) {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload, //action.payload or action.data
                isLoggedIn: true,
            };
        case 'LOGOUT_SUCCESS':
            return {
                ...state,
                user: null,
                isLoggedIn: false,
            };
        default:
            return state;
    }
};