import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Card = ({item}) => {
  return (
    <View>
      <Text>{item.title}</Text>

    </View>
  )
}

export default Card

const styles = StyleSheet.create({})