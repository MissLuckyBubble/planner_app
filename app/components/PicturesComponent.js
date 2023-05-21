import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { IMG_URL } from '../../config';

const PicturesComponent = ({ images }) => {

    return (
        <View style={styles.container}>
            <FlatList
                horizontal={true}
                data={images}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: `${IMG_URL}/${item.name}` }} style={styles.image} />
                    </View>
                )}
            />
        </View>
    );
};

export default PicturesComponent;

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    imageContainer: {
        width: 300,
        height: 250,
        marginHorizontal: 10,
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});
