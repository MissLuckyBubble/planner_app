import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import RegisterBusinessScreen from '../screens/auth/RegisterBusinessScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPassword';

const Stack = createNativeStackNavigator();
function AuthStack() {
  return (
    <Stack.Navigator initialRouteName='Welcome' screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="RegisterBusiness" component={RegisterBusinessScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

export default AuthStack;