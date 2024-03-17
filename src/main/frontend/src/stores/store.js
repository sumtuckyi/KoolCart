import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import dataSlice from "../redux/dataSlice";
import userSlice from "../redux/userSlice";
import cartSlice from "../redux/cartSlice";
import sortSlice from "../redux/sortSlice";
import sortOrderSlice from "../redux/sortOrderSlice";

// const persistConfig = {
//   key: "root",
//   storage,
// };

const dataPersistConfig = {
  key: "data",
  storage,
};

const userPersistConfig = {
  key: "user",
  storage,
};

const CartPersistConfig = {
  key: "cart",
  storage,
};

const SortPersistConfig = {
  key: "sort",
  storage,
};

const SortOrderPersistConfig = {
  key: "sortOrder",
  storage,
};

const persistedReducer = persistReducer(dataPersistConfig, dataSlice);
const persistedUserReducer = persistReducer(userPersistConfig, userSlice);
const persistedCartReducer = persistReducer(CartPersistConfig, cartSlice);
const persistedSortReducer = persistReducer(SortPersistConfig, sortSlice);
const persistedSortOrderReducer = persistReducer(
  SortOrderPersistConfig,
  sortOrderSlice
);

export const store = configureStore({
  reducer: {
    data: persistedReducer,
    user: persistedUserReducer,
    cart: persistedCartReducer,
    sort: persistedSortReducer,
    sortOrder: persistedSortOrderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, //직렬화 안하겠다 설정
    }),
});

export const persistor = persistStore(store);
