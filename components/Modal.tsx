import { StyleSheet, Text, View, Modal as RNModal, ModalProps, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'

type PROPS = ModalProps & {
  isOpen: boolean
  withInput?: boolean
}

const Modal = ({ isOpen, withInput, children, ...props }: PROPS) => {
  const content = withInput ? (
    <KeyboardAvoidingView
      style={{alignItems: 'center', justifyContent: 'center', flex: 1, padding: 3, backgroundColor: 'rgba(24, 24, 27, 0.4)'}}
      behavior={ Platform.OS == 'ios' ? 'padding' : 'height' }
      >
      {children}
    </KeyboardAvoidingView>
  ): (
    <View
      style={{alignItems: 'center', justifyContent: 'center', flex: 1, padding: 3, backgroundColor: 'rgba(24, 24, 27, 0.4)'}}
      >
      { children }
    </View>
  )

  return (
    <RNModal
      visible={isOpen}
      transparent={true}
      animationType='fade'
      statusBarTranslucent={true}
      {...props}
      >
        {content}
    </RNModal>
  )
}

export default Modal

const styles = StyleSheet.create({})