import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Calendar from "../Screens/Calendar/Calendar";
import dayjs from "dayjs";

const CalendarDatePicker = () => {
  const datesBlacklistFunc = (date: any) => {
    return date.isoWeekday() === 6; // disable Saturdays
  };

  // todo — remove (any) type
  return (
    <View>
      <View style={{ height: 100 }} />
      <Calendar
        height={75} //height of the strip -- default 75
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
    </View>
  );
};

export default CalendarDatePicker;

const styles = StyleSheet.create({});
