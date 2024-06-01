import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useState } from 'react'

const CurrentTaskCard = ({ task }) => {
  const [tags, setTags] = useState([]);

  return (
    // todo — should I add a border style or not?
    <View style={{...styles.container, ...styles.borderStyle}}>
        <View style={{position: 'absolute', width: '50%', height: '100%', backgroundColor: 'green', left: 0, top: 0, ...styles.borderStyle}}></View>

        <View style={{justifyContent: 'center', marginLeft: 30}}>
          <Text>
            {"test text"}
          </Text>

          <View style={{backgroundColor: 'transparent', width: 150, height: 40, flexDirection: 'row', alignItems: 'center'}}>
            {
              tags.map((tag) => (
                <View>
                  <Text>{tag}</Text>
                </View>
              ))
            }
            {
              tags.length === 0  &&
              <View>
                <Text>add tag</Text>
              </View>
            }
          </View>
        </View>

        <View style={{marginRight: 15}}>
          <View>
            <Text>{"1:38"}</Text>
          </View>
          <View>
            <Text style={{fontStyle: 'italic'}}>{"/2:00"}</Text>
          </View>
        </View>
    </View>
  )
}

export default CurrentTaskCard

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width * 0.9,
    height: 70,

    justifyContent: "space-between",
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: "gray",

  },
  borderStyle: {
    borderRadius: 12
  },
  test: {
    borderWidth: 2,
    borderColor: 'red'
  }
})