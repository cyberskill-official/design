import type { RootTargetProps } from "../_utils/target-props";
import type * as React from "react";
import type { ReactNode } from "react";

/** Click-or-drag file dropzone. Calls onFiles with the selected/dropped File[]. */
export interface FileUploadProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLDivElement>;
  title?: ReactNode;
  hint?: ReactNode;
  accept?: string;
  /** Default false: emit only the first selected/dropped file. True preserves all files. */
  multiple?: boolean;
  onFiles?: (files: File[]) => void;
  icon?: ReactNode;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
  /** Native input control; while component control is mounted. Separate from ref's primary target. */
  controlRef?: React.Ref<HTMLInputElement>;
}
export const FileUpload: React.ForwardRefExoticComponent<React.PropsWithoutRef<FileUploadProps> & React.RefAttributes<HTMLDivElement>>;
