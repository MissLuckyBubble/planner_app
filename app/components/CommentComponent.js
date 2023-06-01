import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StarRatingComponent from './StarRatingComponent';
import { Colors } from '../assets/Colors';

const CommentComponent = ({ date, customerAge, customerName, rating, comment }) => {
    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <Text style={styles.customerName}>{customerName}</Text>
                <StarRatingComponent rating={rating} size={24} color={Colors.highlight} />
            </View>
            <View style={styles.rowContainer}>
            <Text style={styles.customerAge}>Възраст:{customerAge}</Text>
            <Text style={styles.date}>Дата:{date}</Text>
            </View>
            <Text style={styles.comment}>{comment}</Text>

        </View>
    );
};

export default CommentComponent;
const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      marginVertical: 10,
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: '#FFFFFF',
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    customerName: {
      color:Colors.dark,
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 5,
      marginRight:'47%'
    },
    customerAge: {
      fontSize: 14,
      color: '#666666',
      marginRight:'50%'
    },
    rowContainer: {
      flexDirection: 'row',
      alignContent: 'space-between',
      marginBottom: 1,
    },
    date: {
      fontSize: 14,
      color: '#666666',
      marginLeft: 10,
    },
    comment: {
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#CCCCCC',
      },
  });
  
  