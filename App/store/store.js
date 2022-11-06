import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import machineReducer from "./reducers/machine";
// import userReducer from "./reducers/user";
import languageReducer from "./slices/language";
import graphReducer from "./slices/graph";

const rootReducer = combineReducers({
  // machine: machineReducer,
  // user: userReducer,
  language: languageReducer,
  graph: graphReducer,
});

// Redux persist settings
// Persist the language & graph store
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["language", "graph"],
};

// Apply Redux Persist settings to root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
