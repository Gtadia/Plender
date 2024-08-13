import React from 'react';
import { Text, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';

const App = () => {
  return (
    <MaskedView
      style={{ flex: 1, flexDirection: 'column', width: '100%' }}
      maskElement={
        <View
          style={{
            // Transparent background because mask is based off alpha channel.
            backgroundColor: 'transparent',
            // flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{fontSize: 60,color: 'black',fontWeight: 'bold',}}>Basic Mask</Text>
          <Text style={{fontSize: 60,color: 'black',fontWeight: 'bold',}}>Basic Mask</Text>
          <Text style={{fontSize: 60,color: 'black',fontWeight: 'bold',}}>Basic Mask</Text>
          <Text style={{fontSize: 60,color: 'black',fontWeight: 'bold',}}>Basic Mask</Text>
          <Text style={{fontSize: 60,color: 'black',fontWeight: 'bold',}}>Basic Mask</Text>
          <Text style={{fontSize: 60,color: 'black',fontWeight: 'bold',}}>Basic Mask</Text>
          <Text style={{fontSize: 60,color: 'black',fontWeight: 'bold',}}>Basic Mask</Text>
          <Text style={{fontSize: 60,color: 'black',fontWeight: 'bold',}}>Basic Mask</Text>
          <Text style={{fontSize: 60,color: 'black',fontWeight: 'bold',}}>Basic Mask</Text>
          <Text style={{fontSize: 60,color: 'black',fontWeight: 'bold',}}>Basic Mask</Text>
          <Text style={{fontSize: 60,color: 'black',fontWeight: 'bold',}}>Basic Mask</Text>
          <Text style={{fontSize: 60,color: 'black',fontWeight: 'bold',}}>Basic Mask</Text>
          <Text style={{fontSize: 60,color: 'black',fontWeight: 'bold',}}>Basic Mask</Text>
          <Text style={{fontSize: 60,color: 'black',fontWeight: 'bold',}}>Basic Mask</Text>
        </View>
      }
    >
      {/* Shows behind the mask, you can put anything here, such as an image */}
      <View style={{ height: 100, backgroundColor: '#324376' }} />
      <View style={{ height: 100, backgroundColor: '#F5DD90' }} />
      <View style={{ height: 100, backgroundColor: '#F76C5E' }} />
      <View style={{ height: 100, backgroundColor: '#e1e1e1' }} />
    </MaskedView>
  );
}

export default App