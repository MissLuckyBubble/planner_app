import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../assets/Colors';

const CategoryComponent = ({ title, description, image }) => {
    
const MAX_DESCRIPTION_LENGTH = 55;
  const truncatedDescription = description.substring(0, MAX_DESCRIPTION_LENGTH);

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }}
      style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text  style={styles.description}>
      {truncatedDescription} {description.length > MAX_DESCRIPTION_LENGTH ? '...' : ''}
        </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 180,
    height:200,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    color:Colors.dark,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 1,
  },
  description: {
    fontSize: 14,
    color: '#888',
  },
});

export default CategoryComponent;