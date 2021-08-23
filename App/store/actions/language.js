export const UPDATE_LANGUAGE = "UPDATE_LANGUAGE";

export const updateLanguage = (language) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_LANGUAGE,
      language: language,
    });
  };
};
