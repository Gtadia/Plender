import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";

import AntDesign from "@expo/vector-icons/AntDesign";
import { observer, useObservable } from "@legendapp/state/react";
import Modal from "../../Modal";
import CreateNewTag from "./CreateNewTag";
import { appearance$ } from "../../../db/Settings";
import { constants, fontSizes, modalConst } from "../../../constants/style";
import { Tags$ } from "../../../utils/stateManager";
import { newEvent$, toggle$ } from "../../../utils/newEventState";
import DropDownPicker from "react-native-dropdown-picker";

var { width } = Dimensions.get("window");

const AddTags = observer(() => {
  const isCreateModalOpen$ = useObservable(false);
  const open$ = useObservable(false);

  return (
    <View
      style={{
        width: width - modalConst.paddingScreen,
        height: "auto",
        paddingHorizontal: modalConst.largePadding,
        paddingVertical: modalConst.largerPadding,
        borderRadius: constants.regular,
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
        <DropDownPicker
          open={open$.get()}
          setOpen={(item) => open$.set(item)}
          multiple={true}
          style={dropdownStyles.dropdown}
          placeholderStyle={dropdownStyles.placeholderStyle}
          // selectedTextStyle={dropdownStyles.selectedTextStyle}
          // inputSearchStyle={dropdownStyles.inputSearchStyle}
          // iconStyle={dropdownStyles.iconStyle}
          itemKey="value"
          items={Object.values(Tags$.list.get())}
          value={newEvent$.tagIDs.get()}
          setValue={(item) => newEvent$.tagIDs.set(item)}
          onChangeValue={(value) => {
            console.log(value);
          }}
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
        onPress={() => toggle$.tagModal.set(false)}
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
        <CreateNewTag modalToggle={isCreateModalOpen$} />
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
    borderRadius: constants.smallPlus,
    paddingHorizontal: constants.smallPlus,
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
