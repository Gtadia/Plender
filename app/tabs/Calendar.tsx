import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import SwipeCalendar from "../../components/Screens/Calendar/SwipeCalendar";
import dayjs from "dayjs";
import ItemLister from "../../components/ui/ItemLister";
import { swipeableCalendar$, taskList$ } from "../../db/LegendApp";

import {
  dateToday$,
  overdueTasks$,
  todayTasks$,
  upcomingTasks$,
} from "../../db/LegendApp";

import { ScrollView } from "react-native-gesture-handler";
import { Memo } from "@legendapp/state/react";
import { useSQLiteContext } from "expo-sqlite";
import { addEvent, getEvent } from "../../utils/database";

var { width } = Dimensions.get("window");

const Calendar = () => {
  const db = useSQLiteContext();
  // todo — remove (any) type
  return (
    <>
      <SwipeCalendar
        height={100} //height of the strip -- default 75
        dayPressed={(day: any) => console.log(day)} //executes when day is pressed
        showMonth={true} //accepts boolean -- default = true
        showYear={true} //accepts boolean -- default = true
        startingDate={dayjs()} //accepts Date or dayjs date format -- default = dayjs()
        // TODO — why do we .add(1, "day")?
        activeDay={dayjs()} //accepts Date/Moment date format
        onMount={() => console.log("calendar did mount")}
        calendarSwiped={(direction: any) =>
          direction == 0
            ? console.log("calendar swiped to left")
            : console.log("calendar swiped to right")
        }
      />

      <Button
        title="Add to Event"
        onPress={async () => {
          const event = {
            label: "Test Event",
            due_date: dayjs(),
            goal_time: 230,
          };
          console.log("What2");
          const result = await addEvent(db, event);

          console.log("event added: " + result);
        }}
      />

      <Button
        title="Print Event"
        onPress={async () => {
          const filter = {
            due_or_repeated_dates: {
              start: swipeableCalendar$.activeDay.get().format("YYYY-MM-DD"),
            },
          };
          const result = await getEvent(db, filter);

          console.log(result);

          console.log(await getEvent(db, {}));
        }}
      />

      <Button
        title="Print Event"
        onPress={async () => {
          const filter = {
            due_or_repeated_dates: {
              start: swipeableCalendar$.activeDay.get().format("YYYY-MM-DD"),
            },
          };
          const result = await getEvent(db, filter);

          console.log(result);

          console.log(await getEvent(db, {}));
        }}
      />

      <ScrollView style={[styles.container]}>
        // todo — replace this
        {/* <Memo>{() => getEventsOnDate(swipeableCalendar$.activeDay.get())}</Memo> */}
      </ScrollView>
    </>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexRow: {
    flexDirection: "row",
  },
  item: {
    width: "100%",
    paddingHorizontal: 20,
    overflow: "hidden",
    paddingVertical: 10,
    marginBottom: 5,
  },

  taskFooterDimension: {
    width: width,
    height: 120,
  },
  taskFooterStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
});
