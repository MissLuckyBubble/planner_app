import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput } from 'react-native';
import { Colors } from '../assets/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { googleKey } from '../../config';
import GetLocation from 'react-native-get-location'
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { commonStyles } from '../assets/Styles';

const FiltersModalComponent = ({ visible, onClose, onApply }) => {
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState({});
    const handleApplyFilters = () => {
        const filters = {
            sortBy,
            sortOrder,
            city,
            latitude: address.lat,
            longitude: address.lng,
            distance: sliderOneValue[0]
        };
        onApply(filters);
        setCity('');
    };

    const handlePlaceSelect = (data, details) => {
        const addressComponents = details?.address_components || [];
        var address = '';
        console.log(details?.address_components);
        addressComponents.forEach((component) => {
            const { types, long_name } = component;

            if (types.includes('route')) {
                address = address + long_name;
            } else if (types.includes('locality')) {
                address = address + ' ' + long_name;
            }
        });
        setCity(address);
    }

    const location = () => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
        })
            .then(location => {
                setAddress({
                    'lat': location.latitude,
                    'lng': location.longitude
                })
            })
            .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
            })
    }
    const findNearMe = () => {
        if (address.lat) {
            setAddress({});
            setSliderOneValue([])
            return;
        }
        setSliderOneValue([10])
        location();
        setCity('');
    }
    const [sliderOneChanging, setSliderOneChanging] = useState(false);
    const [sliderOneValue, setSliderOneValue] = useState([10]);

    const sliderOneValuesChangeStart = () => setSliderOneChanging(true);

    const sliderOneValuesChange = values => {
        console.log(values);
        setSliderOneValue(values)
    };

    const sliderOneValuesChangeFinish = () => setSliderOneChanging(false);

    return (
        <Modal
            onRequestClose={onClose}
            transparent={true} visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.top}>
                    <Text style={styles.title}>Филтри</Text>
                </View>
                <Text>Сортирай по:</Text>
                <View style={styles.filterSection}>
                    <TouchableOpacity
                        style={[styles.filterButton, sortBy === 'Име' && styles.selectedFilterButton]}
                        onPress={() => setSortBy('Име')}>
                        <Text style={[styles.filterButtonText, sortBy === 'Име' && styles.selectedFilterButtonText]}>Име</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, sortBy === 'Рейтинг' && styles.selectedFilterButton]}
                        onPress={() => setSortBy('Рейтинг')}>
                        <Text style={[styles.filterButtonText, sortBy === 'Рейтинг' && styles.selectedFilterButtonText]}>Рейтинг</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.filterButton]} onPress={() => setSortBy('')}>
                        <FontAwesomeIcon icon={faTrashCan} size={20} color={Colors.error} />
                    </TouchableOpacity>
                </View>

                <Text>Подреди:</Text>
                <View style={styles.filterSection}>
                    <TouchableOpacity
                        style={[styles.filterButton, sortOrder === 'asc' && styles.selectedFilterButton]}
                        onPress={() => setSortOrder('asc')}>
                        <Text style={[styles.filterButtonText, sortOrder === 'asc' && styles.selectedFilterButtonText]}>Възходящо</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, sortOrder === 'desc' && styles.selectedFilterButton]}
                        onPress={() => setSortOrder('desc')}>
                        <Text style={[styles.filterButtonText, sortOrder === 'desc' && styles.selectedFilterButtonText]}>Низходящо</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.filterButton]} onPress={() => setSortOrder('')}>
                        <FontAwesomeIcon icon={faTrashCan} size={20} color={Colors.error} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={[styles.filterButton, { width: 305 }, address.lat && styles.selectedFilterButton]}
                    onPress={findNearMe}>
                    <Text style={[styles.filterButtonText, sortBy === 'Име' && styles.selectedFilterButtonText]}>Намери най-близо до мен</Text>
                </TouchableOpacity>

                <View style={{ height: 250, width: 300 }}>
                    <Text style={{ textAlign: 'center' }}>{!address.lat && 'или...'}</Text>
                    {!address.lat ?
                        <GooglePlacesAutocomplete
                            placeholder='Въведете локация...'
                            onPress={handlePlaceSelect}
                            minLength={1}
                            query={{
                                key: googleKey,
                                language: 'bg',
                                components: 'country:bg'
                            }}
                            keepResultsAfterBlur={true}
                            autoFocus={false}
                            fetchDetails={true}
                            styles={autocompleteStyles}
                        /> :
                        <View style={commonStyles.container}>
                            <Text style={commonStyles.simpleText}>Максимална Дистанция: {sliderOneValue} км.</Text>
                            <View style={{
                                width: 280,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                                <Text>1км</Text>
                                <Text>50км</Text>
                            </View>
                            <MultiSlider
                                values={sliderOneValue}
                                min={1}
                                max={50}
                                step={1}
                                showSteps={true}
                                swhoStepMarkers={true}
                                showStepMarkers={true}
                                showStepLabels={true}
                                sliderLength={280}
                                onValuesChangeStart={sliderOneValuesChangeStart}
                                onValuesChange={sliderOneValuesChange}
                                onValuesChangeFinish={sliderOneValuesChangeFinish}
                            />
                        </View>}
                </View>


                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Отказ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleApplyFilters}>
                        <Text style={styles.buttonText}>Приложи</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal >
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        margin: 20,
        paddingBottom: 10,
        borderRadius: 20,
        borderColor: Colors.dark,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    top: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: Colors.dark,
        marginBottom: 10,
        padding: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.white
    },
    filterSection: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    filterButton: {
        backgroundColor: '#e5e5e5',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 10,
    },
    selectedFilterButton: {
        backgroundColor: Colors.highlight,
    },
    filterButtonText: {
        color: '#333',
        fontSize: 16,
        textAlign: 'center',
    },
    selectedFilterButtonText: {
        color: Colors.dark,
    },
    buttonsContainer: {
        width: '60%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: Colors.dark,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

const autocompleteStyles = {
    textInputContainer: {
        width: '100%',
    },
    textInput: commonStyles.input,
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
export default FiltersModalComponent;
