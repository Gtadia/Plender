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
import CreateNewTag from "./CreateNewTag";

var { width } = Dimensions.get("window");

const AddCategory = observer(({ modalToggle, category }: any) => {
  const isCreateModalOpen$ = useObservable(false);

  const renderItem = (item: any) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === category.get() && (
          <AntDesign
            style={styles.icon}
            color="black"
            name="Safety"
            size={20}
          />
        )}
      </View>
    );
  };

  return (
    <View
      style={{
        width: width - 16 * 2,
        height: "auto",
        padding: 16,
        borderRadius: 16,
        backgroundColor: "white",
      }}
    >
      <AutoSizeText
        fontSize={32}
        numberOfLines={1}
        mode={ResizeTextMode.max_lines}
      >
        Tags
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
          placeholder="Select item"
          searchPlaceholder="Search..."
          value={category.get()}
          onChange={(item) => {
            console.log(taskCategory$.list.get().indexOf(item));
            category.set(taskCategory$.list.get().indexOf(item));
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color="black"
              name="Safety"
              size={20}
            />
          )}
          renderItem={renderItem}
        />
        <TouchableOpacity
          style={{}}
          onPress={() => isCreateModalOpen$.set(true)}
        >
          <Text>Create New Tag</Text>
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
        >
          Add Category
        </AutoSizeText>
      </TouchableOpacity>

      <Modal isOpen={isCreateModalOpen$.get()} withInput>
        <CreateNewTag modalToggle={isCreateModalOpen$} />
      </Modal>
    </View>
  );
});

export default AddCategory;

const styles = StyleSheet.create({
  container: { padding: 16 },
  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
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
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
