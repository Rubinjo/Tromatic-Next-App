export const UPDATE_LANGUAGE = "UPDATE_LANGUAGE";

export const updateLanguage = (newLanguage) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_LANGUAGE,
      language: newLanguage,
    });
  };
};
