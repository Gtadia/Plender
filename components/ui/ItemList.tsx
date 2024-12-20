import {
  LayoutAnimation,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { For, Memo, Show, useObservable } from "@legendapp/state/react";

import Entypo from "@expo/vector-icons/Entypo";

import { constants, fontSizes } from "../../constants/style";
import ItemCard from "../../components/ui/ItemCard";

var { width } = Dimensions.get("window");

export default function ItemList({ task }: any) {
  const show$ = useObservable(true);
  const onPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    show$.set((prev) => !prev);
  };

  if (task.data.get().length == 0) {
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
          <Memo>{() => task.title.get()}</Memo>
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
        {() => (
          <View
            style={[
              styles.item,
              !show$.get() && { height: "auto" },
              { alignItems: "center" },
            ]}
            // activeOpacity={1}
          >
            <Memo>
              {() => (
                <For each={task.data}>
                  {(item$) => <ItemCard item={item$} />}
                </For>
              )}
            </Memo>
          </View>
        )}
      </Show>
    </>
  );
}

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
