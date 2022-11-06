import { createSlice } from "@reduxjs/toolkit";

export const graphSlice = createSlice({
  name: "graph",
  initialState: {
    graph: "Variable-1",
  },
  reducers: {
    updateGraph: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { updateGraph } = graphSlice.actions;

export default graphSlice.reducer;
