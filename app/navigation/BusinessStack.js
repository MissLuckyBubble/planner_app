import BusinessHomeScreen from '../screens/BusinessHomeScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import { Colors } from '../assets/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import HomeScreen from '../screens/HomeScreen';

const Drawer = createDrawerNavigator();
function BusinessStack() {
    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawer{...props} />}
            initialRouteName='BusinessHome' screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor: Colors.primary,
                drawerActiveTintColor: Colors.dark,
                drawerInactiveTintColor: Colors.primary,
                drawerLabelStyle: { marginLeft: -20 }
            }}>
            <Drawer.Screen name="Home" component={BusinessHomeScreen}
                options={{
                    title: 'Начало',
                    drawerIcon: () => <FontAwesomeIcon icon={faHome} color={Colors.dark} />
                }} />
            <Drawer.Screen name="Another" component={HomeScreen}
                options={{
                    title: 'Начало',
                    drawerIcon: () => <FontAwesomeIcon icon={faHome} color={Colors.dark} />
                }} />
        </Drawer.Navigator>
    );
}

export default BusinessStack;