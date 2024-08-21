import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import { taskTags$ } from "../../../db/LegendApp";

import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { observer, useObservable } from "@legendapp/state/react";
import Modal from "../../Modal";
import CreateNewTag from "./CreateNewTag";
import { appearance$ } from "../../../db/Settings";
import { constants, fontSizes, modalConst } from "../../../constants/style";

var { width } = Dimensions.get("window");

const AddTags = observer(({ modalToggle, tags }: any) => {
  const isCreateModalOpen$ = useObservable(false);

  const renderItem = (item: any) => {
    return (
      <View style={dropdownStyles.item}>
        <Text style={[dropdownStyles.selectedTextStyle, { color: item.color }]}>
          {item.label}
        </Text>
        {tags.get().includes(item.value) ? (
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

  const RenderSelectedItem = ({ item, unSelect }: any) => {
    return (
      <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
        <View style={dropdownStyles.selectedStyle}>
          <Text
            style={[dropdownStyles.textSelectedStyle, { color: item.color }]}
          >
            # {item.label}
          </Text>
          <AntDesign color="black" name="close" size={17} />
        </View>
      </TouchableOpacity>
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
        Tags
      </AutoSizeText>

      <View style={dropdownStyles.container}>
        <MultiSelect
          style={dropdownStyles.dropdown}
          placeholderStyle={dropdownStyles.placeholderStyle}
          selectedTextStyle={dropdownStyles.selectedTextStyle}
          inputSearchStyle={dropdownStyles.inputSearchStyle}
          iconStyle={dropdownStyles.iconStyle}
          data={taskTags$.list.get()}
          labelField="label"
          valueField="value"
          placeholder="Select Tag(s)"
          value={tags.get()}
          search
          searchPlaceholder="Search..."
          onChange={(item) => {
            tags.set(item);
          }}
          renderItem={renderItem}
          renderSelectedItem={(item, unSelect) => (
            <RenderSelectedItem item={item} unSelect={unSelect} />
          )}
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
            Create Tag
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
          backgroundColor: appearance$.accentColor.get(),
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
        <CreateNewTag modalToggle={isCreateModalOpen$} tags={tags} />
      </Modal>
    </View>
  );
});

export default AddTags;

const dropdownStyles = StyleSheet.create({
  container: { paddingVertical: modalConst.paddingBetween1 },
  dropdown: {
    height: 50,
    backgroundColor: appearance$.primaryWhite.get(),
    borderRadius: constants.smallPlusRadius,
    paddingHorizontal: constants.smallPlusPadding,
    width: "100%",
    elevation: 2,
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
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "white",
    shadowColor: "#000",
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: fontSizes.small,
    fontWeight: "bold",
  },
});
