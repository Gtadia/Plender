import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { AutoSizeText, ResizeTextMode } from 'react-native-auto-size-text';
import { taskTags$ } from '../../../db/LegendApp';
import { observable } from '@legendapp/state';

import { MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { observer, useObservable } from '@legendapp/state/react';
import Modal from '../../Modal';
import CreateNewTag from './CreateNewTag';

var { width } = Dimensions.get('window');

const AddTags = observer(({isModalOpen}: any) => {
  const isCreateModalOpen$ = useObservable(false);

  const renderItem = (item: any) => {
    return (
      <View style={dropdownStyles.item}>
        <Text style={dropdownStyles.selectedTextStyle}>{item.label}</Text>
        <AntDesign style={dropdownStyles.icon} color="black" name="Safety" size={20} />
      </View>
    );
  };

  return (
    <View style={{width: width - (16 * 2), height: 'auto', padding: 16, borderRadius: 16, backgroundColor: 'white'}}>
      <AutoSizeText
        fontSize={32}
        numberOfLines={1}
        mode={ResizeTextMode.max_lines}>
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
          placeholder="Select item"
          value={taskTags$.selected.get()}
          search
          searchPlaceholder="Search..."
          onChange={item => {
            console.log(item)
            taskTags$.selected.set(item);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={dropdownStyles.icon}
              color="black"
              name="Safety"
              size={20}
            />
          )}
          renderItem={renderItem}
          renderSelectedItem={(item, unSelect) => (
            <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
              <View style={dropdownStyles.selectedStyle}>
                <Text style={dropdownStyles.textSelectedStyle}>{item.label}</Text>
                <AntDesign color="black" name="delete" size={17} />
              </View>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          style={{}}
          onPress={() => isCreateModalOpen$.set(true)}
          >
          <Text>
            Create New Tag
          </Text>
        </TouchableOpacity>
      </View>

      {/* TODO — Add selected tags to tagsSelected */}
      {/* TODO — Submit button clears tagsSelected array */}
      <TouchableOpacity
        style={{width: '100%', height: 'auto', borderRadius: 15, backgroundColor: 'red', padding: 16, justifyContent: 'center', alignItems: 'center'}}
        onPress={() => isModalOpen.set(false)}
        >
        <AutoSizeText
          fontSize={24}
          numberOfLines={1}
          mode={ResizeTextMode.max_lines}
          >
            Add Tags
        </AutoSizeText>
    </TouchableOpacity>

    <Modal
      isOpen={isCreateModalOpen$.get()}
      withInput
      >
        <CreateNewTag modalToggle={isCreateModalOpen$}/>
    </Modal>
  </View>
  )
})

export default AddTags

const dropdownStyles = StyleSheet.create({
  container: { padding: 16 },
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
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
    fontSize: 16,
  },

})