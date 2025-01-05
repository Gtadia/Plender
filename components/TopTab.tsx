import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import List from "../app/tabs/List";
import Calendar from "../app/tabs/Calendar";

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
        sceneStyle: { backgroundColor: "rgba(0, 0, 0, 0)" },
      }}
      style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
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
  item: {
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    backgroundColor: "white",
    borderRadius: 100,
    position: "absolute",
    zIndex: -1,
    bottom: "15%",
    // left: "2.5%",
    marginHorizontal: "2.5%",
    height: "70%",
    width: "45%",
  },
  container: {
    backgroundColor: "black",
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
});
