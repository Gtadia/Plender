import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'

const TaskCard = ({  }) => {
  return (
    // todo — should I add a border style or not?
    <View style={{...styles.container, ...styles.borderStyle}}>
      <Text>Hi</Text>
    </View>
  )
}

export default TaskCard

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width * 0.9,
    height: 70,
    justifyContent: "center",

    backgroundColor: "gray",
  },
  borderStyle: {
    mainTime: 15
  }
})