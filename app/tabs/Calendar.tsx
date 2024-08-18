import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Agenda, AgendaSchedule, DateData } from "react-native-calendars";
import { useObservable } from "@legendapp/state/react";

const timeToString = (time: number) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};

const Calendar = () => {
  const items$ = useObservable({});

  const loadItems = (day: DateData) => {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        if (!items$.get()[strTime]) {
          items$.get()[strTime] = [];

          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            items$[strTime].push({
              name: "Item for " + strTime + " #" + j,
              height: Math.max(50, Math.floor(Math.random() * 150)),
              day: strTime,
            });
          }
        }
      }

      const newItems: AgendaSchedule = {};
      Object.keys(items$).forEach((key) => {
        newItems[key] = items$.get()[key];
      });

      items$.set(newItems);
    }, 1000);
  };

  return (
    <View style={{ flex: 1 }}>
      <Agenda
        items={items$}
        loadItemsForMonth={loadItems}
        selected={"2017-05-16"}
      />
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({});
