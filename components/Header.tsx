import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Header = ({name, toggleNav}) => {
  return (
    <View style={styles.header}>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <TouchableOpacity onPress={toggleNav}>
        <MaterialIcons name='menu' size={24} color='black' />
      </TouchableOpacity>
      <Text>{name}</Text>
    </View>

    <TouchableOpacity>
      <MaterialCommunityIcons name="clock-outline" size={24} color='black' />
    </TouchableOpacity>
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
  }
})