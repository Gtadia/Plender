import { observable, Observable, observe } from "@legendapp/state";
import dayjs from "dayjs";

export const theme = observable({
  darkMode: false,
  colorTheme: "catppuccin",
  colorScheme: "latte"
});