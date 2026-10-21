import React from "react";
import { localeMessagesContext, snapshotLocaleMessages, makeT } from "../_i18n/i18n.js";

/** Scoped, immutable UI-message overrides and additional namespaces. No DOM, locale selection or formatter/RTL changes. */
export function LocaleProvider({ messages, children }) {
  const Context = localeMessagesContext();
  const parent = React.useContext(Context);
  const snapshot = React.useMemo(() => snapshotLocaleMessages(messages), [messages]);
  const value = React.useMemo(() => Object.freeze({ messages: snapshot, parent }), [snapshot, parent]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

/** Resolve an application namespace with an explicit language. Existing components keep their own lang/DOM resolution. */
export function useMessages(namespace, lang) {
  const messages = React.useContext(localeMessagesContext());
  return React.useMemo(() => makeT(namespace, lang, messages), [namespace, lang, messages]);
}
