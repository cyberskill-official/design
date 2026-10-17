**Form + FormField** — named-field collection + bilingual error summary; optional controller: `rules` validate on submit, `name`d FormFields auto-wire value/onChange + per-field errors. Dotted names work with field arrays (e.g. `teammates.0.name`).

```jsx
<Form rules={{email:["required", v=>/.+@.+/.test(v)?null:"Enter a valid email."]}} onSubmit={save}>
  <FormField label="Work email" required name="email"><TextField label="Work email"/></FormField>
  <FormField label="Đồng ý" name="agree" valueProp="checked"><Checkbox label="Đồng ý điều khoản"/></FormField>
  <Button type="submit">Send</Button>
</Form>
```

Manual mode unchanged: omit `rules`/`name`, pass `errors={{email:"…"}}` yourself.

Use `valueProp="checked"` for Checkbox/Switch and `valueProp="pressed"` for
Toggle. Both receive `false` when their controller value is unset. The child's
change callback remains an observer, and the controller stores the boolean.

```jsx
<FormField label="Formatting" name="bold" valueProp="pressed">
  <Toggle>Bold</Toggle>
</FormField>
```

**asyncRules:** optional map of field name → async `(value, values) => message|null`. Runs after sync `rules` pass; Form emits `is-pending` + `aria-busy`, disables native fields through a fieldset, and refuses submission re-entry until validation and the returned `onSubmit` promise finish. Controllers can also read `pending` from Form context. Custom non-native interactive content must respect that context separately.

Return the save promise from `onSubmit` or `FormWizard.onComplete` so pending
lasts through the save. A rejected callback displays its message in the error
summary and releases the lock for retry. A new attempt clears that submission
error. The callback receives the values captured for that attempt; changes made
after it starts do not alter its payload. Wizard navigation is disabled while
completion is pending, and its native fields are disabled. Existing per-control
disabled settings remain intact after completion. These controls do not provide
server-side idempotency.

Unmounting Form invalidates pending validation: later validators and the save
callback are not started by that abandoned attempt. Already-running validators
or save requests are not aborted; callers own cancellation of that external work.

**FormFieldArray** — manage an array of row objects under `name` on the surrounding Form. Children render-prop: `({ index, item, remove, path })`.

Array mutations use current controller state, including batched removal calls.
`remove` targets its rendered row occurrence (even for duplicate object references) and does nothing if that item has since been
removed or replaced. Minimum/maximum bounds are checked against current length.
Row child identity survives array add/remove and dotted field edits, including
duplicate references. Keys are internal metadata, not submitted fields. Replacing
the whole array establishes new row identities.
Use the latest render callbacks after editing/replacing items; these callbacks
are not persistent row identifiers.

```jsx
<Form initialValues={{teammates:[{name:""}]}} onSubmit={save}>
  <FormFieldArray name="teammates" label="Teammates" min={1} max={5} addLabel="Add person">
    {({ index, remove, path }) => (
      <>
        <FormField label={`Name ${index+1}`} name={path("name")}><TextField label="Name"/></FormField>
        <Button type="button" variant="ghost" size="sm" onClick={remove}>Remove</Button>
      </>
    )}
  </FormFieldArray>
  <Button type="submit">Save</Button>
</Form>
```

**FormWizard** — multi-step controller (no nested `<form>`). Each step may declare `rules` + `render()`. Finish calls `onComplete(values)`.

```jsx
<FormWizard
  initialValues={{email:"",wish:""}}
  onComplete={save}
  steps={[
    {id:"contact", title:"Contact", rules:{email:"required"},
     render:()=><FormField label="Email" required name="email"><TextField label="Email"/></FormField>},
    {id:"wish", title:"Wish", rules:{wish:"required"},
     render:()=><FormField label="Wish" required name="wish"><TextField label="Wish"/></FormField>},
  ]}
/>
```

The pure `getPath` / `setPath` helpers support dotted paths (including numeric array segments) without requiring React context. `FormFieldArray` requires a surrounding Form or FormWizard context.

Native Reset buttons and form.reset() restore the mount-time initialValues seed,
clear internal validation/submission errors and invalidate pending validation.
An onReset handler can preventDefault to cancel both controller and native reset.
External errors remain caller-owned. Already-started save requests are not aborted;
callers own cancellation. Changing initialValues after mount does not replace the
seed; remount the Form for a different record. Plain native fields keep their native
reset behavior; arbitrary custom controls outside FormField own their reset logic.

Successful FormFieldArray add/remove operations invalidate internal validation
errors at the array path and its descendants, atomically with the value change.
The next validation run computes errors for the new indices. Unrelated errors,
caller-supplied errors, and errors after a blocked/no-op operation are preserved.

FormField error/hint and FormFieldArray label preserve numeric `0`. An explicit zero error takes precedence over the hint and context error and applies error styling. Empty error content retains the existing hint fallback.

Keyboard: Form uses native submission/reset controls and prevents submission while pending. FormField inherits its child’s keyboard behavior. FormFieldArray’s Add button and FormWizard navigation are native buttons; the caller provides any row-removal control. Custom non-native controls must respect pending context.

Localization: Each component’s own EN/VI defaults follow its explicit `lang` or inherited DOM language scope. An explicit Form/FormWizard `lang` does not automatically translate nested caller content or set every child’s locale. Labels, rule messages and step content remain caller-owned.

Source evidence: `Form.jsx` and `Form.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
