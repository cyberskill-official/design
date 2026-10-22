import type * as React from "react";
/** Internal composition preserves object/callback refs and React-version detach semantics. */
export function useComposedRefs<T extends Element>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> | undefined;
