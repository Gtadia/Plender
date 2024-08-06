import { FlatList, LayoutAnimation, Dimensions, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, Pressable } from 'react-native'
import React, { useState } from 'react'
import { observer } from '@legendapp/state/react'
import { currentTask$, overdueTasks$, todayTasks$, upcomingTasks$ } from '../../db/LegendApp'

import AntDesign from '@expo/vector-icons/AntDesign';
import Card from '../../components/ui/Card'

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

const List = observer(() => {

  return (
    <View style={styles.container}>
      <Text>[Today's Date]</Text>

      {/* <SectionList
        sections={[todayTasks$.get(), overdueTasks$.get(), upcomingTasks$.get()]}
        keyExtractor={(item, index) => item + index}
        renderItem={({item, index}) => <Card item={item} index={index}/>}
        ListEmptyComponent={<Text>Empty List</Text>}
        renderSectionHeader={({section}) => (
          <Text>{section.title}</Text>
        )}
        stickySectionHeadersEnabled
      /> */}


      <Item task={todayTasks$.get()} />
      <Item task={overdueTasks$.get()} />
      <Item task={upcomingTasks$.get()} />

      <View style={[styles.absBottom]}>
        {
          // currentTask$.get() &&
          true &&
          <Pressable style={styles.taskBanner} onPress={() => console.log('hello')}>
              <Text>{currentTask$.title.get()}</Text>
              <Text>{currentTask$.tags.get()}</Text>
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
      <View style={styles.flexRow}>
        <Text>{task.title}</Text>
        {!open ? <AntDesign name="caretup" size={24} color="black" /> : <AntDesign name="caretdown" size={24} color="black" />}
      </View>

      <FlatList
        data={task.data}
        renderItem={({item}) => <Text>{item.title}</Text>}
        keyExtractor={item => item.created}
      />
    </TouchableOpacity>
  );

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
    borderWidth: 1,
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