import { UPDATE_LANGUAGE } from "../actions/language";

import i18n from "../../utils/i18n";

const initialState = {
  language: i18n.locale,
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
