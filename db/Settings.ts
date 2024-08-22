import { useObservable } from "@legendapp/state/react";

export const appearance$ = useObservable({
  darkMode: false,
  primaryDark: () => (appearance$.darkMode ? 'black' : 'white'),
  primaryWhite: () => (appearance$.darkMode? 'white': 'black'),
  accentColor: 'red',
})

export const general$ = useObservable({
  hour24Format: false,
  hideSeconds: true,
  homeView: {
    list: ["List", "Calendar"],
    selected: "List"
  },
  startOfWeek: {
    list: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    selected: 'Sunday'
  },
})

export const notification$ = useObservable({

})

export const sync$ = useObservable({

})