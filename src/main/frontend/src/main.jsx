import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./stores/store";

import {
  Cart,
  Home,
  Login,
  MyPage,
  Order,
  Prev,
  BrightnessControl,
  Register,
  Regular,
  SignUp,
  SignUpMobile,
  Stock,
  Testdb,
} from './routes/page';
import Root from "./routes/root";

//주석 해제 금지 !!   --- 한준
// import './routes/prev/Brightness.css'
// import BrightnessControl from "./component/BrightnessControl";
         
const router = createBrowserRouter([
  {
    path: "/",
    element: <Prev />
  },
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/order",
        element: <Order />,
      },
      {
        path: "/stock",
        element: <Stock />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/regular",
        element: <Regular />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/mypage",
        element: <MyPage />,
      },
      {
        path: "/testdb",
        element: <Testdb />,
      },
    ]
  },
  {
    path: "/signup/*",
    element: <SignUpMobile />,
  },
]);


//BrightnessControl 주석 해제 금지 !!
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrightnessControl />
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);