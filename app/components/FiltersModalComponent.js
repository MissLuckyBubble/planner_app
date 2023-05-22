import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput } from 'react-native';
import { Colors } from '../assets/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

const FiltersModalComponent = ({ visible, onClose, onApply }) => {
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [city, setCity] = useState('');

    const handleApplyFilters = () => {
        const filters = {
            sortBy,
            sortOrder,
            city,
        };
        onApply(filters);
    };

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

                <Text>Град:</Text>
                <View style={styles.filterSection}>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => setCity(text)}
                        value={city}
                        placeholder="Въведи град..."
                    />
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
        borderRadius: 10,
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
    input: {
        width: '80%',
        height: 35,
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: Colors.dark
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

export default FiltersModalComponent;
