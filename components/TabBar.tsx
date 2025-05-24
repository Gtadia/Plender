import { View, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colorTheme$ } from '@/utils/stateManager';
import { AntDesign } from '@expo/vector-icons';

const TabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  const icons = {
    index: (props: any) => <AntDesign name="home" size={24} color={textColor} {...props} />,
    two: (props: any) => <AntDesign name="pluscircleo" size={24} color={textColor} {...props} />,
    pieChart: (props: any) => <AntDesign name="user" size={24} color={textColor} {...props} />,
  }

  const primaryColor = colorTheme$.colors.primary.get();
  const textColor = colorTheme$.nativeTheme.colors.text.get();

  return (
    <View style={[styles.tabBar, { bottom: insets.bottom, left: 20, }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
          >

            {
              icons[route.name] ? (
                icons[route.name]({ color: isFocused ? primaryColor : textColor })
              ) : (
                <Text style={{ color: isFocused ? primaryColor : textColor }}>
                  {label}
                </Text>
              )
            }
            <Text style={{ color: isFocused ? primaryColor : textColor }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colorTheme$.nativeTheme.colors.card.get(),
    paddingVertical: 12,
    width: 300,
    borderRadius: 25,

    // borderWidth: 1,
    // borderColor: 'red',
    alignItems: 'center',
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default TabBar