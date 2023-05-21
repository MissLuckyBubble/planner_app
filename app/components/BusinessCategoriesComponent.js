import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Colors } from '../assets/Colors';
import ServicesComponent from './ServicesComponent';

function BusinessCategoriesComponent({ title, services, handleClickedServices }) {
    const [shown, setShow] = useState(false);
    const handleShowServices = () => {
        setShow(!shown);
    }
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={() => handleShowServices()}>
                    {shown ?
                        <FontAwesomeIcon icon={faAngleUp} size={15} color={Colors.dark} /> :
                        <FontAwesomeIcon icon={faAngleDown} size={15} color={Colors.dark} />
                    }
                </TouchableOpacity>
            </View>
            {shown ?
                <ServicesComponent
                    services={services}
                    clickedServices={handleClickedServices} />
                : ''
            }
        </View>
    )
}
export default BusinessCategoriesComponent;
const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
      },
      titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark,
      },
});