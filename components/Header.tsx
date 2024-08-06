import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

const Header = ({name, toggleNav}) => {
  return (
    <View style={styles.header}>
    <View style={styles.flexRow}>
      <TouchableOpacity onPress={toggleNav}>
        <MaterialIcons name='menu' size={24} color='black' />
      </TouchableOpacity>
      <Text>{name}</Text>
    </View>

    <View style={styles.flexRow}>
      <TouchableOpacity style={styles.addButton}>
        <AntDesign name="plus" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity>
        <MaterialCommunityIcons name="clock-outline" size={24} color='black' />
      </TouchableOpacity>
    </View>
  </View>
  )
}

export default Header

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  addButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    borderRadius: 1000,

  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
})