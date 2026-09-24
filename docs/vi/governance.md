# Quản trị — owner, độ chín, deprecation

Cách CyberSkill quản trị API công khai của hệ thống thiết kế. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## Hội đồng Design System

Hội đồng chịu trách nhiệm trực tiếp cho quyết định package và component Stable: design, frontend, accessibility, localization/content, security, product, và release. Ghế có tên nằm trong `docs/export-registry.json` (`council`).

## Owner

Mọi export công khai có `owner` và `backup` trong registry máy đọc `docs/export-registry.json`. Định tuyến review GitHub là `.github/CODEOWNERS`. Component không lên **Stable** nếu thiếu review design + engineering cùng sign-off accessibility và nội dung trên cùng change.

Sinh lại registry sau khi thêm hoặc đổi tên export công khai:

```bash
node scripts/generate-export-registry.mjs
```

## Độ chín

| Mức | Cam kết |
|---|---|
| Experimental | API có thể đổi; không hứa tương thích |
| Beta | Cho phép pilot production; bắt buộc ghi chú migration |
| Stable | Cam kết semver, docs đủ, owner, cửa sổ hỗ trợ |
| Deprecated | Phải có replacement, thời gian cảnh báo, và ngày gỡ |

`_audit/ci/test-export-registry.mjs` fail nếu export công khai thiếu owner, maturity, support, deprecation, hoặc package.

## Deprecation

Export deprecated giữ object `deprecation`: `{ replacement, since, removeAfter }`. Cảnh báo trên facade trong cửa sổ migration sáu tháng của `@cyberskill/design`. Không gỡ export Stable trong minor release.

## RFC

Component, token, theme mới, hoặc breaking change cần RFC trong `docs/decisions.md` (hoặc ADR liên kết). Các mục bắt buộc:

1. Bằng chứng người dùng / vấn đề
2. Phương án khác đã xét
3. API đề xuất
4. Ảnh hưởng accessibility
5. Ảnh hưởng localization / nội dung
6. Ảnh hưởng responsive / trình duyệt
7. Ảnh hưởng security
8. Kế hoạch adoption
9. Telemetry
10. Kế hoạch deprecation

Component không lên Stable nếu thiếu review design + engineering cùng sign-off a11y/nội dung trên RFC đó.

## Liên quan

- Hỗ trợ và trình duyệt: `docs/support-matrix.md`
- Hợp đồng component: `docs/component-contract.md`
- Tách package: `docs/package-topology.md`
