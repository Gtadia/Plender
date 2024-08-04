import { SectionList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { observer } from '@legendapp/state/react'
import { overdueTasks$, todayTasks$, upcomingTasks$ } from '../../db/LegendApp'
import Card from '../../components/ui/Card'

const List = observer(() => {
  return (
    <View>
      <Text>[Today's Date]</Text>

      <SectionList
        sections={[todayTasks$.get(), overdueTasks$.get(), upcomingTasks$.get()]}
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => <Card item={item}/>}
        ListEmptyComponent={<Text>Empty List</Text>}
        renderSectionHeader={({section}) => (
          <Text>{section.title}</Text>
        )}
        stickySectionHeadersEnabled
      />
    </View>
  )
})

export default List

const styles = StyleSheet.create({})