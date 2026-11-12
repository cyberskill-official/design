import { Input as BaseInput } from '@base-ui/react/input';
import { X } from '@phosphor-icons/react';
import { useState } from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../utils/use-controllable';
import { Field, type FieldProps, type InputProps } from './Field';

/** Why a tag was not added: already listed (ignoring case), refused by `validate`, or the list is at `max`. */
export type TagRejectReason = 'duplicate' | 'invalid' | 'max';

export type TagInputProps = Omit<InputProps, 'value' | 'defaultValue' | 'onValueChange' | 'startAdornment' | 'endAdornment' | 'type' | 'name' | 'required'> &
  Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel' | 'required'> & {
    /** The tags, controlled. */
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
    /** Called for each typed or pasted tag that is not added. The text stays in the input so it can be fixed. */
    onReject?: (tag: string, reason: TagRejectReason) => void;
    /** Most tags the list may hold. */
    max?: number;
    /** Return false to refuse a tag, e.g. one that is not an email address. */
    validate?: (tag: string) => boolean;
    /** Submits each tag with a native form (one hidden input per tag) under this name. */
    name?: string;
    /** Accessible name of each chip's remove button. Pass Vietnamese text in Vietnamese UIs. */
    removeLabel?: (tag: string) => string;
    /** Class for the field wrapper; `className` goes to the box. */
    fieldClassName?: string;
  };

const NONE: string[] = [];
const SEPARATORS = /[,\r\n]/;
const separators = (text: string) => text.split(SEPARATORS).length;
const sameTag = (a: string, b: string) => a.normalize().toLowerCase() === b.normalize().toLowerCase();

/** Free-text chips (emails, keywords). Enter or a comma adds the text, a paste with commas or new lines adds several, Backspace in the empty input removes the last chip. */
export function TagInput({
  label, hideLabel, description, error, optionalLabel, required, disabled, name, value, defaultValue, onValueChange, onReject, max, validate,
  removeLabel = tag => `Remove ${tag}`, size = 'md', placeholder, className, fieldClassName, onKeyDown, onPaste, onBlur, ...inputProps
}: TagInputProps) {
  const [tags, setUncontrolled] = useControllableState(value, defaultValue ?? NONE, NONE);
  const [draft, setDraft] = useState('');
  const change = (next: string[]) => {
    setUncontrolled(next);
    onValueChange?.(next);
  };

  /** Adds each non-empty part; returns the refused ones, joined, to leave in the input. */
  function add(parts: string[]) {
    const next = [...tags];
    const refused: string[] = [];
    for (const part of parts) {
      const tag = part.trim();
      if (!tag) continue;
      const reason: TagRejectReason | null = validate && !validate(tag) ? 'invalid' : next.some(t => sameTag(t, tag)) ? 'duplicate' : max != null && next.length >= max ? 'max' : null;
      if (reason) {
        refused.push(tag);
        onReject?.(tag, reason);
      } else next.push(tag);
    }
    if (next.length > tags.length) change(next);
    return refused.join(', ');
  }

  const focusInput = (from: Element) => from.closest('.cs-tag-input')?.querySelector('input')?.focus();

  return (
    <Field label={label} hideLabel={hideLabel} description={description} error={error} optionalLabel={optionalLabel} required={required} disabled={disabled} className={fieldClassName}>
      <div
        data-size={size}
        data-disabled={disabled || undefined}
        className={cx('cs-input-group', 'cs-multi-select', 'cs-tag-input', className)}
        // a click on the box (between or beside chips) types into it, like a text field
        onClick={event => !(event.target as Element).closest('button, input') && focusInput(event.currentTarget)}
      >
        <div className="cs-multi-select-chips">
          {tags.map((tag, i) => (
            <span key={tag} className="cs-multi-select-chip">
              <span className="cs-multi-select-chip-label">{tag}</span>
              <button
                type="button"
                className="cs-multi-select-chip-remove"
                aria-label={removeLabel(tag)}
                disabled={disabled}
                data-disabled={disabled || undefined}
                onClick={event => {
                  focusInput(event.currentTarget); // the button goes away with its chip: keep focus in the field
                  change(tags.filter((_, n) => n !== i));
                }}
              >
                <X aria-hidden="true" />
              </button>
            </span>
          ))}
          <BaseInput
            {...inputProps}
            aria-required={required || undefined} // not `required`: the empty text box must not block a form that has tags
            placeholder={tags.length ? undefined : placeholder}
            className="cs-multi-select-input"
            value={draft}
            onValueChange={text => {
              // a typed comma (also from phone keyboards that send no key events) adds what comes before it; refused
              // tags waiting in the input (they hold commas) are not tried again on every keystroke
              if (separators(text) <= separators(draft)) return setDraft(text);
              const parts = text.split(SEPARATORS);
              const rest = parts.pop()!;
              setDraft([add(parts), rest].filter(Boolean).join(', '));
            }}
            onKeyDown={event => {
              onKeyDown?.(event);
              if (event.defaultPrevented || event.nativeEvent.isComposing) return; // Vietnamese IME: Enter confirms the word
              if (event.key === 'Enter' && draft.trim()) {
                event.preventDefault(); // adds the tag instead of submitting the form
                setDraft(add(draft.split(SEPARATORS)));
              } else if (event.key === 'Backspace' && !draft && tags.length && !disabled) change(tags.slice(0, -1));
            }}
            onBlur={event => {
              onBlur?.(event);
              if (draft.trim()) setDraft(add(draft.split(SEPARATORS))); // leaving the field (e.g. clicking Submit) keeps what was typed
            }}
            onPaste={event => {
              onPaste?.(event);
              const text = event.clipboardData.getData('text');
              if (event.defaultPrevented || !SEPARATORS.test(text)) return;
              event.preventDefault();
              const input = event.currentTarget;
              const whole = input.value.slice(0, input.selectionStart ?? input.value.length) + text + input.value.slice(input.selectionEnd ?? input.value.length);
              setDraft(add(whole.split(SEPARATORS)));
            }}
          />
        </div>
      </div>
      {name && tags.map(tag => <input key={tag} type="hidden" name={name} value={tag} disabled={disabled} />)}
    </Field>
  );
}
