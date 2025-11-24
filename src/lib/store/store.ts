
import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from './tokenSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      tokens: tokenReducer,
    },
    
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({ serializableCheck: false }), 
  });
};


export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];