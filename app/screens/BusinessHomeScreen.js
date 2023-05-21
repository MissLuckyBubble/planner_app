import React, {useContext} from 'react';
import { TouchableHighlight, Text, StyleSheet, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';

function BusinessHomeScreen({ navigation }) {
    const {logout} = useContext(AuthContext);
    const logoutClick = () => {
        logout();
    }
    return (
        <View>
            <Text>Business Home SCREEN</Text>
            <TouchableHighlight 
                        onPress={logoutClick}>
                        <Text style={styles.btntext}>Logout</Text>
            </TouchableHighlight>
        </View>
    );
}

export default BusinessHomeScreen;
const styles = StyleSheet.create({
    
})