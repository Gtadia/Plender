import { View, Text } from 'react-native'
import React, { useState } from 'react'

import Svg, { Circle} from 'react-native-svg';

const Clock = () => {
    const [dashOffset, setDashOffset] = useState(0);
    // setTimeout(() => {setDashOffset(157.5)}, 2000);

  return (
    <View className="">
        <View className="w-[160px] h-[160px]">
            <View className='w-[160px] h-[160px] border-2 border-black  justify-center items-center'>
                <View className="w-[120px] h-[120px] border-2 border-black  justify-center items-center">
                    <Text className="">
                        65%
                    </Text>
                </View>
            </View>
        </View>

        <Svg xmlns="http://www.w3.org/2000/svg" version='1.1' width='160px' height='160px' className="absolute top-0 left-0">
            <Circle cx="80" cy="80" r="65"
  stroke="#0074d9"
  strokeWidth="10"
  strokeDasharray="450"
  strokeDashoffset={`${dashOffset}`}
  className="fill-none"/>
        </Svg>
    </View>
  )
}

export default Clock