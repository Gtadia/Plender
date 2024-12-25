import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Modal, StyleSheet, Text, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Settings from "./Settings";
import Home from "./Home";
import React from "react";

import { enableReactNativeComponents } from "@legendapp/state/config/enableReactNativeComponents";
import { TouchableOpacity } from "react-native-gesture-handler";
import Picker from "../components/TimeCarousel/Picker";
import { FontWeight } from "@shopify/react-native-skia";
import { Memo, useObservable } from "@legendapp/state/react";
import TimePicker from "../components/Screens/Modals/TimePicker";
import dayjs from "dayjs";
import { SQLiteProvider } from "expo-sqlite";
import { migrateDbIfNeeded } from "../utils/database";

enableReactNativeComponents();

const Drawer = createDrawerNavigator();

// TODO — Make this a legend database thing.
const colors = {
  bg: "#009955",
  transparent: "transparent",
  active: "#990055",
  inactive: "#320122",
};

export default function RootLayout() {
  const drawerIcon = ({ focused, size }: any, name: any) => {
    return (
      <MaterialIcons
        name={name}
        size={size}
        color={focused ? colors.active : colors.inactive}
      />
    );
  };

  const hours$ = useObservable(0);

  return (
    <SQLiteProvider databaseName="database.db" onInit={migrateDbIfNeeded}>
      <>
        {/* <Picker values={[
                {value: 1, label: 1},
                {value: 2, label: 2},
                {value: 3, label: 3},
                {value: 4, label: 4},
                {value: 5, label: 5},
                {value: 6, label: 6},
                {value: 7, label: 7},
                {value: 8, label: 8},
                {value: 9, label: 9},
                {value: 10, label: 10},
                {value: 11, label: 11},
                {value: 12, label: 12},
                {value: 13, label: 13},
              ]}
              moreTextStyles={{ FontWeight: 'bold', }}
              textStyle={{fontSize: 64}}
              ITEM_HEIGHT={72}
              defaultValue={hours$.get()}
              legendState={hours$}
            /> */}

        <Drawer.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            drawerActiveBackgroundColor: colors.transparent,
            drawerInactiveBackgroundColor: colors.transparent,
            drawerActiveTintColor: colors.active,
            drawerInactiveTintColor: colors.inactive,
            overlayColor: colors.transparent,
            drawerStyle: {
              backgroundColor: colors.bg,
            },
          }}
        >
          <Drawer.Screen
            name="Home"
            component={Home}
            options={{
              drawerIcon: (options) => drawerIcon(options, "home"),
            }}
          />
          <Drawer.Screen
            name="Settings"
            component={Settings}
            options={{
              drawerIcon: (options) => drawerIcon(options, "settings"),
            }}
          />
        </Drawer.Navigator>
      </>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
});
