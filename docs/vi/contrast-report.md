# Báo cáo contrast — cặp elemental (APCA)

Tạo · quét tại VERSION 2.3.0.

Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

**Doctrine của sweep này:** chữ dùng nền `-bright` hoặc `-tint`, hoặc nền `-strong` đi cặp với `--cs-accent-on-strong`; không bao giờ trên mid-tone `-accent`. Accent chỉ cho bar, border, progress, fill không chữ. Đọc cặp màu và ngưỡng ghi ở từng dòng; `test:strong-text-contrast` kiểm tra riêng chữ thân đã render trên nền strong. (Rule trong `tokens/elements.css` và conventions.)

Pack được generate từ `tokens/element-seeds.json` (thang soft / middle / deep, khóa hue light↔dark). Gate hình học: `_audit/element-geometry.html`.
| Phạm vi | Cặp màu | chữ / nền | Lc | Kết quả |
|---|---|---|---|---|
| root (Thổ mặc định) | text-accent trên trắng (nhãn đậm) | #6E3B0E / #FFFFFF | 90.7 | ✓ |
| root (Thổ mặc định) | text-accent trên tint (nhãn đậm) | #6E3B0E / #FBF4E9 | 84.6 | ✓ |
| root (Thổ mặc định) | accent-bright trên ink (tiêu đề) | #F4BA17 / #45210E | 66.3 | ✓ |
| root (Thổ mặc định) | accent-on trên accent-bright (chữ CTA) | #45210E / #F4BA17 | 66.3 | ✓ |
| root (Thổ mặc định) | accent-bright trên panel tối (nhãn dark) | #F4BA17 / #221710 | 69.2 | ✓ |
| tho · sand | text-accent trên trắng (nhãn đậm) | #695300 / #FFFFFF | 85.5 | ✓ |
| tho · sand | text-accent trên tint (nhãn đậm) | #695300 / #FEF8E7 | 81.4 | ✓ |
| tho · sand | accent-bright trên ink (tiêu đề) | #FDEAB7 / #292108 | 92.5 | ✓ |
| tho · sand | accent-on trên accent-bright (chữ CTA) | #271E06 / #FDEAB7 | 91.6 | ✓ |
| tho · sand | accent-bright trên panel tối (nhãn dark) | #F9E5AE / #221710 | 90.5 | ✓ |
| tho | text-accent trên trắng (nhãn đậm) | #6E3B0E / #FFFFFF | 90.7 | ✓ |
| tho | text-accent trên tint (nhãn đậm) | #6E3B0E / #FBF4E9 | 84.6 | ✓ |
| tho | accent-bright trên ink (tiêu đề) | #F4BA17 / #45210E | 66.3 | ✓ |
| tho | accent-on trên accent-bright (chữ CTA) | #45210E / #F4BA17 | 66.3 | ✓ |
| tho | accent-bright trên panel tối (nhãn dark) | #FDD378 / #221710 | 81.9 | ✓ |
| tho · clay | text-accent trên trắng (nhãn đậm) | #462402 / #FFFFFF | 100.2 | ✓ |
| tho · clay | text-accent trên tint (nhãn đậm) | #462402 / #FCEEE3 | 91.5 | ✓ |
| tho · clay | accent-bright trên ink (tiêu đề) | #F2C5A3 / #321B07 | 74.4 | ✓ |
| tho · clay | accent-on trên accent-bright (chữ CTA) | #080200 / #F2C5A3 | 77.4 | ✓ |
| tho · clay | accent-bright trên panel tối (nhãn dark) | #F8C7A1 / #221710 | 77.1 | ✓ |
| hoa · plasma | text-accent trên trắng (nhãn đậm) | #714B4D / #FFFFFF | 85.8 | ✓ |
| hoa · plasma | text-accent trên tint (nhãn đậm) | #714B4D / #FFF5F5 | 81.1 | ✓ |
| hoa · plasma | accent-bright trên ink (tiêu đề) | #FFE3E4 / #2B1E1E | 91.5 | ✓ |
| hoa · plasma | accent-on trên accent-bright (chữ CTA) | #281B1C / #FFE3E4 | 90.8 | ✓ |
| hoa · plasma | accent-bright trên panel tối (nhãn dark) | #FDDDDE / #221710 | 89.4 | ✓ |
| hoa | text-accent trên trắng (nhãn đậm) | #793609 / #FFFFFF | 90 | ✓ |
| hoa | text-accent trên tint (nhãn đậm) | #793609 / #FFF1EA | 83.2 | ✓ |
| hoa | accent-bright trên ink (tiêu đề) | #FFD3BD / #3A1501 | 83 | ✓ |
| hoa | accent-on trên accent-bright (chữ CTA) | #361402 / #FFD3BD | 82.8 | ✓ |
| hoa | accent-bright trên panel tối (nhãn dark) | #FECDB4 / #221710 | 81.2 | ✓ |
| hoa · lava | text-accent trên trắng (nhãn đậm) | #550306 / #FFFFFF | 100.5 | ✓ |
| hoa · lava | text-accent trên tint (nhãn đậm) | #550306 / #FFEBE9 | 91.1 | ✓ |
| hoa · lava | accent-bright trên ink (tiêu đề) | #FFBCB4 / #400C0B | 73.4 | ✓ |
| hoa · lava | accent-on trên accent-bright (chữ CTA) | #0D0000 / #FFBCB4 | 76.6 | ✓ |
| hoa · lava | accent-bright trên panel tối (nhãn dark) | #FFC1B9 / #221710 | 76.7 | ✓ |
| thuy · mist | text-accent trên trắng (nhãn đậm) | #116060 / #FFFFFF | 85.1 | ✓ |
| thuy · mist | text-accent trên tint (nhãn đậm) | #116060 / #E6FDFC | 81.1 | ✓ |
| thuy · mist | accent-bright trên ink (tiêu đề) | #B1FBF9 / #032727 | 94 | ✓ |
| thuy · mist | accent-on trên accent-bright (chữ CTA) | #012525 / #B1FBF9 | 92.7 | ✓ |
| thuy · mist | accent-bright trên panel tối (nhãn dark) | #A6F8F6 / #221710 | 92.7 | ✓ |
| thuy | text-accent trên trắng (nhãn đậm) | #0D535C / #FFFFFF | 89.5 | ✓ |
| thuy | text-accent trên tint (nhãn đậm) | #0D535C / #DFFBFF | 84 | ✓ |
| thuy | accent-bright trên ink (tiêu đề) | #94EFFD / #03272C | 85.8 | ✓ |
| thuy | accent-on trên accent-bright (chữ CTA) | #012429 / #94EFFD | 85.4 | ✓ |
| thuy | accent-bright trên panel tối (nhãn dark) | #79EDFF / #221710 | 84.6 | ✓ |
| thuy · ocean | text-accent trên trắng (nhãn đậm) | #003142 / #FFFFFF | 100.1 | ✓ |
| thuy · ocean | text-accent trên tint (nhãn đậm) | #003142 / #E5F3FA | 91.5 | ✓ |
| thuy · ocean | accent-bright trên ink (tiêu đề) | #A9D8ED / #092531 | 76.1 | ✓ |
| thuy · ocean | accent-on trên accent-bright (chữ CTA) | #001721 / #A9D8ED | 78.1 | ✓ |
| thuy · ocean | accent-bright trên panel tối (nhãn dark) | #A5D8F0 / #221710 | 77.1 | ✓ |
| moc · bamboo | text-accent trên trắng (nhãn đậm) | #4A5B02 / #FFFFFF | 86 | ✓ |
| moc · bamboo | text-accent trên tint (nhãn đậm) | #4A5B02 / #F5FBE8 | 82.1 | ✓ |
| moc · bamboo | accent-bright trên ink (tiêu đề) | #E2F4BA / #1E250A | 93.4 | ✓ |
| moc · bamboo | accent-on trên accent-bright (chữ CTA) | #1C2307 / #E2F4BA | 92.3 | ✓ |
| moc · bamboo | accent-bright trên panel tối (nhãn dark) | #DCF0B1 / #221710 | 91.7 | ✓ |
| moc | text-accent trên trắng (nhãn đậm) | #24570B / #FFFFFF | 89.2 | ✓ |
| moc | text-accent trên tint (nhãn đậm) | #24570B / #EAFAE5 | 83.4 | ✓ |
| moc | accent-bright trên ink (tiêu đề) | #B9F0A6 / #0D2902 | 85.9 | ✓ |
| moc | accent-on trên accent-bright (chữ CTA) | #0A2700 / #B9F0A6 | 85.4 | ✓ |
| moc | accent-bright trên panel tối (nhãn dark) | #B2EC9E / #221710 | 84.5 | ✓ |
| moc · forest | text-accent trên trắng (nhãn đậm) | #04361D / #FFFFFF | 99.7 | ✓ |
| moc · forest | text-accent trên tint (nhãn đậm) | #04361D / #E6F5EB | 91.5 | ✓ |
| moc · forest | accent-bright trên ink (tiêu đề) | #ACDDBD / #0B2818 | 76.4 | ✓ |
| moc · forest | accent-on trên accent-bright (chữ CTA) | #011C0D / #ACDDBD | 78.1 | ✓ |
| moc · forest | accent-bright trên panel tối (nhãn dark) | #A8DFBB / #221710 | 78.3 | ✓ |
| kim · titanium | text-accent trên trắng (nhãn đậm) | #3D5670 / #FFFFFF | 86.4 | ✓ |
| kim · titanium | text-accent trên tint (nhãn đậm) | #3D5670 / #F3F8FE | 81.8 | ✓ |
| kim · titanium | accent-bright trên ink (tiêu đề) | #DDEDFF / #1A232B | 92.5 | ✓ |
| kim · titanium | accent-on trên accent-bright (chữ CTA) | #182029 / #DDEDFF | 91.6 | ✓ |
| kim · titanium | accent-bright trên panel tối (nhãn dark) | #D6E9FD / #221710 | 90.8 | ✓ |
| kim | text-accent trên trắng (nhãn đậm) | #564B27 / #FFFFFF | 89.6 | ✓ |
| kim | text-accent trên tint (nhãn đậm) | #564B27 / #F8F4EA | 83.2 | ✓ |
| kim | accent-bright trên ink (tiêu đề) | #E8DEBD / #262112 | 84.3 | ✓ |
| kim | accent-on trên accent-bright (chữ CTA) | #241F0F / #E8DEBD | 84 | ✓ |
| kim | accent-bright trên panel tối (nhãn dark) | #E3D9B8 / #221710 | 82.3 | ✓ |
| kim · steel | text-accent trên trắng (nhãn đậm) | #1B2E4C / #FFFFFF | 100 | ✓ |
| kim · steel | text-accent trên tint (nhãn đậm) | #1B2E4C / #EBF1FB | 91.4 | ✓ |
| kim · steel | accent-bright trên ink (tiêu đề) | #BED0F0 / #182232 | 75 | ✓ |
| kim · steel | accent-on trên accent-bright (chữ CTA) | #020818 / #BED0F0 | 78 | ✓ |
| kim · steel | accent-bright trên panel tối (nhãn dark) | #BBD0F4 / #221710 | 76 | ✓ |

