import { Form as BaseForm } from '@base-ui/react/form';
import { cx } from '../utils/cx';

// Same shape as Base UI's Form.Values, so typed `onFormSubmit` handlers are accepted.
type Values = Record<string, any>;

export type FormProps<V extends Values = Values> = Omit<BaseForm.Props<V>, 'className'> & { className?: string };

/**
 * A form that validates its `Field`s on submit and focuses the first invalid one.
 * `errors` maps a field `name` to a server message (`{ email: 'Already registered.' }`); it shows under that field and clears when the value changes.
 * `onFormSubmit` receives the values as an object; the native `onSubmit` still works for form libraries.
 */
export function Form<V extends Values = Values>({ className, ...props }: FormProps<V>) {
  return <BaseForm<V> {...props} className={cx('cs-form', className)} />;
}
