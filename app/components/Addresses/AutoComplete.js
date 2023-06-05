import { React, useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { googleKey } from '../../../config';
import MapComponent from './MapComponent';
import { Colors } from '../../assets/Colors';

const AutoComplete = ({ setNewAddress }) => {

    const [latitude, setLatitude] = useState(42.136097);
    const [longitude, setLongitude] = useState(24.742168);
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const handlePlaceSelect = (data, details) => {
        setLatitude(details.geometry.location.lat);
        setLongitude(details.geometry.location.lng);

        const addressComponents = details?.address_components || [];
        const address = {};

        addressComponents.forEach((component) => {
            const { types, long_name } = component;

            if (types.includes('route')) {
                address.street = long_name;
            } else if (types.includes('locality')) {
                address.city = long_name;
            } else if (types.includes('postal_code')) {
                address.postalCode = long_name;
            } else if (types.includes('country')) {
                address.country = long_name;
            }
        });

        // Update the state with the extracted values
        setStreet(address.street || '');
        setCountry(address.country || '');
        setCity(address.city || '');
        setPostalCode(address.postalCode || '');
    };

    return (
        <View style={[styles.conteinter, styles.panel]}>
            <GooglePlacesAutocomplete
                placeholder='Въведете локация...'
                onPress={handlePlaceSelect}
                minLength={2}
                query={{
                    key: googleKey,
                    language: 'bg',
                    components: 'country:bg'
                }}
                autoFocus={false}
                returnKeyType={'default'}
                fetchDetails={true}
                styles={autocompleteStyles} />
            <TextInput
                style={styles.input}
                placeholder="Улица"
                value={street}
                onChangeText={setStreet}
            />
            <View style={styles.halfInputContainer}>
                <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="Град"
                    value={city}
                    onChangeText={setCity}
                />
                <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="Пощенски код"
                    value={postalCode}
                    onChangeText={setPostalCode}
                />
            </View>
            <TextInput
                style={styles.input}
                placeholder="Държава"
                value={country}
                onChangeText={setCountry}
            />
            <TouchableOpacity style={styles.button} onPress={() => setNewAddress(street, city, postalCode, country, latitude, longitude)}>
                <Text style={styles.btntext}>Смени адрес</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AutoComplete;
const autocompleteStyles = {
    textInputContainer: {
        width: '100%',
    },
    textInput: {
        height: 40,
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 3,
        paddingHorizontal: 10,
        marginBottom: 2,
    },
    listView: {
        zIndex: 10,
        margin: 2,
    },
    row: {
        height: 30,
        padding: 5,
        backgroundColor: Colors.white
    }
};
const styles = {
    conteinter: {
        flex: 0,
        height: '50%',
        justifyContent: 'center',
        marginVertical: 10
    },
    panel: {
        backgroundColor: 'white',
        justifyContent: 'space-around',
    },
    panelTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        borderBottomWidth: 1,
        fontSize: 14,
        marginBottom: 10,
        height: 35,
    },
    halfInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    button: {
        width: '100%',
        height: 40,
        backgroundColor: Colors.dark,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 15
    },
    btntext: {
        fontSize: 18,
        color: Colors.white
    },
};

