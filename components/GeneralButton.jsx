import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'


const Button = ({ title, handlePress, otherStyles}) => {
  return (
    <TouchableOpacity
        className={`w-full h-[60px] bg-orange-500 justify-center items-center ${otherStyles}`}
        onPress={handlePress}
    >
        <Text className="font-bold text-lg">{ title }</Text>
    </TouchableOpacity>
  )
}

export default Button