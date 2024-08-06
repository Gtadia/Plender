import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AndroidSafeArea from './AndroidSafeArea';


const DrawerSceneWrapper = ({children}) => {
  return (
    <SafeAreaView style={AndroidSafeArea.AndroidSafeArea} edges={['top', 'left', 'right']}>
      {children}
    </SafeAreaView>
  )
}

export default DrawerSceneWrapper