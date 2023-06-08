import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import { AuthContext } from '../../context/AuthContext';
import { Colors } from '../../assets/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faPenToSquare, faRectangleXmark, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { TextInputMask } from 'react-native-masked-text';
import CheckBox from '@react-native-community/checkbox';

const WorkTimeScreen = ({ navigation }) => {

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

  const [schedule, setSchedule] = useState([]);
  const getSchedule = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/business/workday/schedule`, config);
      const result = response.data.data;
      setSchedule(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSchedule();
  }, []);

  const [editingDayIds, setEditingDaysId] = useState([]);

  const [openHour, handleOpenHour] = useState('');
  const [closeHour, handleCloseHour] = useState('');
  const [pauseStart, handlePauseStart] = useState('');
  const [pauseEnd, handlePauseEnd] = useState('');
  const [is_off, handleIsOff] = useState(false);

  const editClicked = (schedule) => {
    setEditingDaysId(schedule.id);
    handleOpenHour(schedule.times.start);
    handleCloseHour(schedule.times.end);
    handlePauseStart(schedule.times.pause.start);
    handlePauseEnd(schedule.times.pause.end);
    handleIsOff(schedule.is_off);
    setError('');
  }

  const [editWorkDayError, setError] = useState('');

  const onEditSchedule = async () => {
    if (is_off) {
      try {
        response = await axios.patch(`${BASE_URL}/business/workday/setDayOff/${editingDayIds}`, '',
          config);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
      setEditingDaysId([]);
      getSchedule();
      setError('');
    } else if (openHour != null && closeHour != null && openHour !== '' && closeHour !== '') {
      try {
        response = await axios.patch(`${BASE_URL}/business/workday/edit/${editingDayIds}`,
          {
            start_time: openHour.slice(0, 5),
            end_time: closeHour.slice(0, 5),
            pause_start: pauseStart && pauseStart.slice(0, 5),
            pause_end: pauseEnd && pauseEnd.slice(0, 5),
          },
          config);
      } catch (error) {
        console.log(error.response.data.message);
        var msg = error.response.data.message;
        if (msg.includes('Края трябва да е след старта на работния ден.')) {
          setError('Края трябва да е след старта на работния ден.');
        } else if (msg.includes('Старта на почивката трябва да е преди края на работния ден.')) {
          setError('Старта на почивката трябва да е преди края на работния ден.');
        } else if (msg.includes('Края на почивката трябва да е след началото й.')) {
          setError('Края на почивката трябва да е след началото й.');
        } else if (msg.includes('Края на почивката трябва да е преди края на работния ден.')) {
          setError('Края на почивката трябва да е преди края на работния ден.');
        } else setError('Възникна грешка моля опитайте отново');
        return;
      }
      setEditingDaysId([]);
      getSchedule();
      setError('');
    } else {
      setError('Начало и Край на работния ден са задължителни полета!');
    }
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.nameText}>Настройки на бизнеса</Text>
        <TouchableOpacity onPress={openDrawer}>
          <FontAwesomeIcon icon={faBars} size={24} color={Colors.dark} />
        </TouchableOpacity>
      </View>
      <View style={{ padding: 10 }}>
        <Text style={styles.label}>Работно време</Text>
        <View style={{ marginBottom: 20 }}>
          {schedule && schedule.map((schedule) => (
            <View
              key={schedule.id}
              style={styles.scheduleItem}>
              {schedule && editingDayIds.includes(schedule.id) ?
                <View>
                  <View style={styles.row}>
                    <Text style={[styles.dayName, { marginBottom: 0 }]}>{schedule.day_name}</Text>
                    <TouchableOpacity style={{ marginRight: 1 }} onPress={() => setEditingDaysId([])}>
                      <FontAwesomeIcon icon={faRectangleXmark} size={20} color={Colors.error} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onEditSchedule}>
                      <FontAwesomeIcon style={{ marginRight: 1 }} icon={faSquareCheck} size={20} color={Colors.light} />
                    </TouchableOpacity>
                  </View>
                  {editWorkDayError && <Text style={[styles.dayName, { color: Colors.error }]}>{editWorkDayError}</Text>}
                  <View style={styles.row}>
                    <Text style={styles.editLabel} >Почивен:</Text>
                    <CheckBox
                      disabled={false}
                      value={is_off}
                      onValueChange={(newValue) => handleIsOff(newValue)}
                      style={{ marginRight: 2 }}
                    />
                  </View>
                  <View style={[styles.row, { width: 250 }]}>
                    <Text style={styles.editLabel}>Начало на работния ден:</Text>
                    <TextInputMask
                      type={'datetime'}
                      options={{ format: 'HH:mm' }}
                      placeholder={'00:00'}
                      value={openHour}
                      onChangeText={handleOpenHour}
                      editable={!is_off}
                      style={styles.editInput}
                    />
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.editLabel} >Край на работния ден:</Text>
                    <TextInputMask
                      type={'datetime'}
                      options={{ format: 'HH:mm' }}
                      placeholder={'00:00'}
                      value={closeHour}
                      onChangeText={handleCloseHour}
                      editable={!is_off}
                      style={styles.editInput}
                    />
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.editLabel} >Начало на почивката:</Text>
                    <TextInputMask
                      type={'datetime'}
                      options={{ format: 'HH:mm' }}
                      placeholder={'00:00'}
                      value={pauseStart}
                      onChangeText={handlePauseStart}
                      style={styles.editInput}
                      editable={!is_off}
                    />
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.editLabel} >Край на почивката:</Text>
                    <TextInputMask
                      type={'datetime'}
                      options={{ format: 'HH:mm' }}
                      placeholder={'00:00'}
                      value={pauseEnd}
                      onChangeText={handlePauseEnd}
                      style={styles.editInput}
                      editable={!is_off}
                    />
                  </View>
                </View>
                :
                <View>{
                  schedule.is_off == false ?
                    <View style={styles.scheduleTextContainer}>
                      <View style={styles.row}>
                        <Text style={[styles.dayName, { marginBottom: 0 }]}>{schedule.day_name}</Text>
                        <TouchableOpacity onPress={() => editClicked(schedule)}>
                          <FontAwesomeIcon icon={faPenToSquare} size={16} color={Colors.dark} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.workHours}>
                        {schedule.times.start} - {schedule.times.end}
                      </Text>
                      <View style={styles.row}>
                        <Text>Почивка: </Text>
                        <Text style={styles.workHours}>
                          {schedule.times.pause.start} - {schedule.times.pause.end}
                        </Text>
                      </View>
                    </View>
                    : <View style={styles.scheduleTextContainer}>
                      <View style={styles.row}>
                        <Text style={[styles.dayName, { marginBottom: 0 }]}>{schedule.day_name}</Text>
                        <TouchableOpacity onPress={() => editClicked(schedule)}>
                          <FontAwesomeIcon icon={faPenToSquare} size={16} color={Colors.dark} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.workHours}>
                        Почивен ден
                      </Text>
                    </View>
                }
                </View>}
            </View>
          ))}
        </View>
      </View>
    </ScrollView >

  );
};

export default WorkTimeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 5,
    backgroundColor: Colors.primary,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.dark,
    marginHorizontal: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.dark,
    backgroundColor: Colors.highlight,
    padding: 10,
    borderRadius: 5,
    textAlign: 'center'
  },
  btntext: {
    fontSize: 18,
    color: Colors.white
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
  dayName: {
    fontSize: 16,
    color: Colors.dark,
    fontWeight: 'bold',
    marginRight: 5,
  },
  workHours: {
    fontSize: 16,
  },
  editLabel: {
    marginRight: 5,
    fontSize: 16,
    color: Colors.dark,
  },
  editInput: {
    height: 40,
    backgroundColor: Colors.white,
    borderRadius: 5,
    borderColor: Colors.primary,
    borderWidth: 1,
    paddingHorizontal: 10
  },
});