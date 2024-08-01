import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DrawerSceneWrapper = ({children}) => {
  return <View style={styles.container}>{children}</View>;
}

export default DrawerSceneWrapper

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})