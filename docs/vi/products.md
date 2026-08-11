# Product registry — ánh xạ element

> **Đã khóa / locked** (Th7 2026). Registry product → element chuẩn cho agent và kit. **Không** invent ánh xạ product → element mới; thêm hoặc đổi hàng chỉ qua quyết định maintainer trong `docs/decisions.md`. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

**Nguồn chân lý.** Ánh xạ sản phẩm portfolio CyberSkill sang pack element Ngũ Hành. Một element mỗi sản phẩm; accent phụ chỉ trong gradient wash theo Tương sinh.

| Sản phẩm | Element | Variant | Slot | Phụ (Tương sinh) | Markup |
|---|---|---|---|---|---|
| **Lumi** — trợ lý wish | Hỏa · fire | plasma | soft | tho | `data-cs-element="hoa" data-cs-variant="plasma"` |
| **Status Hub** — portal portfolio khách | Thủy · water | river (mặc định) | middle | moc | `data-cs-element="thuy"` |
| **CyberOS Agent Spine** — infra agent, memory, gates | Kim · metal | steel | deep | thuy | `data-cs-element="kim" data-cs-variant="steel"` |
| **CyberSkill Design System** — thư viện này | Mộc · wood | leaf (mặc định) | middle | hoa | `data-cs-element="moc"` |
| **cyberskill.world** — site studio | Thổ · earth | studio (mặc định) | middle | — | *(không attribute — studio là Thổ)* |
| **Client delivery suite** — kickoff · QBR · runbooks | Thổ · earth | clay | deep | kim | `data-cs-element="tho" data-cs-variant="clay"` |
| **Board / investor collateral** | Kim · metal | champagne (mặc định) | middle | thuy | `data-cs-element="kim"` |
| **HR / employment instruments** | Mộc · wood | bamboo | soft | hoa | `data-cs-element="moc" data-cs-variant="bamboo"` |

**Slot** (soft / middle / deep) là thang cường độ dùng chung — xem [`docs/vi/design-styles.md`](design-styles.md). Tên variant công khai giữ ổn định; pack generate từ `tokens/element-seeds.json`.

**Vì sao:** Lumi là tia hội thoại (plasma). Status Hub là dòng trạng thái bình (Thủy). Agent Spine là hạ tầng chính xác (Kim·steel). Design System nuôi mọi thứ khác (Mộc). Brand studio là Thổ. Delivery là đất vững (clay). Board collateral là kim loại chính xác. HR instruments nuôi người (bamboo).

## Phạm vi

- **UI kits giữ trung thành Thổ.** `ui_kits/status-hub` và `ui_kits/website` vẫn là tái tạo Thổ; demo theo element nằm ở **Storybook Element toolbar**, **Atomic View**, và specimen **Elements Geometry**.

- **Dùng một ánh xạ:** scope root sản phẩm bằng Markup của hàng và dùng `--cs-accent-*`.

- Cặp Tương khắc (Hỏa×Thủy · Kim×Mộc · Thổ×Thủy · Mộc×Thổ · Hỏa×Kim) không bao giờ kết hợp primary + secondary.
