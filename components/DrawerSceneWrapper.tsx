import { SafeAreaView } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AndroidSafeArea from './AndroidSafeArea';


const DrawerSceneWrapper = ({children}) => {
  return (
    <SafeAreaView style={AndroidSafeArea.AndroidSafeArea}>
      {children}
    </SafeAreaView>
  )
}

export default DrawerSceneWrapper