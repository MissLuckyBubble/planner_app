import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import BusinessListItem from '../components/BusinessListItem';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faBars } from '@fortawesome/free-solid-svg-icons';
import { useIsFocused } from '@react-navigation/native';


import axios from 'axios';
import { BASE_URL } from '../../config';
import { AuthContext } from '../context/AuthContext';
import { Colors } from '../assets/Colors';


const FavoriteBusinessesScreen = ({ navigation }) => {

  const isFocused = useIsFocused();

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

  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const getBusinesses = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/customer/favorites/getAll`,
          config);
        result = response.data.data;
        if (result)
          setBusinesses(result && result.length > 0 ? result.map(business => {
            const categoryTitles = business.business_category.map(c => c.title);
            const categoryString = categoryTitles.length > 3
              ? `${categoryTitles.slice(0, 3).join(', ')}...`
              : categoryTitles.join(', ');
            return {
              id: business.id,
              name: business.name,
              address: business.address,
              rating: business.rating,
              numRatings: business.review_number,
              services: business.services_category != undefined && business.services_category[0] && Array.isArray(business.services_category[0].services) ? business.services_category[0].services.slice(0, 2).map(s => ({
                id: s.id,
                name: s.title,
                price: s.price
              })) : [],
              category: categoryString,
              image: business.picture.length > 0 ? business.picture[business.picture.length - 1].name : ''
            };
          }) : []);
      } catch (error) {
        console.error(error);
      }
    }
    getBusinesses();
  }, [isFocused]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const businessClicked = (id) => {
    navigation.navigate("BusinessDetails", { id });
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={handleGoBack}>
          <FontAwesomeIcon icon={faArrowLeft} size={24} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={styles.nameText}>Любими Места</Text>
        <TouchableOpacity onPress={openDrawer}>
          <FontAwesomeIcon icon={faBars} size={24} color={Colors.dark} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={businesses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => businessClicked(item.id)}>
            <BusinessListItem
              id={item.id}
              name={item.name}
              address={item.address.description}
              rating={item.rating}
              services={item.services}
              numRatings={item.numRatings}
              image={item.image}
              style={{ zIndex: 1 }}
              category={item.category}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: Colors.primary,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.dark,
    marginHorizontal: 16,
  },
  businessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    marginBottom: 16,
  },
  deleteButton: {
    marginLeft: 8,
  },
});

export default FavoriteBusinessesScreen;
