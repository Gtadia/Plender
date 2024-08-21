import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import { taskCategory$, taskTags$ } from "../../../db/LegendApp";

import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { observer, useObservable } from "@legendapp/state/react";
import Modal from "../../Modal";
import { appearance$ } from "../../../db/Settings";
import { constants, fontSizes, modalConst } from "../../../constants/style";
import CreateNewCategory from "./CreateNewCategory";

var { width } = Dimensions.get("window");

const AddCategory = observer(({ modalToggle, category }: any) => {
  const isCreateModalOpen$ = useObservable(false);

  const renderItem = (item: any) => {
    return (
      <View style={styles.item}>
        <Text style={[styles.selectedTextStyle, { color: item.color }]}>
          {item.label}
        </Text>
        {category.get() === item.value ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 2,
              borderRadius: 4,
              width: 20,
              height: 20,
            }}
          >
            <AntDesign name="check" size={20} color="green" />
          </View>
        ) : (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 2,
              borderRadius: 4,
              width: 20,
              height: 20,
            }}
          ></View>
        )}
      </View>
    );
  };

  return (
    <View
      style={{
        width: width - modalConst.paddingScreen,
        height: "auto",
        paddingHorizontal: modalConst.largePadding,
        paddingVertical: modalConst.largerPadding,
        borderRadius: constants.regularRadius,
        backgroundColor: appearance$.primaryDark.get(),
      }}
    >
      <AutoSizeText
        fontSize={fontSizes.title}
        numberOfLines={1}
        mode={ResizeTextMode.max_lines}
        style={{ color: appearance$.primaryWhite.get(), fontWeight: "bold" }}
      >
        Category
      </AutoSizeText>

      <View style={styles.container}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={taskCategory$.list.get()}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Category"
          searchPlaceholder="Search..."
          value={category.get()}
          onChange={(item) => {
            category.set(taskCategory$.list.get().indexOf(item));
          }}
          renderItem={renderItem}
        />
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 14,
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: appearance$.accentColor.get(),
            alignSelf: "flex-start",
            marginTop: 20,
          }}
          onPress={() => isCreateModalOpen$.set(true)}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: fontSizes.small,
            }}
          >
            Create Category
          </Text>
        </TouchableOpacity>
      </View>

      {/* TODO — Add selected tags to tagsSelected */}
      {/* TODO — Submit button clears tagsSelected array */}
      <TouchableOpacity
        style={{
          width: "100%",
          height: "auto",
          borderRadius: 15,
          backgroundColor: "red",
          padding: 16,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => modalToggle.set(false)}
      >
        <AutoSizeText
          fontSize={24}
          numberOfLines={1}
          mode={ResizeTextMode.max_lines}
          style={{ color: "white", fontWeight: "bold" }}
        >
          Add
        </AutoSizeText>
      </TouchableOpacity>

      <Modal isOpen={isCreateModalOpen$.get()} withInput>
        <CreateNewCategory modalToggle={isCreateModalOpen$} />
      </Modal>
    </View>
  );
});

export default AddCategory;

const styles = StyleSheet.create({
  container: { paddingVertical: modalConst.paddingBetween1 },
  dropdown: {
    height: 50,
    backgroundColor: appearance$.primaryWhite.get(),
    borderRadius: constants.smallPlusRadius,
    paddingHorizontal: constants.smallPlusPadding,
    width: "100%",
    elevation: 2,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: fontSizes.big,
    fontWeight: "bold",
  },
  selectedTextStyle: {
    fontSize: fontSizes.small,
    fontWeight: "bold",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
});