**Số cặp không đạt: 0.** Mọi cặp chữ đều đạt Lc ≥ 60.

## Tương phản liên kết của element pack (WCAG AA · chữ thân)

`--cs-color-link` được đánh giá ở ngưỡng **4.5:1** (chữ thân có độ đậm thông thường). `--cs-color-text-accent` vẫn áp dụng ngưỡng APCA Lc ≥ 60 cho nhãn đậm ở trên.

Các dòng dùng màu `--cs-color-link` đã khai báo cho light hoặc dark. Nền trắng, trang tham chiếu, nền nâng tham chiếu và panel tối tham chiếu là các màu cố định; vai trò nền của element dùng `color-mix()` và không được đo trong những dòng này. Kiểm tra nền đã render, tùy chọn và tương tác có phạm vi riêng.
| Phạm vi | Cặp màu | chữ / nền | Tỷ lệ | Kết quả |
|---|---|---|---|---|
| tho · sand | liên kết trên trắng (chữ thân) | #695300 / #FFFFFF | 7.40:1 | ✓ |
| tho · sand | liên kết trên trang tham chiếu (chữ thân) | #695300 / #FFFDF8 | 7.28:1 | ✓ |
| tho · sand | liên kết trên tint (chữ thân) | #695300 / #FEF8E7 | 6.98:1 | ✓ |
| tho · sand | liên kết trên nền kem nâng tham chiếu (chữ thân) | #695300 / #FBF4E9 | 6.77:1 | ✓ |
| tho · sand | liên kết trên panel tối tham chiếu (chữ thân) | #F9E5AE / #221710 | 14.06:1 | ✓ |
| tho | liên kết trên trắng (chữ thân) | #644A05 / #FFFFFF | 8.32:1 | ✓ |
| tho | liên kết trên trang tham chiếu (chữ thân) | #644A05 / #FFFDF8 | 8.19:1 | ✓ |
| tho | liên kết trên tint (chữ thân) | #644A05 / #FBF4E9 | 7.62:1 | ✓ |
| tho | liên kết trên nền kem nâng tham chiếu (chữ thân) | #644A05 / #FBF4E9 | 7.62:1 | ✓ |
| tho | liên kết trên panel tối tham chiếu (chữ thân) | #FFD57A / #221710 | 12.56:1 | ✓ |
| tho · clay | liên kết trên trắng (chữ thân) | #462402 / #FFFFFF | 13.87:1 | ✓ |
| tho · clay | liên kết trên trang tham chiếu (chữ thân) | #462402 / #FFFDF8 | 13.65:1 | ✓ |
| tho · clay | liên kết trên tint (chữ thân) | #462402 / #FCEEE3 | 12.21:1 | ✓ |
| tho · clay | liên kết trên nền kem nâng tham chiếu (chữ thân) | #462402 / #FBF4E9 | 12.70:1 | ✓ |
| tho · clay | liên kết trên panel tối tham chiếu (chữ thân) | #FFD2AF / #221710 | 12.60:1 | ✓ |
| hoa · plasma | liên kết trên trắng (chữ thân) | #714B4D / #FFFFFF | 7.46:1 | ✓ |
| hoa · plasma | liên kết trên trang tham chiếu (chữ thân) | #714B4D / #FFFDF8 | 7.34:1 | ✓ |
| hoa · plasma | liên kết trên tint (chữ thân) | #714B4D / #FFF5F5 | 6.97:1 | ✓ |
| hoa · plasma | liên kết trên nền kem nâng tham chiếu (chữ thân) | #714B4D / #FBF4E9 | 6.83:1 | ✓ |
| hoa · plasma | liên kết trên panel tối tham chiếu (chữ thân) | #FDDDDE / #221710 | 13.83:1 | ✓ |
| hoa | liên kết trên trắng (chữ thân) | #793609 / #FFFFFF | 8.96:1 | ✓ |
| hoa | liên kết trên trang tham chiếu (chữ thân) | #793609 / #FFFDF8 | 8.81:1 | ✓ |
| hoa | liên kết trên tint (chữ thân) | #793609 / #FFF1EA | 8.11:1 | ✓ |
| hoa | liên kết trên nền kem nâng tham chiếu (chữ thân) | #793609 / #FBF4E9 | 8.20:1 | ✓ |
| hoa | liên kết trên panel tối tham chiếu (chữ thân) | #FFD1BA / #221710 | 12.59:1 | ✓ |
| hoa · lava | liên kết trên trắng (chữ thân) | #550306 / #FFFFFF | 14.98:1 | ✓ |
| hoa · lava | liên kết trên trang tham chiếu (chữ thân) | #550306 / #FFFDF8 | 14.74:1 | ✓ |
| hoa · lava | liên kết trên tint (chữ thân) | #550306 / #FFEBE9 | 13.06:1 | ✓ |
| hoa · lava | liên kết trên nền kem nâng tham chiếu (chữ thân) | #550306 / #FBF4E9 | 13.71:1 | ✓ |
| hoa · lava | liên kết trên panel tối tham chiếu (chữ thân) | #FDD0CA / #221710 | 12.56:1 | ✓ |
| thuy · mist | liên kết trên trắng (chữ thân) | #116060 / #FFFFFF | 7.33:1 | ✓ |
| thuy · mist | liên kết trên trang tham chiếu (chữ thân) | #116060 / #FFFDF8 | 7.21:1 | ✓ |
| thuy · mist | liên kết trên tint (chữ thân) | #116060 / #E6FDFC | 6.92:1 | ✓ |
| thuy · mist | liên kết trên nền kem nâng tham chiếu (chữ thân) | #116060 / #FBF4E9 | 6.71:1 | ✓ |
| thuy · mist | liên kết trên panel tối tham chiếu (chữ thân) | #A6F8F6 / #221710 | 14.51:1 | ✓ |
| thuy | liên kết trên trắng (chữ thân) | #0D535C / #FFFFFF | 8.72:1 | ✓ |
| thuy | liên kết trên trang tham chiếu (chữ thân) | #0D535C / #FFFDF8 | 8.58:1 | ✓ |
| thuy | liên kết trên tint (chữ thân) | #0D535C / #DFFBFF | 8.05:1 | ✓ |
| thuy | liên kết trên nền kem nâng tham chiếu (chữ thân) | #0D535C / #FBF4E9 | 7.98:1 | ✓ |
| thuy | liên kết trên panel tối tham chiếu (chữ thân) | #79EDFF / #221710 | 12.83:1 | ✓ |
| thuy · ocean | liên kết trên trắng (chữ thân) | #003142 / #FFFFFF | 13.83:1 | ✓ |
| thuy · ocean | liên kết trên trang tham chiếu (chữ thân) | #003142 / #FFFDF8 | 13.61:1 | ✓ |
| thuy · ocean | liên kết trên tint (chữ thân) | #003142 / #E5F3FA | 12.21:1 | ✓ |
| thuy · ocean | liên kết trên nền kem nâng tham chiếu (chữ thân) | #003142 / #FBF4E9 | 12.66:1 | ✓ |
| thuy · ocean | liên kết trên panel tối tham chiếu (chữ thân) | #AFE2FA / #221710 | 12.59:1 | ✓ |
| moc · bamboo | liên kết trên trắng (chữ thân) | #4A5B02 / #FFFFFF | 7.53:1 | ✓ |
| moc · bamboo | liên kết trên trang tham chiếu (chữ thân) | #4A5B02 / #FFFDF8 | 7.41:1 | ✓ |
| moc · bamboo | liên kết trên tint (chữ thân) | #4A5B02 / #F5FBE8 | 7.12:1 | ✓ |
| moc · bamboo | liên kết trên nền kem nâng tham chiếu (chữ thân) | #4A5B02 / #FBF4E9 | 6.89:1 | ✓ |
| moc · bamboo | liên kết trên panel tối tham chiếu (chữ thân) | #DCF0B1 / #221710 | 14.31:1 | ✓ |
| moc | liên kết trên trắng (chữ thân) | #24570B / #FFFFFF | 8.60:1 | ✓ |
| moc | liên kết trên trang tham chiếu (chữ thân) | #24570B / #FFFDF8 | 8.46:1 | ✓ |
| moc | liên kết trên tint (chữ thân) | #24570B / #EAFAE5 | 7.90:1 | ✓ |
| moc | liên kết trên nền kem nâng tham chiếu (chữ thân) | #24570B / #FBF4E9 | 7.87:1 | ✓ |
| moc | liên kết trên panel tối tham chiếu (chữ thân) | #B2EC9E / #221710 | 12.84:1 | ✓ |
| moc · forest | liên kết trên trắng (chữ thân) | #04361D / #FFFFFF | 13.54:1 | ✓ |
| moc · forest | liên kết trên trang tham chiếu (chữ thân) | #04361D / #FFFDF8 | 13.32:1 | ✓ |
| moc · forest | liên kết trên tint (chữ thân) | #04361D / #E6F5EB | 12.01:1 | ✓ |
| moc · forest | liên kết trên nền kem nâng tham chiếu (chữ thân) | #04361D / #FBF4E9 | 12.39:1 | ✓ |
| moc · forest | liên kết trên panel tối tham chiếu (chữ thân) | #B0E7C3 / #221710 | 12.57:1 | ✓ |
| kim · titanium | liên kết trên trắng (chữ thân) | #3D5670 / #FFFFFF | 7.60:1 | ✓ |
| kim · titanium | liên kết trên trang tham chiếu (chữ thân) | #3D5670 / #FFFDF8 | 7.48:1 | ✓ |
| kim · titanium | liên kết trên tint (chữ thân) | #3D5670 / #F3F8FE | 7.12:1 | ✓ |
| kim · titanium | liên kết trên nền kem nâng tham chiếu (chữ thân) | #3D5670 / #FBF4E9 | 6.95:1 | ✓ |
| kim · titanium | liên kết trên panel tối tham chiếu (chữ thân) | #D6E9FD / #221710 | 14.13:1 | ✓ |
| kim | liên kết trên trắng (chữ thân) | #564B27 / #FFFFFF | 8.64:1 | ✓ |
| kim | liên kết trên trang tham chiếu (chữ thân) | #564B27 / #FFFDF8 | 8.50:1 | ✓ |
| kim | liên kết trên tint (chữ thân) | #564B27 / #F8F4EA | 7.86:1 | ✓ |
| kim | liên kết trên nền kem nâng tham chiếu (chữ thân) | #564B27 / #FBF4E9 | 7.90:1 | ✓ |
| kim | liên kết trên panel tối tham chiếu (chữ thân) | #E5DBBA / #221710 | 12.66:1 | ✓ |
| kim · steel | liên kết trên trắng (chữ thân) | #1B2E4C / #FFFFFF | 13.62:1 | ✓ |
| kim · steel | liên kết trên trang tham chiếu (chữ thân) | #1B2E4C / #FFFDF8 | 13.40:1 | ✓ |
| kim · steel | liên kết trên tint (chữ thân) | #1B2E4C / #EBF1FB | 12.00:1 | ✓ |
| kim · steel | liên kết trên nền kem nâng tham chiếu (chữ thân) | #1B2E4C / #FBF4E9 | 12.47:1 | ✓ |
| kim · steel | liên kết trên panel tối tham chiếu (chữ thân) | #C8DBFD / #221710 | 12.53:1 | ✓ |

