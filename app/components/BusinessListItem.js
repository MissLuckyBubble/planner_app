import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import StarRatingComponent from './StarRatingComponent';
import { Colors } from '../assets/Colors';
import { IMG_URL } from '../../config';

const BusinessListItem = ({ name, rating, numRatings, category, image, address, services }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: `${IMG_URL}/${image}` }}
        style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.address}>{address}</Text>
        <View style={styles.ratingContainer}>
          <StarRatingComponent rating={rating} color={Colors.highlight} />
          <Text style={styles.numRatings}>({numRatings} reviews)</Text>
        </View>
        <Text style={styles.category}>Категория: {category}</Text>
        <View style={styles.servicesContainer}>
          {
            services ? (services.map(service => (
              <View style={styles.serviceItem} key={service.id}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>{service.price} лв.</Text>
              </View>
            ))

            ) : <Text>No services yet..</Text>}
        </View>
      </View>
    </View>
  );
};
export default BusinessListItem;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 125,
    height: 175,
    marginRight: 10,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    color: Colors.dark,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  numRatings: {
    marginLeft: 5,
    color: '#999',
    fontSize: 16,
  },
  category: {
    fontSize: 16,
  },
  address: {
    fontSize: 14,
    color: '#555',
  },
  servicesContainer: {
    marginTop: 5,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  serviceName: {
    fontSize: 16,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});