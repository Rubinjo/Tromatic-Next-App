export const UPDATE_GRAPH = "UPDATE_GRAPH";

export const updateGraph = (graph) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_GRAPH,
      graph: graph,
    });
  };
};