**Số cặp liên kết không đạt: 0.**

## Chữ trên nền strong (APCA cho chữ thân)

Ghép `--cs-accent-strong` với `--cs-accent-on-strong`: cả pack light và dark phải đạt ngưỡng chữ thân Lc ≥ 75 (mục tiêu của generator là 78) và WCAG ≥ 4.5:1. Nút primary ở chế độ dark dùng màu chữ đi cặp này. Các màu neo thương hiệu và tám vai trò accent còn lại giữ nguyên giá trị.
| Phạm vi | Chế độ | chữ / nền | Lc | Kết quả |
|---|---|---|---|---|
| tho · sand | sáng | #FFFFFF / #856A03 | 80.8 | ✓ |
| tho · sand | tối | #FFFFFF / #80671A | 82.2 | ✓ |
| tho | sáng | #FFFFFF / #916D11 | 78.4 | ✓ |
| tho | tối | #FFFFFF / #6E5205 | 90.1 | ✓ |
| tho · clay | sáng | #FFFFFF / #5A3004 | 99.5 | ✓ |
| tho · clay | tối | #FFFFFF / #5C3001 | 99.3 | ✓ |
| hoa · plasma | sáng | #FFFFFF / #896163 | 81.7 | ✓ |
| hoa · plasma | tối | #FFFFFF / #836061 | 82.8 | ✓ |
| hoa | sáng | #FFFFFF / #96440B | 87.5 | ✓ |
| hoa | tối | #FFFFFF / #883E0D | 90.9 | ✓ |
| hoa · lava | sáng | #FFFFFF / #760008 | 98.8 | ✓ |
| hoa · lava | tối | #FFFFFF / #6D1D19 | 99.2 | ✓ |
| thuy · mist | sáng | #FFFFFF / #037D7D | 79.2 | ✓ |
| thuy · mist | tối | #FFFFFF / #077A79 | 80.4 | ✓ |
| thuy | sáng | #FFFFFF / #166B76 | 85.6 | ✓ |
| thuy | tối | #FFFFFF / #04626D | 89.0 | ✓ |
| thuy · ocean | sáng | #FFFFFF / #034257 | 98.8 | ✓ |
| thuy · ocean | tối | #FFFFFF / #00445A | 98.2 | ✓ |
| moc · bamboo | sáng | #FFFFFF / #62780E | 79.7 | ✓ |
| moc · bamboo | tối | #FFFFFF / #607420 | 81.2 | ✓ |
| moc | sáng | #FFFFFF / #2B7100 | 85.1 | ✓ |
| moc | tối | #FFFFFF / #286704 | 88.6 | ✓ |
| moc · forest | sáng | #FFFFFF / #0A4829 | 98.3 | ✓ |
| moc · forest | tối | #FFFFFF / #074A29 | 97.8 | ✓ |
| kim · titanium | sáng | #FFFFFF / #56708B | 80.8 | ✓ |
| kim · titanium | tối | #FFFFFF / #576D83 | 82.0 | ✓ |
| kim | sáng | #FFFFFF / #6A5E3A | 86.9 | ✓ |
| kim | tối | #FFFFFF / #615633 | 90.1 | ✓ |
| kim · steel | sáng | #FFFFFF / #293C5C | 99.4 | ✓ |
| kim · steel | tối | #FFFFFF / #2B3D5D | 99.0 | ✓ |

