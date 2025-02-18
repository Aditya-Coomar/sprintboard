"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";

const ReduxProviders = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProviders;
