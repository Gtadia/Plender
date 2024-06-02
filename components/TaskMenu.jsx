import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'

import { BlurView } from "expo-blur";

const TaskMenu = ({ task, closeHandler}) => {
  return (
    // <View style={styles.background}>
        <BlurView intensity={50} tint='dark' style={styles.blurContainer} experimentalBlurMethod={true}>
            <View style={styles.container}>
                {/* Close Button */}
                <TouchableOpacity onPress={closeHandler} style={{width: 25, height: 25, position: "absolute", right: 15, top: 15}}>
                    <Image source={require("../assets/icon.png")} resizeMode='contain' style={{width: "100%", height: "100%"}}/>
                </TouchableOpacity>

                <ScrollView
                    style={styles.scrollView}
                >
                    <Text>Hi </Text>
                </ScrollView>
            </View>
        </BlurView>
    // </View>
  )
}

export default TaskMenu

const styles = StyleSheet.create({
    blurContainer: {
        position: "absolute",
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",

        zIndex: 10,  // works on ios
        elevation: 10,   // works on android
    },
    background: {
        position: "absolute",
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',

        zIndex: 10,  // works on ios
        elevation: 10,   // works on android

        // backgroundColor:
        // blur background
    },
    container: {
        // left: "-50%",
        // position: "absolute",
        width: '75%',
        height: '60%',
        backgroundColor: 'white',
        borderRadius: 25,
        alignItems: 'center'
    },
    scrollView: {
        margin: 15,
    }
})