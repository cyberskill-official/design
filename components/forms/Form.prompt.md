**Form + FormField** — named-field collection + bilingual error summary; optional controller: `rules` validate on submit, `name`d FormFields auto-wire value/onChange + per-field errors. Dotted names work with field arrays (e.g. `teammates.0.name`).

```jsx
<Form rules={{email:["required", v=>/.+@.+/.test(v)?null:"Enter a valid email."]}} onSubmit={save}>
  <FormField label="Work email" required name="email"><TextField label="Work email"/></FormField>
  <FormField label="Đồng ý" name="agree" valueProp="checked"><Checkbox label="Đồng ý điều khoản"/></FormField>
  <Button type="submit">Send</Button>
</Form>
```

Manual mode unchanged: omit `rules`/`name`, pass `errors={{email:"…"}}` yourself.

**asyncRules:** optional map of field name → async `(value, values) => message|null`. Runs after sync `rules` pass; Form emits `is-pending` + `aria-busy`, locks controls, and refuses re-entry until the async pass finishes (FIND-015 / FIND-044). Controllers can also read `pending` from Form context.

**FormFieldArray** — manage an array of row objects under `name` on the surrounding Form. Children render-prop: `({ index, item, remove, path })`.

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

Helpers `getPath` / `setPath` support dotted paths (including numeric array segments). Must be used inside Form context (FormFieldArray) or FormWizard.
