import { UPDATE_LANGUAGE } from "../actions/language";

const initialState = {
  language: "english",
};

const languageReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LANGUAGE:
      return { language: action.language };
    default:
      return state;
  }
};

export default languageReducer;
