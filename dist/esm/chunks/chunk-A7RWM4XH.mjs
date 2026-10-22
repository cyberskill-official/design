"use client";
import {
  localeMessagesContext,
  makeT,
  snapshotLocaleMessages
} from "./chunk-25AOTZAM.mjs";

// components/i18n/LocaleProvider.jsx
import React from "react";
function LocaleProvider({ messages, children }) {
  const Context = localeMessagesContext();
  const parent = React.useContext(Context);
  const snapshot = React.useMemo(() => snapshotLocaleMessages(messages), [messages]);
  const value = React.useMemo(() => Object.freeze({ messages: snapshot, parent }), [snapshot, parent]);
  return /* @__PURE__ */ React.createElement(Context.Provider, { value }, children);
}
function useMessages(namespace, lang) {
  const messages = React.useContext(localeMessagesContext());
  return React.useMemo(() => makeT(namespace, lang, messages), [namespace, lang, messages]);
}

export {
  LocaleProvider,
  useMessages
};
//# sourceMappingURL=chunk-A7RWM4XH.mjs.map
