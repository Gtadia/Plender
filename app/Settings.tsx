import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import DrawerSceneWrapper from '../components/DrawerSceneWrapper'
import Header from '../components/Header'

const Settings = ({navigation}) => {
  return (
    <DrawerSceneWrapper>
      <Header name='Settings' toggleNav={navigation.openDrawer} />
      <View>
        <Text>Settings</Text>
      </View>
    </DrawerSceneWrapper>
  )
}

export default Settings

const styles = StyleSheet.create({})