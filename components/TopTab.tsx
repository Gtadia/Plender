import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import List from "../app/tabs/List";
import { Calendar } from "react-native-calendars";

const TopTab = () => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.container,
        tabBarIndicatorStyle: styles.indicator,
        tabBarItemStyle: styles.item,
        tabBarLabelStyle: styles.label,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.5)",
      }}
    >
      <Tab.Screen name="List " component={List} />
      <Tab.Screen name="Calendar " component={Calendar} />
    </Tab.Navigator>
  );
};

export default TopTab;

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "bold",
  },
  item: {},
  indicator: {
    backgroundColor: "white",
    position: "absolute",
    zIndex: -1,
    bottom: "15%",
    height: "70%",
    borderRadius: 100,
    width: "45%",
    left: "2.5%",
  },
  container: {
    backgroundColor: "black",
    width: "90%",
    alignSelf: "center",
    borderRadius: 100,
  },
});
