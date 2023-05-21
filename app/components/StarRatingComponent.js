import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faStarHalfStroke,  } from '@fortawesome/free-solid-svg-icons';

const StarRatingComponent = ({ rating, size, color }) => {
    const stars = [];

    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5 ? true : false;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} size={size} color={color} />);
      } else if (i === fullStars && halfStar) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalfStroke} size={size} color={color} />);
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} size={size} color="#ccc" />);
      }
    }

    return (
        <View style={styles.container}>
            {stars}
            <Text style={styles.rating}>{rating}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        marginLeft: 5,
        fontSize: 16,
    },
});

export default StarRatingComponent;
