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

export const Categories$ = observable({
  list: {
    1: { label: 'No Category', value: 1, color: 'gray' },
    2: { label: 'Item 2', value: 2, color: 'red' },
    3: { label: 'Item 3', value: 3, color: 'orange' },
    4: { label: 'Item 4', value: 4, color: 'yellow' },
    5: { label: 'Item 5', value: 5, color: 'green' },
    6: { label: 'Item 6', value: 6, color: 'blue' },
    7: { label: 'Item 7', value: 7, color: 'pink' },
    8: { label: 'Item 8', value: 8, color: 'purple' },
  },
  searchById: (id: number) => {
    return Categories$.list[id]
  },
  addToList: (id: number, tagItem: { label: string, color: string }) => {
    Categories$.list.set((prev) => ({
      ...prev,
      [id]: {...tagItem, value: id}, // Add/Update the tag with the provided ID
    }));
  }
})