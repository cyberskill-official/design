**HumanReviewGate** — a human-review control for an AI-assisted workflow. Warning-bordered card with a risk label, plain-language summary, optional reviewer, and Approve / Reject.

```jsx
<HumanReviewGate
  risk="High-stakes · billing change"
  summary="Lumi proposes moving this client to the annual plan and issuing a prorated credit."
  reviewer="Ops on call"
  onApprove={apply}
  onReject={dismiss}
/>
```

- Risk is stated in words, never colour alone. Pair with `AIDisclosureBadge` to display AI involvement and caller-supplied source information.

The component renders the review card and calls `onApprove` or `onReject`; it does not authenticate a reviewer, persist approval, or prevent an action outside these callbacks. The consumer must enforce the required authorization before executing the action and supply accurate risk, summary and reviewer content.

The reviewer slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

Keyboard: Tab reaches Reject and Approve; native Enter/Space activation invokes the corresponding caller callback. This UI does not enforce approval.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `HumanReviewGate.jsx` and `HumanReviewGate.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
