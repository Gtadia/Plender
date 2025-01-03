import { observable } from "@legendapp/state";

export const Tags$ = observable({
  list: { // `value` ==> `id`
    // WARNING: id == 0 DOES NOT WORK with home.tsx's TagsView
    1: {label: 'This is a labe', color: 'black', value: 1},
    2: {label: 'bro', color: 'red', value: 2},
    3: {label: 'what', color: 'blue', value: 3}
  },
  searchById: (id: number) => {
    return Tags$.list[id]
  },
  addToList: (id: number, tagItem: { label: string, color: string }) => {
    Tags$.list.set((prev) => ({
      ...prev,
      [id]: {...tagItem, value: id}, // Add/Update the tag with the provided ID
    }));
  }
})