**Số cặp chữ thân trên nền strong không đạt: 0.** Đây là phép tính tĩnh cho cặp màu đã khai báo; kiểm tra hồi quy browser và kiểm tra template/raster thực tế có phạm vi riêng. Bảng này không chứng minh tương phản khi có độ trong suốt, gradient, chuyển tiếp hay lớp phủ tùy ý.

## Ngưỡng APCA của pack dark (đối chiếu gate)

Các ngưỡng đề xuất trong `_audit/apca-dark-preview.html`: bright ≥ 75 · accent ≥ 60 · on-strong/strong ≥ 75 · ink-on-tint ≥ 75. Accent và bright không phải vai trò chữ thân thông thường dùng được trên mọi nền.
| Pack | bright | accent | on | ink |
|---|---|---|---|---|
| tho · sand | 90.5 | 76.1 | 82.2 | 87.4 |
| tho | 81.9 | 64.7 | 90.1 | 81 |
| tho · clay | 77.1 | 60.6 | 99.3 | 79.4 |
| hoa · plasma | 89.4 | 75.1 | 82.8 | 86.4 |
| hoa | 81.2 | 63.2 | 90.9 | 80.3 |
| hoa · lava | 76.7 | 60.9 | 99.2 | 79.2 |
| thuy · mist | 92.7 | 78.7 | 80.4 | 89.3 |
| thuy | 84.6 | 67.7 | 89 | 83.5 |
| thuy · ocean | 77.1 | 60.9 | 98.2 | 79.2 |
| moc · bamboo | 91.7 | 77.9 | 81.2 | 88.4 |
| moc | 84.5 | 67.9 | 88.6 | 83.4 |
| moc · forest | 78.3 | 61.7 | 97.8 | 78.6 |
| kim · titanium | 90.8 | 76.5 | 82 | 87.8 |
| kim | 82.3 | 65.2 | 90.1 | 81.4 |
| kim · steel | 76 | 61.5 | 99 | 78.3 |

