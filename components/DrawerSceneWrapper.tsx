import { SafeAreaView, StyleSheet, View, Text } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';


const DrawerSceneWrapper = ({children}) => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {children}
    </SafeAreaView>
  )
}

export default DrawerSceneWrapper

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor:'blue'
  }
})