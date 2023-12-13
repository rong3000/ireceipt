let user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user || null,
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true' || false,
    error: null
};

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload,
                isLoggedIn: true,
            };
        case 'LOGIN_FAILED':
            return {
                error: action.payload,
                isLoggedIn: false,
            };
        case 'LOGOUT_SUCCESS':
            return {
                ...state,
                user: null,
                isLoggedIn: false,
            };
        case 'AUTHINIT':
            return {
                user: null,
                isLoggedIn: false,
                error: null
            };
            case 'SIGNUP_SUCCESS':
                return {
                    ...state,
                    user: action.payload,
                    isLoggedIn: true,
                };
            case 'SIGNUP_FAILED':
                return {
                    error: action.payload,
                    isLoggedIn: false,
                };
        default:
            return state;
    }
};