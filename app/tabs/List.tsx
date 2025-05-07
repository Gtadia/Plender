import {
  LayoutAnimation,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  For,
  Memo,
  observer,
  Show,
  useObservable,
} from "@legendapp/state/react";
import {
  dateToday$,
  overdueTasks$,
  todayTasks$,
  upcomingTasks$,
} from "../../db/LegendApp";

import Entypo from "@expo/vector-icons/Entypo";

import { constants, fontSizes } from "../../constants/style";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import { ScrollView } from "react-native-gesture-handler";
import CurrentItemFooter from "../../components/ui/CurrentItemFooter";
import ItemLister from "../../components/ui/ItemLister";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import dayjs from "dayjs";
import { getEvent } from "../../utils/database";

var { width } = Dimensions.get("window");

/**
 * Returns events due today, overdue, or upcoming from SQLite database
 * @param db
 * @returns
 */
const getToday = async (db: SQLiteDatabase, dateType: string = "today") => {
  // todo — Create an observable to store today/past/future events
  // todo — Only use observables to get events, set a different page to update the observables.
  const filter = {
    due_or_repeated_dates: { start: dayjs().format("MM-DD-YYYY") },
  };
  if (dateType == "upcoming") {
    // todo — use SQLite's ability to only pull x number of events
    // filter.due_or_repeated_dates = {start: }
  }

  const result = await getEvent(db, filter);

  if (!result) {
    return [];
  }
  console.log(`List: ${result.length}`);
  return result;
};

/**
 * Returns overdue events from SQLite database
 * @param db
 * @returns
 */
const getOverdue = async (db: SQLiteDatabase) => {
  const filter = {
    due_or_repeated_dates: { start: dayjs().format("MM-DD-YYYY") },
  };
  const result = await getEvent(db, filter);

  if (!result) {
    return [];
  }
  console.log(`List: ${result}`);
  return result;
};

/**
 * Returns upcoming events from SQLite database
 * @param db
 * @returns
 */
const getUpcoming = async (db: SQLiteDatabase) => {
  const filter = {
    due_or_repeated_dates: { start: dayjs().format("MM-DD-YYYY") },
  };
  const result = await getEvent(db, filter);

  if (!result) {
    return [];
  }
  console.log(`List: ${result}`);
  return result;
};

const List = observer(() => {
  const db = useSQLiteContext();

  return (
    <>
      <View style={{ flex: 1 }}>
        <ScrollView style={[styles.container]}>
          <View style={{ alignItems: "center", padding: constants.regular }}>
            <Memo>
              {() => (
                <AutoSizeText
                  fontSize={fontSizes.big}
                  numberOfLines={1}
                  mode={ResizeTextMode.max_lines}
                  style={{ fontWeight: "bold" }}
                >
                  {dateToday$.get().format("ddd, MMM DD")}
                </AutoSizeText>
              )}
            </Memo>
          </View>

          <ItemList task={getToday(db)} title={"Today"} />
          <ItemList task={getToday(db)} title={"Overdue"} />
          <ItemList task={getToday(db)} title={"Upcoming"} />

          {/* TODO — Come up with a better solution later... */}
          {/* <View style={styles.taskFooterDimension} /> */}
        </ScrollView>
      </View>

      <CurrentItemFooter />
    </>
  );
});

function ItemList(props: { task: Event[]; title: string }) {
  const show$ = useObservable(true);
  const onPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    show$.set((prev) => !prev);
  };

  if (props.task.length == 0) {
    return;
  }

  return (
    <>
      <TouchableOpacity
        style={[
          styles.flexRow,
          { paddingLeft: 15, alignSelf: "flex-start", alignItems: "center" },
        ]}
        onPress={onPress}
      >
        <Text
          style={{
            fontSize: fontSizes.big,
            fontWeight: "bold",
            paddingRight: constants.small,
          }}
        >
          {/* <Memo>{() => task.title.get()}</Memo> */}
          {props.title}
        </Text>

        <Memo>
          {() =>
            show$.get() ? (
              <Entypo name="chevron-down" size={fontSizes.big} color="black" />
            ) : (
              <Entypo name="chevron-up" size={fontSizes.big} color="black" />
            )
          }
        </Memo>
      </TouchableOpacity>

      <Show if={show$} else={<></>}>
        {() => <ItemLister task={props.task} />}
      </Show>
    </>
  );
}

export default List;

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
