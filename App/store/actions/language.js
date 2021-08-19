export const UPDATE_LANGUAGE = "UPDATE_LANGUAGE";

export const updateLanguage = (language) => {
  return async (dispatch) => {
    dispatch({
      language: language,
    });
  };
};
