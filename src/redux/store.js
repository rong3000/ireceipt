import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react'
import { api } from '../datamodel/rtkQuerySlice'

import authReducer from './reducers/authReducer';
import countReducer from './reducers/countReducers'

const store = configureStore({
  reducer: {
    authx: authReducer,
    count: countReducer,
    [api.reducerPath]: api.reducer,

  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch)

export default store;