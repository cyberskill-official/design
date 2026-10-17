**RadioGroup / Radio** — single-choice radios in a labelled fieldset, controlled by `value`/`onChange`. Brand accent-color.

```jsx
<RadioGroup legend="Plan" value={plan} onChange={setPlan}
  options={[{value:"mo",label:"Monthly"},{value:"yr",label:"Annual",description:"Two months free"}]} />
```

ReactNode labels and optional content preserve numeric `0`. Optional content still omits `null`, `false` and empty strings.

The standalone Radio accepts native radio props; use the same name across a choice set.

```jsx
<Radio name="plan" value="monthly" label="Monthly"
  checked={plan === "monthly"} onChange={() => setPlan("monthly")} />
```

Keyboard: Radio and RadioGroup use native radio keyboard behavior. Group members share a name; controlled callers update `value` from `onChange`. Provide a meaningful `legend` for group context.

Localization: Visible labels and content are caller-owned; there is no built-in translation for them.

Source evidence: `RadioGroup.jsx` and `RadioGroup.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
