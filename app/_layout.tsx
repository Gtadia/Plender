import { StatusBar } from 'expo-status-bar';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useReducer, useRef, useEffect } from 'react'

// navigation
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabBarProps, BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Svg
import Svg, { Path } from 'react-native-svg'
// reanimted
import Animated, { useAnimatedStyle, withTiming, useDerivedValue } from 'react-native-reanimated'
// lottie
import Lottie from 'lottie-react-native'
import { useFont } from '@shopify/react-native-skia';
import { fontState$ } from '../db/LegendApp';
import Timer from '../components/Timer';
import Home from './Home';
import Settings from './Settings';
import TestPanel from './TestPanel';


// ----------
const Tab = createBottomTabNavigator();

const AnimatedSvg = Animated.createAnimatedComponent(Svg)
// ----------

export default function RootLayout() {
  const font = useFont(require("../assets/fonts/fffforward.ttf"), 32);
  if (!font) {
      // prevent rendering without fonts being rendered
      console.log("did this run?")
      return <View />;
  }

  fontState$.font.set(font)
  return (
    <>
      {/* Start Timer */}
      <Timer />
      <StatusBar style="auto" />
        <Tab.Navigator
          tabBar={(props) => <AnimatedTabBar {...props} />}
        >
          <Tab.Screen
            name="Home"
            options={{
              // @ts-ignore
              tabBarIcon: ({ ref }) => <Lottie ref={ref} loop={false} source={require('../assets/home.icon.json')} style={styles.icon} />,
              headerShown: false
            }}
            component={Home}
            />

          <Tab.Screen
            name="Settings"
            options={{
              // @ts-ignore
              tabBarIcon: ({ ref }) => <Lottie ref={ref} loop={false} source={require('../assets/settings.icon.json')} style={styles.icon} />,
              headerShown: false
            }}
            component={Settings}
            />

          <Tab.Screen
            name="TestPanel"
            options={{
              // @ts-ignore
              tabBarIcon: ({ ref }) => <Lottie ref={ref} loop={false} source={require('../assets/chat.icon.json')} style={styles.icon} />,
              headerShown: false
            }}
            component={TestPanel}
            />
        </Tab.Navigator>
    </>
  );
}

// ---------

const AnimatedTabBar = ( { state: { index: activeIndex, routes}, navigation, descriptors }: BottomTabBarProps) => {
  const { bottom } = useSafeAreaInsets()

  // gets info about the components position on the screen
  const reducer = (state: any, action: { x: number, index: number }) => {
    return [...state, { x: action.x, index: action.index }]
  }

  const [layout, dispatch] = useReducer(reducer, [])
  // console.log(layout)

  const handleLayout = (event: LayoutChangeEvent, index: number) => {
    dispatch({ x: event.nativeEvent.layout.x, index })
  }

  // animations
  const xOffset = useDerivedValue(() => {
    // Our code hasn't finished rendering yet, so we can't use teh layout values
    if (layout.length !== routes.length) return 0;
    // We can use the layout values
    // Copy layout to avoid errors between different threads
    // We subtract 25 so the active background is centered behind our TabBar components
    // 20 pixels is the width of the left part of the svg (the quarter circle outwards)
    // 5 pixels come from the little gap between the active background and the circle of the TabBar component
    return [...layout].find(({ index }) => index === activeIndex)!.x - 25
    // Calculate the offset new if the activeIndex changes (e.g. when a new tab is selected)
    // or the layout changes (e.g. when the components haven't finished rendering yet)
  }, [activeIndex, layout])

  const animtedStyles = useAnimatedStyle(() => {
    return {
      // translateX to the calculated offset with a smooth transition
      transform: [{ translateX: withTiming(xOffset.value, {duration: 250})}]
    }
  })

  return (
    <View style={[styles.tabBar, { paddingBottom: bottom + 12 }]}>
      <AnimatedSvg
        width={110}
        height={60}
        viewBox="0 0 110 60"
        style={[styles.activeBackground, animtedStyles]}
      >
        <Path
          fill="#604AE6"
          d="M20 0H0c11.046 0 20 8.953 20 20v5c0 19.33 15.67 35 35 35s35-15.67 35-35v-5c0-11.045 8.954-20 20-20H20z"
        />
      </AnimatedSvg>

      <View style={styles.tabBarContainer}>
        {routes.map((route, index) => {
          const active = index === activeIndex
          const { options } = descriptors[route.key]

          return (
            <TabBarComponent
              key={route.key}
              active={active}
              options={options}
              onLayout={(e) => handleLayout(e, index)}
              onPress={() => navigation.navigate(route.name)}
            />
          )
        })}
      </View>
    </View>
  )
}

// ---------

type TabBarComponentProps = {
  active?: boolean
  options: BottomTabNavigationOptions
  onLayout: (e: LayoutChangeEvent) => void
  onPress: () => void
}

const TabBarComponent = ({ active, options, onLayout, onPress }: TabBarComponentProps) => {
  // handle lottie animations
  const ref = useRef(null)

  useEffect(() => {
    if (active && ref?.current) {
      // @ts-ignore
      ref.current.play()
    }
  }, [active])

  // animations
  const animatedComponentCircleStyles = useAnimatedStyle(() => {
    return {
      transform: [{
        scale: withTiming(active ? 1 : 0, { duration: 250 })
      }]
    }
  })

  const animatedIconContainerStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(active? 1 : 0.5, { duration: 250 })
    }
  })

  return (
    <Pressable onPress={onPress} onLayout={onLayout} style={styles.component}>
      <Animated.View style={[styles.componentCircle, animatedComponentCircleStyles]} />
      <Animated.View style={[styles.iconContainer, animatedIconContainerStyles]}>
        { options.tabBarIcon ? options.tabBarIcon({ ref }) : <Text>?</Text>}
      </Animated.View>
    </Pressable>
  )
}

// ---------

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
  activeBackground: {
    position: 'absolute',
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  component: {
    height: 60,
    width: 60,
    marginTop: -5,
  },
  componentCircle: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    height: 36,
    width: 36,
  }
});