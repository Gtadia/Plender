import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const AccountButton = ({ handlePress, style }) => {
    // Global Variable for Profile Picture

  return (
    <TouchableOpacity
        onPress={handlePress}
        style={style}
    >
        <Image source={require("../assets/images/DefaultProfilePic.png")} style={styles.profilePic} resizeMode='contain'/>
    </TouchableOpacity>
  )
}

export default AccountButton

const styles = StyleSheet.create({
    profilePic: {
        width: 55,
        height: 55,
        borderRadius: 50,
    }
})