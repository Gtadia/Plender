import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import { SafeAreaView } from 'react-native-safe-area-context'
import AndroidSafeArea from '../components/AndroidSafeArea'

const Settings = ({ navigation }: any) => {
  return (
    <SafeAreaView style={[AndroidSafeArea.AndroidSafeArea]} edges={['top', 'left', 'right']}>
      <Header name='Settings' toggleNav={navigation.openDrawer} />
      <View>
        <Text>Settings</Text>
      </View>
    </SafeAreaView>
  )
}

export default Settings

const styles = StyleSheet.create({})