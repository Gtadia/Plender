// Code from https://withfra.me/components/pickers/simple-calendar-date-picker?utm_source=youtube&utm_medium=video&utm_campaign=react-native-5--34&ref=youtube
// https://www.youtube.com/watch?v=zkNADBWGtBQ

import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
import Swiper from "react-native-swiper";
import { For, Memo, observer, useObservable } from "@legendapp/state/react";
import dayjs, { Dayjs } from "dayjs";
import { overdueTasks$, todayTasks$, upcomingTasks$ } from "../../db/LegendApp";

var isToday = require("dayjs/plugin/isToday");

const { width } = Dimensions.get("window");

const Example = observer(() => {
  dayjs.extend(isToday);
  const swiper = useRef();
  // const value$ = useObservable(new Date());
  const value$ = useObservable(dayjs());
  const week$ = useObservable(0);
  const [week, setWeek] = useState(0);

  const weeks =
    // React.useMemo(() => {
    useObservable(() => {
      // const start = moment().add(week$.get(), "weeks").startOf("week");
      const start = dayjs().add(week$.get(), "week").startOf("week");

      return [-1, 0, 1].map((adj) => {
        return Array.from({ length: 7 }).map((_, index) => {
          const date = start.add(adj, "week").add(index, "day");

          return {
            weekday: date.format("ddd"),
            date: date,
          };
        });
      });
    });
  // }, [week]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Schedule</Text>
        </View>

        <View style={styles.picker}>
          <Swiper
            index={1}
            ref={swiper}
            loop={false}
            showsPagination={false}
            onIndexChanged={(ind) => {
              if (ind === 1) {
                return;
              }
              setTimeout(() => {
                const newIndex = ind - 1;
                // const newWeek = week + newIndex;
                // setWeek(newWeek);
                // setValue(moment(value).add(newIndex, "week").toDate());
                const newWeek = week$.get() + newIndex;
                week$.set(newWeek);
                value$.set((prev: Dayjs) => prev.add(newIndex, "week"));
                swiper.current.scrollTo(1, false);
              }, 100);
            }}
          >
            {weeks.get().map((dates, index) => (
              <View style={styles.itemRow} key={index}>
                {dates.map((item, dateIndex) => {
                  const isActive =
                    value$.get().format("ddd MMM DD YYYY") ===
                    item.date.format("ddd MMM DD YYYY");
                  return (
                    <TouchableWithoutFeedback
                      key={dateIndex}
                      // onPress={() => setValue(item.date)}
                      onPress={() => value$.set(item.date)}
                    >
                      <View
                        style={[
                          styles.item,
                          isActive && {
                            backgroundColor: "#111",
                            borderColor: "#111",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.itemWeekday,
                            isActive && { color: "#fff" },
                          ]}
                        >
                          {item.weekday}
                        </Text>
                        <Text
                          style={[
                            styles.itemDate,
                            isActive && { color: "#fff" },
                          ]}
                        >
                          {item.date.format("DD")}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
            ))}
          </Swiper>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24 }}>
          <Text style={styles.subtitle}>
            {value$.get().format("ddd MMM DD YYYY")}
          </Text>
          <View style={styles.placeholder}>
            <View style={styles.placeholderInset}>
              {/* Replace with your content */}

              <Memo>
                {() => {
                  if (value$.get().isToday()) {
                    return (
                      <For each={todayTasks$.data}>
                        {(item$) => <Item item={item$} />}
                      </For>
                    );
                  } else if (
                    value$.get().format("YY, MM, DD") <
                    dayjs().format("YY, MM, DD")
                  ) {
                    return (
                      <For each={overdueTasks$.data}>
                        {(item$) =>
                          item$.due.get().format("YY, MM, DD") ===
                          value$.get().format("YY, MM, DD") ? (
                            <Item item={item$} />
                          ) : (
                            <></>
                          )
                        }
                      </For>
                    );
                  } else if (
                    value$.get().format("YY, MM, DD") >
                    dayjs().format("YY, MM, DD")
                  ) {
                    return (
                      <For each={upcomingTasks$.data}>
                        {(item$) =>
                          item$.due.get().format("YY, MM, DD") ===
                          value$.get().format("YY, MM, DD") ? (
                            <Item item={item$} />
                          ) : (
                            <></>
                          )
                        }
                      </For>
                    );
                  }
                  // return <Text>Delete This Later</Text>;
                }}
              </Memo>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
          >
            <View style={styles.btn}>
              <Text style={styles.btnText}>Schedule</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
});

const Item = ({ item }: any) => {
  return <Text>{item.title.get()}</Text>;
};

export default Example;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
  },
  header: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
  },
  picker: {
    flex: 1,
    maxHeight: 74,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#999999",
    marginBottom: 12,
  },
  footer: {
    marginTop: "auto",
    paddingHorizontal: 16,
  },
  /** Item */
  item: {
    flex: 1,
    height: 50,
    marginHorizontal: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#e3e3e3",
    flexDirection: "column",
    alignItems: "center",
  },
  itemRow: {
    width: width,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  itemWeekday: {
    fontSize: 13,
    fontWeight: "500",
    color: "#737373",
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  /** Placeholder */
  placeholder: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: 400,
    marginTop: 0,
    padding: 0,
    backgroundColor: "transparent",
  },
  placeholderInset: {
    borderWidth: 4,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    borderRadius: 9,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Button */
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#007aff",
    borderColor: "#007aff",
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },
});
