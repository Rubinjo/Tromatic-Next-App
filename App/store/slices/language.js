import { createSlice } from "@reduxjs/toolkit";

import i18n from "../../utils/i18n";

export const languageSlice = createSlice({
  name: "language",
  initialState: {
    language: i18n.locale,
  },
  reducers: {
    updateLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const { updateLanguage } = languageSlice.actions;

export default languageSlice.reducer;
