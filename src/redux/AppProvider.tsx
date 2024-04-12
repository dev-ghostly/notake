'use client'
import store from './store';
import { Provider } from 'react-redux';

export const AppProvider = ({ children } : {children : any}) => {
  return <Provider store={store}>{children}</Provider>;
};