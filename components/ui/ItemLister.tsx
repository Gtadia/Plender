import { For, Memo } from "@legendapp/state/react";
import { View, StyleSheet, Dimensions } from "react-native";
import ItemCard from "./ItemCard";

var { width } = Dimensions.get("window");

const ItemLister = ({ task }: any, filter = null) => {
  return (
    <View
      style={[styles.item, { height: "auto" }, { alignItems: "center" }]}
      // activeOpacity={1}
    >
      <Memo>
        {() => (
          <For each={task.data}>{(item$) => <ItemCard item={item$} />}</For>
        )}
      </Memo>
    </View>
  );
};

export default ItemLister;

const styles = StyleSheet.create({
  item: {
    width: "100%",
    paddingHorizontal: 20,
    overflow: "hidden",
    paddingVertical: 10,
    marginBottom: 5,
  },
});
