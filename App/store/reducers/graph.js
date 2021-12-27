import { UPDATE_GRAPH } from "../actions/graph";

const initialState = {
  graph: "Variable-1",
};

const graphReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_GRAPH:
      return { graph: action.graph };
    default:
      return state;
  }
};

export default graphReducer;
