import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
// import { useColorScheme } from '@/components/useColorScheme';
import { useColorScheme } from 'react-native';
// import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { Ionicons } from '@expo/vector-icons';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#333', // dark background
          borderTopWidth: 0,
          height: 80,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = 'home';
            return <FontAwesome name={iconName} size={28} color={focused ? 'white' : 'gray'} />;
          } else if (route.name === 'pieChart') {
            iconName = 'pie-chart';
            return <FontAwesome name={iconName} size={28} color={focused ? 'white' : 'gray'} />;
          } else if (route.name === 'two') {
            iconName = 'line-chart';
            return <FontAwesome name={iconName} size={28} color={focused ? 'white' : 'gray'} />;
          } else if (route.name === 'settings') {
            iconName = 'cog';
            return (
              <View
                style={{
                  borderWidth: 2,
                  borderColor: focused ? 'limegreen' : 'transparent',
                  borderRadius: 12,
                  padding: 4,
                }}
              >
                <FontAwesome name={iconName} size={28} color="white" />
              </View>
            );
          }

          return null;
        },
      })}
    />
  );
}
