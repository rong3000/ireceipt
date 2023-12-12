const initialState = {
    user: null,
    isLoggedIn: false
};

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload, //action.payload or action.data
                isLoggedIn: true,
            };
        case 'LOGIN_FAILED':
            return {
                error: action.payload, //action.payload or action.data
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
                    user: action.payload, //action.payload or action.data
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