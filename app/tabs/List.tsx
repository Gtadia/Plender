import { FlatList, LayoutAnimation, Dimensions, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, Pressable } from 'react-native'
import React, { useState } from 'react'
import { observer } from '@legendapp/state/react'
import { currentTask$, overdueTasks$, todayTasks$, upcomingTasks$ } from '../../db/LegendApp'

import AntDesign from '@expo/vector-icons/AntDesign';
import Card from '../../components/ui/Card'
import BottomSheet from '../../components/BottomSheet'

var {width, height} = Dimensions.get('window');

const List = observer(() => {

  return (
    <View style={styles.container}>
      <Text>[Today's Date]</Text>

      <Item task={todayTasks$.get()} />
      <Item task={overdueTasks$.get()} />
      <Item task={upcomingTasks$.get()} />

      <View style={[styles.absBottom]}>
        {
          currentTask$.get() &&
          // true &&
          <Pressable style={styles.taskBanner} onPress={() => console.log('hello')}>
              <Text>{currentTask$.title.get()}</Text>
              {/* <Text>{currentTask$.tags.get()}</Text> */}
              <Text>{currentTask$.time_goal.get()}</Text>
              <Text>{currentTask$.time_spent.get()}</Text>
          </Pressable>
        }
      </View>
    </View>
  )
})

function Item({task}: any) {
  const [open, setopen] = useState(true);
  const onPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setopen(!open);
  };

  if (task.data.length == 0) {
    return;
  }
  // !open && { height: 40} ==> turn `40` into the height of the text
  return (
    <TouchableOpacity style={[styles.item, !open && { height: 40 }]} onPress={onPress} activeOpacity={1}>
      <View style={[styles.flexRow, {paddingLeft: 15}]}>
        <Text>{task.title}</Text>
        {!open ? <AntDesign name="caretup" size={24} color="black" /> : <AntDesign name="caretdown" size={24} color="black" />}
      </View>

      <FlatList
        data={task.data}
        renderItem={({item}) => <ListItem item={item}/>}
        keyExtractor={item => item.created + Math.random()} // TODO — get rid of Math.random()
      />
    </TouchableOpacity>
  );
}

function ListItem({item}: any) {
  return (
    <View style={{height: 85, backgroundColor: 'red', borderRadius: 15, flexDirection: 'row', alignItems: 'center', padding: 20, justifyContent: 'space-between', margin: 7}}>
      <View style={{flexDirection: 'row'}}>
        <View style={{width: 55, height: 55, backgroundColor: 'pink'}}>
          <Text>Progress</Text>
        </View>

        <View>
          <Text>{item.title}</Text>
          {
            item.category ? <Text>{item.category.title.get()}</Text> : <Text>Nope</Text>
          }
        </View>
      </View>

      <View>
        <Text>Hi</Text>
      </View>
    </View>
  )
}

export default List

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    backgroundColor: 'blue'
  },
  flexRow: {
    flexDirection: 'row',
  },
  item: {
    width: '100%',
    paddingHorizontal: 20,
    overflow: 'hidden',
    paddingVertical: 10,
    marginBottom: 5,
  },

  absBottom: {
    position: 'absolute',
    bottom: 0,
  },
  taskBanner: {
    width: width,
    height: 120,
    backgroundColor: 'green',
  }
})