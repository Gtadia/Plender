import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useState } from 'react'

const TaskCard = ({ task }) => {
  const [tags, setTags] = useState(['hi', 'bye']);

  return (
    // todo — should I add a border style or not?
    <View style={{...styles.container, ...styles.borderStyle}}>
      <View>
        <Text>
          {"test text"}
        </Text>

        <View style={{backgroundColor: 'transparent', width: 150, height: 40, flexDirection: 'row'}}>
          {
            tags.map((tag) => (
              <View>
                <Text>{tag}</Text>
              </View>
            ))
          }
          <View>
            <Text>Hello</Text>
          </View>
        </View>
      </View>
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
    borderRadius: 12
  }
})