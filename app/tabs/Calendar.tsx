import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import SwipeCalendar from "../../components/Screens/Calendar/SwipeCalendar";
import dayjs from "dayjs";
import ItemLister from "../../components/ui/ItemLister";

import {
  dateToday$,
  overdueTasks$,
  todayTasks$,
  upcomingTasks$,
} from "../../db/LegendApp";

import { ScrollView } from "react-native-gesture-handler";

var { width } = Dimensions.get("window");

const Calendar = () => {
  const datesBlacklistFunc = (date: any) => {
    return date.isoWeekday() === 6; // disable Saturdays
  };

  // todo — remove (any) type
  return (
    <>
      <SwipeCalendar
        height={100} //height of the strip -- default 75
        dayPressed={(day: any) => console.log(day)} //executes when day is pressed
        showMonth={true} //accepts boolean -- default = true
        showYear={true} //accepts boolean -- default = true
        startingDate={dayjs()} //accepts Date or dayjs date format -- default = dayjs()
        activeDay={dayjs().add(1, "day")} //accepts Date/Moment date format
        onMount={() => console.log("calendar did mount")}
        calendarSwiped={(direction: any) =>
          direction == 0
            ? console.log("calendar swiped to left")
            : console.log("calendar swiped to right")
        }
      />

      <ScrollView style={[styles.container]}>
        <ItemLister task={todayTasks$} />

        {/* TODO — Come up with a better solution later... */}
        {/* <View style={styles.taskFooterDimension} /> */}
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
