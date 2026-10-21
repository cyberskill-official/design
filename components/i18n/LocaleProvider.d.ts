import type { ReactNode, ReactElement } from "react";
/** Namespace → locale tag → string key. Readonly inputs are copied into immutable snapshots. */
export type LocaleMessages = Readonly<Record<string, Readonly<Record<string, Readonly<Record<string, string>>>>>>;
export type MessageResolver = (key: string) => string;
export interface LocaleProviderProps {
  messages: LocaleMessages;
  children?: ReactNode;
}
/** Context-only provider. It does not add a DOM root, select a language, alter formatters, or install RTL behavior. */
export function LocaleProvider(props: LocaleProviderProps): ReactElement;
/** Application copy requires an explicit language; unknown keys return their own key after EN/VI fallback. */
export function useMessages(namespace: string, lang: string): MessageResolver;
