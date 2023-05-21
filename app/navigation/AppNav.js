import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import BusinessStack from './BusinessStack';
import CustomerStack from './CustomerStack';

function AppNav() {
  const { user, userToken } = useContext(AuthContext);
  return (
    <NavigationContainer>
      {userToken !== null ?
        user.role_id == 1 ?
          <CustomerStack />
          :
          <BusinessStack />
        :
        <AuthStack />
      }
    </NavigationContainer>
  );
}

export default AppNav;