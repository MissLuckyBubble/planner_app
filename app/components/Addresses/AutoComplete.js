import { React, useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { googleKey } from '../../../config';
import MapComponent from './MapComponent';
import { Colors } from '../../assets/Colors';
import { commonStyles } from '../../assets/Styles';
import { err } from 'react-native-svg/lib/typescript/xml';
import { isNotEmpty } from '../Validations';

const AutoComplete = ({ setNewAddress }) => {

    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [error, setError] = useState('');
    const handlePlaceSelect = (data, details) => {
        setLatitude(details.geometry.location.lat);
        setLongitude(details.geometry.location.lng);

        const addressComponents = details?.address_components || [];
        const address = {};
        console.log(details);
        address.street = details.formatted_address;
        addressComponents.forEach((component) => {
            const { types, long_name } = component;

            if (types.includes('locality')) {
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
    const changeClicked = () => {
        if (!isNotEmpty(street) || !isNotEmpty(city) || !isNotEmpty(postalCode) || !isNotEmpty(country)) {
            setError('Всички полета са задължителни');
            return;
        } else if (!isNotEmpty(latitude) || !isNotEmpty(longitude)) {
            setError('Моля първо изберете адрес от падащато меню.');
            return;
        } else setError('');
        setNewAddress(street, city, postalCode, country, latitude, longitude);
    }
    return (
        <View style={[styles.conteinter, styles.panel]}>
            <Text style={[styles.button, styles.btntext, { textAlign: 'center', height: 25, backgroundColor: Colors.highlight, color: Colors.dark }]}>Смяна на адрес</Text>
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
            {error && <Text style={[commonStyles.errorText]}>{error}</Text>}
            <TextInput
                style={styles.input}
                placeholder="Пълен адрес"
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
            <TouchableOpacity style={styles.button} onPress={changeClicked}>
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
        height: '57%',
        justifyContent: 'center',
        marginVertical: 5
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
        marginBottom: 5
    },
    btntext: {
        fontSize: 18,
        color: Colors.white
    },
};

