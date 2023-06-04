import HomeScreen from '../screens/HomeScreen';
import BusinessDetailsScreen from '../screens/BusinessDetailsScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import { Colors } from '../assets/Colors';
import CommentsScreen from '../screens/CommentsScreen';
import MakeAppointmentScreen from '../screens/MakeAppointmentScreen';
import MyAppointmentsScreen from '../screens/MyAppointmentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faHeart, faClock, faHistory, faUser } from '@fortawesome/free-solid-svg-icons';
import FavoriteBusinessesScreen from '../screens/FavoriteBusinessesScreen';
import HistoryScreen from '../screens/HistoryScreen';
const Drawer = createDrawerNavigator();
function CustomerStack(props) {
    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawer{...props} />}
            initialRouteName='Home'
            screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor: Colors.primary,
                drawerActiveTintColor: Colors.dark,
                drawerLabelStyle: { marginLeft: -20 }
            }}>
            <Drawer.Screen name="Home" component={HomeScreen}
                options={{
                    title: 'Начало',
                    drawerIcon: ({ color, size }) => (
                        <FontAwesomeIcon icon={faHome} color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen name="Favorites" component={FavoriteBusinessesScreen} 
                options={{
                    title: 'Любими Места',
                    drawerIcon: ({ color, size }) => (
                        <FontAwesomeIcon icon={faHeart} color={color} size={size} />
                    ),
                }}
                initialParams={{ refresh: true }}
            />
            <Drawer.Screen name="Appointments" component={MyAppointmentsScreen}
                options={{
                    title: 'Запазени часове',
                    drawerIcon: ({ color, size }) => (
                        <FontAwesomeIcon icon={faClock} color={color} size={size} />
                    ),
                }}
                initialParams={{ refresh: true }}
            />
            <Drawer.Screen name="History" component={HistoryScreen}
                options={{
                    title: 'История',
                    drawerIcon: ({ color, size }) => (
                        <FontAwesomeIcon icon={faHistory} color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen name="Profile" component={ProfileScreen}
                options={{
                    title: 'Профил',
                    drawerIcon: ({ color, size }) => (
                        <FontAwesomeIcon icon={faUser} color={color} size={size} />
                    ),
                }}
            />

            <Drawer.Screen name="BusinessDetails" component={BusinessDetailsScreen}
                options={{
                    drawerLabel: () => null, // hide label in drawer
                    drawerStyle: { display: 'none' }, // hide screen in drawer
                    headerShown: false, // hide header
                }}
            />
            <Drawer.Screen name="CommentsScreen" component={CommentsScreen}
                options={{
                    drawerLabel: () => null, // hide label in drawer
                    drawerStyle: { display: 'none' }, // hide screen in drawer
                    headerShown: false, // hide header
                }}
            />
            <Drawer.Screen name="MakeAppointmentScreen" component={MakeAppointmentScreen}
                options={{
                    drawerLabel: () => null, // hide label in drawer
                    drawerStyle: { display: 'none' }, // hide screen in drawer
                    headerShown: false, // hide header
                }}
            />
        </Drawer.Navigator>
    );
}

export default CustomerStack;