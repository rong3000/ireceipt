import { configureStore } from '@reduxjs/toolkit';

import authReducer from './reducers/authReducer';
import countReducer from './reducers/countReducers'

const store = configureStore({
  reducer: {
    authx: authReducer,
    count: countReducer,
  }
})
export default store;