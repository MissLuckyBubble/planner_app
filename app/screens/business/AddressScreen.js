import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import { AuthContext } from '../../context/AuthContext';
import { Colors } from '../../assets/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import AutoComplete from '../../components/Addresses/AutoComplete';
import MapComponent from '../../components/Addresses/MapComponent';


const AddressScreen = ({ navigation }) => {

  const openDrawer = () => {
    navigation.openDrawer();
  }

  const { userToken } = useContext(AuthContext);
  const config = {
    headers: {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
    }
  };

  const [business, setBusiness] = useState([]);
  const getBusiness = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/business/profile`, config);
      const result = response.data.data;
      setBusiness(result);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    getBusiness();
  }, []);

  const saveAddress = async (street,city,postalCode,country,latitude,longitude) => {
    const form = {
      city: city,
      street: street,
      postal_code: postalCode,
      description: `${street}, ${city}, ${postalCode}`,
      latitude: latitude,
      longitude: longitude
    }
     try {
      const response = await axios.put(`${BASE_URL}/business/address/edit`, form, config);
      const result = response.data.data;
      setBusiness(result[0]);
    } catch (error) {
      console.error(error.response.data.message);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.nameText}>Настройки на бизнеса</Text>
        <TouchableOpacity onPress={openDrawer}>
          <FontAwesomeIcon icon={faBars} size={24} color={Colors.dark} />
        </TouchableOpacity>
      </View>
      <View style={{ padding: 10 }}>
        <Text style={[styles.label]}>Адрес</Text>
        <Text style={styles.info}>{business && business.address && business.address.description}</Text>
        <View>
          <MapComponent
            latitude={business && business.address &&  parseFloat(business.address.latitude)}
            longitude={business && business.address && parseFloat(business.address.longitude)}
            height={200}>
          </MapComponent>
        </View>
        <AutoComplete
        setNewAddress={saveAddress}
        ></AutoComplete>
      </View>
    </View >

  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginBottom: 5,
    backgroundColor: Colors.primary,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.dark,
    marginHorizontal: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 0,
    color: Colors.dark,
    backgroundColor: Colors.highlight,
    padding: 10,
    borderRadius: 5,
    textAlign: 'center'
  },
  info: {
    fontSize: 20,
    padding: 10,
    borderRadius: 10,
  },

});