import { observable } from "@legendapp/state";
import { fonts } from '../constants/types';

export const Tags$ = observable({
  list: { // `value` ==> `id`
    // WARNING: id == 0 DOES NOT WORK with home.tsx's TagsView
    1: {label: 'This is a labe', color: 'black', value: 1},
    2: {label: 'bro', color: 'red', value: 2},
    3: {label: 'what', color: 'blue', value: 3}
  },
  addToList: (id: number, tagItem: { label: string, color: string }) => {
    Tags$.list.set((prev) => ({
      ...prev,
      [id]: {...tagItem, value: id}, // Add/Update the tag with the provided ID
    }));
  }
})


export const colorTheme$ = observable({
  colorTheme: 'catuppcin-latte',  // default theme
  colors: {
    primary: 'rgb(10, 132, 255)',
    secondary: 'rgb(255, 69, 58)',
    accent: 'rgb(255, 69, 58)',
    background: 'rgb(1, 1, 1)', // light/dark
    card: 'rgb(18, 18, 18)',  // pop up menu?
    text: 'rgb(229, 229, 231)',
    subtext: 'rgb(255, 255, 255)',
    border: 'rgb(39, 39, 41)',
    notification: 'rgb(255, 69, 58)',
    // Add more colors as needed
  },
  fonts,

});