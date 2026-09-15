# Telemetry adoption

Sự kiện deprecation và adoption opt-in cho dashboard của council. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## Hợp đồng

`@cyberskill/primitives` export `reportAdoption` và `reportDeprecation`. Chúng no-op trừ khi host gán `globalThis.CS_TELEMETRY`. Package design system không mở socket mạng.

```js
globalThis.CS_TELEMETRY = (event) => {
  // sink của host — DataDog, OpenTelemetry, hoặc log drain
};
```

## Sự kiện

- `type: "adoption"` — sản phẩm, tên package, version (ledger trong repo: `docs/adoption-ledger.json`)
- `type: "deprecation"` — tên export và replacement (tỉ lệ trong `docs/governance-review.json`)

Không gửi PII. Facade có thể gọi `reportDeprecation("@cyberskill/design", "@cyberskill/react")` một lần mỗi session nếu sink tồn tại.

## Liên quan

- SLO: `docs/slo.md`
- Tiêu thụ: `docs/consuming.md`
- Package primitives: `packages/primitives`
