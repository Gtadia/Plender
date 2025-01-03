import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import SwipeCalendar from "../../components/Screens/Calendar/SwipeCalendar";
import dayjs, { Dayjs } from "dayjs";
import ItemLister from "../../components/ui/ItemLister";
import { swipeableCalendar$, taskList$ } from "../../db/LegendApp";

import {
  dateToday$,
  overdueTasks$,
  todayTasks$,
  upcomingTasks$,
} from "../../db/LegendApp";

import { ScrollView } from "react-native-gesture-handler";
import { Memo, observer, useObservable } from "@legendapp/state/react";
import { useSQLiteContext } from "expo-sqlite";
import { addEvent, getEvent } from "../../utils/database";
import { observable, observe, when } from "@legendapp/state";
import { SQLiteAnyDatabase } from "expo-sqlite/build/NativeStatement";

var { width } = Dimensions.get("window");

const Calendar = () => {
  const db = useSQLiteContext();
  const events = useObservable<Event[]>();

  const loadEvents = async (date: Dayjs | null) => {
    const filter = {
      due_or_repeated_dates: {
        start: date?.format("MM-DD-YYYY") || null,
      },
    };

    const result = await getEvent(db, filter);
    events.set(result);
    console.log("Load Events", result);
  };

  observe(() => {
    // Basically useEffect
    loadEvents(swipeableCalendar$.activeDay.get());
  });

  const hi = async () =>
    await addEvent(db, {
      label: "Hello",
      goal_time: 23,
      due_date: dayjs(),
    });

  hi();

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

      <ScrollView style={[styles.container]}>
        // todo — replace this
        <Memo>
          {() => {
            events.get()?.forEach((event) => {
              console.warn("event", event);
            });
            console.error("This is working");
          }}
        </Memo>
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
