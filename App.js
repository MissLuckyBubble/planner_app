import React from 'react';
import AppNav from './app/navigation/AppNav';
import { AuthProvider } from './app/context/AuthContext';
import 'react-native-gesture-handler';

export default function App() {

  return (
   <AuthProvider>
      <AppNav></AppNav>
   </AuthProvider>
  );
}
