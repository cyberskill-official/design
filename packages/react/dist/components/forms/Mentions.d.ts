/** Textarea with @user suggestions (APG editable combobox / listbox). */
export interface MentionsProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Usernames offered after "@". */
  users: string[];
  placeholder?: string;
  rows?: number;
  lang?: string;
  className?: string;
}
export const Mentions: React.ForwardRefExoticComponent<
  MentionsProps & React.RefAttributes<HTMLElement>
>;
