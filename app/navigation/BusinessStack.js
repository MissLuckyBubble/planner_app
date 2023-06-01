import BusinessHomeScreen from '../screens/business/BusinessHomeScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import { Colors } from '../assets/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faCalendar, faComment, faTag, faClock, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import BusinessCalendar from '../screens/business/BusinessCalendar';
import CommentsScreen from '../screens/CommentsScreen';
import AddressScreen from '../screens/business/AddressScreen';
import CategoriesScreen from '../screens/business/CategoriesScreen';
import WorkTimeScreen from '../screens/business/WorkTimeScreen';

const Drawer = createDrawerNavigator();
function BusinessStack() {
    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawer{...props} />}
            initialRouteName='BusinessHome' screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor: Colors.primary,
                drawerActiveTintColor: Colors.dark,
                drawerLabelStyle: { marginLeft: -20 }
            }}>
            <Drawer.Screen name="Home" component={BusinessHomeScreen}
                options={{
                    title: 'Начало',
                    drawerIcon: () => <FontAwesomeIcon icon={faHome} color={Colors.dark} />
                }} />
            <Drawer.Screen name="CalendarScreen" component={BusinessCalendar}
                options={{
                    title: 'Календар',
                    drawerIcon: () => <FontAwesomeIcon icon={faCalendar} color={Colors.dark} />
                }} />
            <Drawer.Screen name="WorkTime" component={WorkTimeScreen}
                options={{
                    title: 'Работно Време',
                    drawerIcon: () => <FontAwesomeIcon icon={faClock} color={Colors.dark} />
                }} />
            <Drawer.Screen name="Address" component={AddressScreen}
                options={{
                    title: 'Адрес',
                    drawerIcon: () => <FontAwesomeIcon icon={faLocationDot} color={Colors.dark} />
                }} />
            <Drawer.Screen name="Categories" component={CategoriesScreen}
                options={{
                    title: 'Категории',
                    drawerIcon: () => <FontAwesomeIcon icon={faTag} color={Colors.dark} />
                }} />
            <Drawer.Screen name="CommentsScreen" component={CommentsScreen}
                options={{
                    title: 'Ревюта',
                    drawerIcon: () => <FontAwesomeIcon icon={faComment} color={Colors.dark} />
                }} />
        </Drawer.Navigator>
    );
}

export default BusinessStack;