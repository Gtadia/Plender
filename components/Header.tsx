import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { openAddMenu$ } from "../db/LegendApp";
import dayjs from "dayjs";
import { constants, fontSizes } from "../constants/style";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";

const buttonSize = 30;

const Header = ({ name, toggleNav, enableRightBtn, setNewDueDate }: any) => {
  return (
    <View style={styles.header}>
      <View style={styles.flexRow}>
        <TouchableOpacity
          onPress={toggleNav}
          style={{ paddingRight: constants.regular }}
        >
          <Entypo name="menu" size={fontSizes.titlePlus} color="black" />
        </TouchableOpacity>
        <AutoSizeText
          fontSize={fontSizes.titlePlus}
          numberOfLines={1}
          mode={ResizeTextMode.max_lines}
          style={{ fontWeight: "900" }}
        >
          {name}
        </AutoSizeText>
      </View>

      {enableRightBtn && (
        <View style={styles.flexRow}>
          <TouchableOpacity
            onPress={() => {
              openAddMenu$.set((prev) => !prev);
              setNewDueDate.set(dayjs());
            }}
          >
            <FontAwesome
              name="plus-circle"
              size={buttonSize + 2}
              color="black"
            />
          </TouchableOpacity>

          <TouchableOpacity style={{ paddingLeft: constants.regular15 }}>
            <FontAwesome6 name="clock" size={buttonSize} color="black" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: constants.regularPlus,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
