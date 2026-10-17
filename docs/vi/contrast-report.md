# Báo cáo contrast — cặp elemental (APCA)

Tạo · quét tại VERSION 1.7.2.

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
| tho | text-accent trên trắng (nhãn đậm) | #6E3B0E / #FFFFFF | 90.7 | ✓ |
| tho | text-accent trên tint (nhãn đậm) | #6E3B0E / #FBF4E9 | 84.6 | ✓ |
| tho | accent-bright trên ink (tiêu đề) | #F4BA17 / #45210E | 66.3 | ✓ |
| tho | accent-on trên accent-bright (chữ CTA) | #45210E / #F4BA17 | 66.3 | ✓ |
| tho | accent-bright trên panel tối (nhãn dark) | #FEC42C / #221710 | 75 | ✓ |
| tho · sand | text-accent trên trắng (nhãn đậm) | #625431 / #FFFFFF | 85.7 | ✓ |
| tho · sand | text-accent trên tint (nhãn đậm) | #625431 / #FBF7EA | 80.9 | ✓ |
| tho · sand | accent-bright trên ink (tiêu đề) | #F6EBCC / #292414 | 92.3 | ✓ |
| tho · sand | accent-on trên accent-bright (chữ CTA) | #292414 / #F6EBCC | 90.8 | ✓ |
| tho · sand | accent-bright trên panel tối (nhãn dark) | #F6EBCC / #221710 | 93.8 | ✓ |
| tho · clay | text-accent trên trắng (nhãn đậm) | #201300 / #FFFFFF | 104.8 | ✓ |
| tho · clay | text-accent trên tint (nhãn đậm) | #201300 / #FFF6E7 | 100 | ✓ |
| tho · clay | accent-bright trên ink (tiêu đề) | #DEC7A2 / #2D220E | 71.7 | ✓ |
| tho · clay | accent-on trên accent-bright (chữ CTA) | #2D220E / #DEC7A2 | 71.8 | ✓ |
| tho · clay | accent-bright trên panel tối (nhãn dark) | #E4CDA8 / #221710 | 76.7 | ✓ |
| hoa | text-accent trên trắng (nhãn đậm) | #793B20 / #FFFFFF | 88.9 | ✓ |
| hoa | text-accent trên tint (nhãn đậm) | #793B20 / #FFF4F0 | 83.6 | ✓ |
| hoa | accent-bright trên ink (tiêu đề) | #FED3C3 / #381B10 | 82.8 | ✓ |
| hoa | accent-on trên accent-bright (chữ CTA) | #381B10 / #FED3C3 | 82.1 | ✓ |
| hoa | accent-bright trên panel tối (nhãn dark) | #FED3C3 / #221710 | 84.2 | ✓ |
| hoa · plasma | text-accent trên trắng (nhãn đậm) | #66504B / #FFFFFF | 85.9 | ✓ |
| hoa · plasma | text-accent trên tint (nhãn đậm) | #66504B / #FEF4F2 | 80.6 | ✓ |
| hoa · plasma | accent-bright trên ink (tiêu đề) | #FCE6DF / #2C211E | 91.8 | ✓ |
| hoa · plasma | accent-on trên accent-bright (chữ CTA) | #2C211E / #FCE6DF | 90.4 | ✓ |
| hoa · plasma | accent-bright trên panel tối (nhãn dark) | #FCE6DF / #221710 | 93.2 | ✓ |
| hoa · lava | text-accent trên trắng (nhãn đậm) | #280D00 / #FFFFFF | 104.7 | ✓ |
| hoa · lava | text-accent trên tint (nhãn đậm) | #280D00 / #FFF4EF | 99.4 | ✓ |
| hoa · lava | accent-bright trên ink (tiêu đề) | #F1BEA4 / #361D0F | 71 | ✓ |
| hoa · lava | accent-on trên accent-bright (chữ CTA) | #361D0F / #F1BEA4 | 71.2 | ✓ |
| hoa · lava | accent-bright trên panel tối (nhãn dark) | #F8C4AA / #221710 | 76.2 | ✓ |
| thuy | text-accent trên trắng (nhãn đậm) | #035763 / #FFFFFF | 88 | ✓ |
| thuy | text-accent trên tint (nhãn đậm) | #035763 / #E7FBFF | 83.4 | ✓ |
| thuy | accent-bright trên ink (tiêu đề) | #99EEFF / #012A30 | 85.3 | ✓ |
| thuy | accent-on trên accent-bright (chữ CTA) | #012A30 / #99EEFF | 84.3 | ✓ |
| thuy | accent-bright trên panel tối (nhãn dark) | #99EEFF / #221710 | 87.2 | ✓ |
| thuy · mist | text-accent trên trắng (nhãn đậm) | #2E5E64 / #FFFFFF | 85 | ✓ |
| thuy · mist | text-accent trên tint (nhãn đậm) | #2E5E64 / #EBFAFC | 80.3 | ✓ |
| thuy · mist | accent-bright trên ink (tiêu đề) | #CDF4F9 / #13282B | 93.1 | ✓ |
| thuy · mist | accent-on trên accent-bright (chữ CTA) | #13282B / #CDF4F9 | 91.5 | ✓ |
| thuy · mist | accent-bright trên panel tối (nhãn dark) | #CDF4F9 / #221710 | 94.7 | ✓ |
| thuy · ocean | text-accent trên trắng (nhãn đậm) | #011A21 / #FFFFFF | 104.5 | ✓ |
| thuy · ocean | text-accent trên tint (nhãn đậm) | #011A21 / #EAFAFF | 99.8 | ✓ |
| thuy · ocean | accent-bright trên ink (tiêu đề) | #A8D3E0 / #10282F | 72.7 | ✓ |
| thuy · ocean | accent-on trên accent-bright (chữ CTA) | #10282F / #A8D3E0 | 72.6 | ✓ |
| thuy · ocean | accent-bright trên panel tối (nhãn dark) | #ABD6E3 / #221710 | 76.1 | ✓ |
| moc | text-accent trên trắng (nhãn đậm) | #38570C / #FFFFFF | 88.4 | ✓ |
| moc | text-accent trên tint (nhãn đậm) | #38570C / #EFFCE3 | 84 | ✓ |
| moc | accent-bright trên ink (tiêu đề) | #C5ED9C / #182A00 | 85.2 | ✓ |
| moc | accent-on trên accent-bright (chữ CTA) | #182A00 / #C5ED9C | 84.2 | ✓ |
| moc | accent-bright trên panel tối (nhãn dark) | #C5ED9C / #221710 | 86.9 | ✓ |
| moc · bamboo | text-accent trên trắng (nhãn đậm) | #505C3A / #FFFFFF | 84.8 | ✓ |
| moc · bamboo | text-accent trên tint (nhãn đậm) | #505C3A / #F4F9ED | 80.1 | ✓ |
| moc · bamboo | accent-bright trên ink (tiêu đề) | #E5F1D2 / #212617 | 93 | ✓ |
| moc · bamboo | accent-on trên accent-bright (chữ CTA) | #212617 / #E5F1D2 | 91.4 | ✓ |
| moc · bamboo | accent-bright trên panel tối (nhãn dark) | #E5F1D2 / #221710 | 94.5 | ✓ |
| moc · forest | text-accent trên trắng (nhãn đậm) | #051D00 / #FFFFFF | 104.4 | ✓ |
| moc · forest | text-accent trên tint (nhãn đậm) | #051D00 / #ECFDE7 | 100.2 | ✓ |
| moc · forest | accent-bright trên ink (tiêu đề) | #B0D8A3 / #162A0E | 73.2 | ✓ |
| moc · forest | accent-on trên accent-bright (chữ CTA) | #162A0E / #B0D8A3 | 73.2 | ✓ |
| moc · forest | accent-bright trên panel tối (nhãn dark) | #B0D8A3 / #221710 | 75 | ✓ |
| kim | text-accent trên trắng (nhãn đậm) | #65460B / #FFFFFF | 89.4 | ✓ |
| kim | text-accent trên tint (nhãn đậm) | #65460B / #FFF5E7 | 84.2 | ✓ |
| kim | accent-bright trên ink (tiêu đề) | #FDD89F / #312002 | 83.5 | ✓ |
| kim | accent-on trên accent-bright (chữ CTA) | #312002 / #FDD89F | 82.8 | ✓ |
| kim | accent-bright trên panel tối (nhãn dark) | #FDD89F / #221710 | 85 | ✓ |
| kim · titanium | text-accent trên trắng (nhãn đậm) | #67543D / #FFFFFF | 85 | ✓ |
| kim · titanium | text-accent trên tint (nhãn đậm) | #67543D / #FDF5ED | 79.7 | ✓ |
| kim · titanium | accent-bright trên ink (tiêu đề) | #FBE8D2 / #2B2217 | 92 | ✓ |
| kim · titanium | accent-on trên accent-bright (chữ CTA) | #2B2217 / #FBE8D2 | 90.6 | ✓ |
| kim · titanium | accent-bright trên panel tối (nhãn dark) | #FBE8D2 / #221710 | 93.4 | ✓ |
| kim · steel | text-accent trên trắng (nhãn đậm) | #1F1400 / #FFFFFF | 104.8 | ✓ |
| kim · steel | text-accent trên tint (nhãn đậm) | #1F1400 / #FEF6E7 | 99.8 | ✓ |
| kim · steel | accent-bright trên ink (tiêu đề) | #DCC8A2 / #2D220E | 71.8 | ✓ |
| kim · steel | accent-on trên accent-bright (chữ CTA) | #2D220E / #DCC8A2 | 71.9 | ✓ |
| kim · steel | accent-bright trên panel tối (nhãn dark) | #DFCBA5 / #221710 | 75.1 | ✓ |

**Số cặp không đạt: 0.** Mọi cặp chữ đều đạt Lc ≥ 60.

## Tương phản liên kết của element pack (WCAG AA · chữ thân)

`--cs-color-link` được đánh giá ở ngưỡng **4.5:1** (chữ thân có độ đậm thông thường). `--cs-color-text-accent` vẫn áp dụng ngưỡng APCA Lc ≥ 60 cho nhãn đậm ở trên.

Các dòng dùng màu `--cs-color-link` đã khai báo cho light hoặc dark. Nền trắng, trang tham chiếu, nền nâng tham chiếu và panel tối tham chiếu là các màu cố định; vai trò nền của element dùng `color-mix()` và không được đo trong những dòng này. Kiểm tra nền đã render, tùy chọn và tương tác có phạm vi riêng.
| Phạm vi | Cặp màu | chữ / nền | Tỷ lệ | Kết quả |
|---|---|---|---|---|
| tho | liên kết trên trắng (chữ thân) | #644A05 / #FFFFFF | 8.32:1 | ✓ |
| tho | liên kết trên trang tham chiếu (chữ thân) | #644A05 / #FFFDF8 | 8.19:1 | ✓ |
| tho | liên kết trên tint (chữ thân) | #644A05 / #FBF4E9 | 7.62:1 | ✓ |
| tho | liên kết trên nền kem nâng tham chiếu (chữ thân) | #644A05 / #FBF4E9 | 7.62:1 | ✓ |
| tho | liên kết trên panel tối tham chiếu (chữ thân) | #FED57C / #221710 | 12.54:1 | ✓ |
| tho · sand | liên kết trên trắng (chữ thân) | #625431 / #FFFFFF | 7.42:1 | ✓ |
| tho · sand | liên kết trên trang tham chiếu (chữ thân) | #625431 / #FFFDF8 | 7.29:1 | ✓ |
| tho · sand | liên kết trên tint (chữ thân) | #625431 / #FBF7EA | 6.92:1 | ✓ |
| tho · sand | liên kết trên nền kem nâng tham chiếu (chữ thân) | #625431 / #FBF4E9 | 6.79:1 | ✓ |
| tho · sand | liên kết trên panel tối tham chiếu (chữ thân) | #F6EBCC / #221710 | 14.75:1 | ✓ |
| tho · clay | liên kết trên trắng (chữ thân) | #201300 / #FFFFFF | 18.19:1 | ✓ |
| tho · clay | liên kết trên trang tham chiếu (chữ thân) | #201300 / #FFFDF8 | 17.89:1 | ✓ |
| tho · clay | liên kết trên tint (chữ thân) | #201300 / #FFF6E7 | 16.97:1 | ✓ |
| tho · clay | liên kết trên nền kem nâng tham chiếu (chữ thân) | #201300 / #FBF4E9 | 16.65:1 | ✓ |
| tho · clay | liên kết trên panel tối tham chiếu (chữ thân) | #EED7B1 / #221710 | 12.51:1 | ✓ |
| hoa | liên kết trên trắng (chữ thân) | #793B20 / #FFFFFF | 8.54:1 | ✓ |
| hoa | liên kết trên trang tham chiếu (chữ thân) | #793B20 / #FFFDF8 | 8.40:1 | ✓ |
| hoa | liên kết trên tint (chữ thân) | #793B20 / #FFF4F0 | 7.91:1 | ✓ |
| hoa | liên kết trên nền kem nâng tham chiếu (chữ thân) | #793B20 / #FBF4E9 | 7.81:1 | ✓ |
| hoa | liên kết trên panel tối tham chiếu (chữ thân) | #FED3C3 / #221710 | 12.79:1 | ✓ |
| hoa · plasma | liên kết trên trắng (chữ thân) | #66504B / #FFFFFF | 7.46:1 | ✓ |
| hoa · plasma | liên kết trên trang tham chiếu (chữ thân) | #66504B / #FFFDF8 | 7.34:1 | ✓ |
| hoa · plasma | liên kết trên tint (chữ thân) | #66504B / #FEF4F2 | 6.91:1 | ✓ |
| hoa · plasma | liên kết trên nền kem nâng tham chiếu (chữ thân) | #66504B / #FBF4E9 | 6.83:1 | ✓ |
| hoa · plasma | liên kết trên panel tối tham chiếu (chữ thân) | #FCE6DF / #221710 | 14.63:1 | ✓ |
| hoa · lava | liên kết trên trắng (chữ thân) | #280D00 / #FFFFFF | 18.30:1 | ✓ |
| hoa · lava | liên kết trên trang tham chiếu (chữ thân) | #280D00 / #FFFDF8 | 18.00:1 | ✓ |
| hoa · lava | liên kết trên tint (chữ thân) | #280D00 / #FFF4EF | 16.94:1 | ✓ |
| hoa · lava | liên kết trên nền kem nâng tham chiếu (chữ thân) | #280D00 / #FBF4E9 | 16.74:1 | ✓ |
| hoa · lava | liên kết trên panel tối tham chiếu (chữ thân) | #FED1BB / #221710 | 12.56:1 | ✓ |
| thuy | liên kết trên trắng (chữ thân) | #035763 / #FFFFFF | 8.24:1 | ✓ |
| thuy | liên kết trên trang tham chiếu (chữ thân) | #035763 / #FFFDF8 | 8.11:1 | ✓ |
| thuy | liên kết trên tint (chữ thân) | #035763 / #E7FBFF | 7.71:1 | ✓ |
| thuy | liên kết trên nền kem nâng tham chiếu (chữ thân) | #035763 / #FBF4E9 | 7.54:1 | ✓ |
| thuy | liên kết trên panel tối tham chiếu (chữ thân) | #99EEFF / #221710 | 13.38:1 | ✓ |
| thuy · mist | liên kết trên trắng (chữ thân) | #2E5E64 / #FFFFFF | 7.24:1 | ✓ |
| thuy · mist | liên kết trên trang tham chiếu (chữ thân) | #2E5E64 / #FFFDF8 | 7.12:1 | ✓ |
| thuy · mist | liên kết trên tint (chữ thân) | #2E5E64 / #EBFAFC | 6.76:1 | ✓ |
| thuy · mist | liên kết trên nền kem nâng tham chiếu (chữ thân) | #2E5E64 / #FBF4E9 | 6.62:1 | ✓ |
| thuy · mist | liên kết trên panel tối tham chiếu (chữ thân) | #CDF4F9 / #221710 | 14.94:1 | ✓ |
| thuy · ocean | liên kết trên trắng (chữ thân) | #011A21 / #FFFFFF | 17.93:1 | ✓ |
| thuy · ocean | liên kết trên trang tham chiếu (chữ thân) | #011A21 / #FFFDF8 | 17.64:1 | ✓ |
| thuy · ocean | liên kết trên tint (chữ thân) | #011A21 / #EAFAFF | 16.75:1 | ✓ |
| thuy · ocean | liên kết trên nền kem nâng tham chiếu (chữ thân) | #011A21 / #FBF4E9 | 16.41:1 | ✓ |
| thuy · ocean | liên kết trên panel tối tham chiếu (chữ thân) | #B6E1EF / #221710 | 12.52:1 | ✓ |
| moc | liên kết trên trắng (chữ thân) | #38570C / #FFFFFF | 8.28:1 | ✓ |
| moc | liên kết trên trang tham chiếu (chữ thân) | #38570C / #FFFDF8 | 8.14:1 | ✓ |
| moc | liên kết trên tint (chữ thân) | #38570C / #EFFCE3 | 7.77:1 | ✓ |
| moc | liên kết trên nền kem nâng tham chiếu (chữ thân) | #38570C / #FBF4E9 | 7.58:1 | ✓ |
| moc | liên kết trên panel tối tham chiếu (chữ thân) | #C5ED9C / #221710 | 13.33:1 | ✓ |
| moc · bamboo | liên kết trên trắng (chữ thân) | #505C3A / #FFFFFF | 7.16:1 | ✓ |
| moc · bamboo | liên kết trên trang tham chiếu (chữ thân) | #505C3A / #FFFDF8 | 7.04:1 | ✓ |
| moc · bamboo | liên kết trên tint (chữ thân) | #505C3A / #F4F9ED | 6.69:1 | ✓ |
| moc · bamboo | liên kết trên nền kem nâng tham chiếu (chữ thân) | #505C3A / #FBF4E9 | 6.55:1 | ✓ |
| moc · bamboo | liên kết trên panel tối tham chiếu (chữ thân) | #E5F1D2 / #221710 | 14.89:1 | ✓ |
| moc · forest | liên kết trên trắng (chữ thân) | #051D00 / #FFFFFF | 17.76:1 | ✓ |
| moc · forest | liên kết trên trang tham chiếu (chữ thân) | #051D00 / #FFFDF8 | 17.47:1 | ✓ |
| moc · forest | liên kết trên tint (chữ thân) | #051D00 / #ECFDE7 | 16.72:1 | ✓ |
| moc · forest | liên kết trên nền kem nâng tham chiếu (chữ thân) | #051D00 / #FBF4E9 | 16.26:1 | ✓ |
| moc · forest | liên kết trên panel tối tham chiếu (chữ thân) | #BDE5B0 / #221710 | 12.52:1 | ✓ |
| kim | liên kết trên trắng (chữ thân) | #65460B / #FFFFFF | 8.63:1 | ✓ |
| kim | liên kết trên trang tham chiếu (chữ thân) | #65460B / #FFFDF8 | 8.49:1 | ✓ |
| kim | liên kết trên tint (chữ thân) | #65460B / #FFF5E7 | 8.00:1 | ✓ |
| kim | liên kết trên nền kem nâng tham chiếu (chữ thân) | #65460B / #FBF4E9 | 7.90:1 | ✓ |
| kim | liên kết trên panel tối tham chiếu (chữ thân) | #FDD89F / #221710 | 12.94:1 | ✓ |
| kim · titanium | liên kết trên trắng (chữ thân) | #67543D / #FFFFFF | 7.21:1 | ✓ |
| kim · titanium | liên kết trên trang tham chiếu (chữ thân) | #67543D / #FFFDF8 | 7.09:1 | ✓ |
| kim · titanium | liên kết trên tint (chữ thân) | #67543D / #FDF5ED | 6.68:1 | ✓ |
| kim · titanium | liên kết trên nền kem nâng tham chiếu (chữ thân) | #67543D / #FBF4E9 | 6.60:1 | ✓ |
| kim · titanium | liên kết trên panel tối tham chiếu (chữ thân) | #FBE8D2 / #221710 | 14.67:1 | ✓ |
| kim · steel | liên kết trên trắng (chữ thân) | #1F1400 / #FFFFFF | 18.13:1 | ✓ |
| kim · steel | liên kết trên trang tham chiếu (chữ thân) | #1F1400 / #FFFDF8 | 17.83:1 | ✓ |
| kim · steel | liên kết trên tint (chữ thân) | #1F1400 / #FEF6E7 | 16.88:1 | ✓ |
| kim · steel | liên kết trên nền kem nâng tham chiếu (chữ thân) | #1F1400 / #FBF4E9 | 16.59:1 | ✓ |
| kim · steel | liên kết trên panel tối tham chiếu (chữ thân) | #ECD8B2 / #221710 | 12.55:1 | ✓ |

**Số cặp liên kết không đạt: 0.**

## Chữ trên nền strong (APCA cho chữ thân)

Ghép `--cs-accent-strong` với `--cs-accent-on-strong`: cả pack light và dark phải đạt ngưỡng chữ thân Lc ≥ 75 (mục tiêu của generator là 78) và WCAG ≥ 4.5:1. Nút primary ở chế độ dark dùng màu chữ đi cặp này. Các màu neo thương hiệu và tám vai trò accent còn lại giữ nguyên giá trị.
| Phạm vi | Chế độ | chữ / nền | Lc | Kết quả |
|---|---|---|---|---|
| tho | sáng | #FFFFFF / #916D10 | 78.4 | ✓ |
| tho | tối | #FFFFFF / #73560B | 88.5 | ✓ |
| tho · sand | sáng | #FFFFFF / #80724E | 78.3 | ✓ |
| tho · sand | tối | #FFFFFF / #665A37 | 88.5 | ✓ |
| tho · clay | sáng | #FFFFFF / #201300 | 106.9 | ✓ |
| tho · clay | tối | #FFFFFF / #1F1300 | 107.0 | ✓ |
| hoa | sáng | #FFFFFF / #A46146 | 78.5 | ✓ |
| hoa | tối | #FFFFFF / #8A4A30 | 88.0 | ✓ |
| hoa · plasma | sáng | #FFFFFF / #856E68 | 78.4 | ✓ |
| hoa · plasma | tối | #FFFFFF / #6F5750 | 87.9 | ✓ |
| hoa · lava | sáng | #FFFFFF / #280D00 | 106.9 | ✓ |
| hoa · lava | tối | #FFFFFF / #280D00 | 106.9 | ✓ |
| thuy | sáng | #FFFFFF / #0B7E8E | 78.2 | ✓ |
| thuy | tối | #FFFFFF / #046270 | 88.9 | ✓ |
| thuy · mist | sáng | #FFFFFF / #4B7B81 | 78.1 | ✓ |
| thuy · mist | tối | #FFFFFF / #316167 | 88.8 | ✓ |
| thuy · ocean | sáng | #FFFFFF / #011A21 | 106.7 | ✓ |
| thuy · ocean | tối | #FFFFFF / #011A21 | 106.7 | ✓ |
| moc | sáng | #FFFFFF / #528003 | 78.0 | ✓ |
| moc | tối | #FFFFFF / #416501 | 88.3 | ✓ |
| moc · bamboo | sáng | #FFFFFF / #6B7754 | 78.6 | ✓ |
| moc · bamboo | tối | #FFFFFF / #54603E | 88.2 | ✓ |
| moc · forest | sáng | #FFFFFF / #051D00 | 106.6 | ✓ |
| moc · forest | tối | #FFFFFF / #061D00 | 106.6 | ✓ |
| kim | sáng | #FFFFFF / #996A08 | 78.2 | ✓ |
| kim | tối | #FFFFFF / #795303 | 88.5 | ✓ |
| kim · titanium | sáng | #FFFFFF / #847058 | 78.3 | ✓ |
| kim · titanium | tối | #FFFFFF / #6B573E | 88.7 | ✓ |
| kim · steel | sáng | #FFFFFF / #1F1400 | 106.9 | ✓ |
| kim · steel | tối | #FFFFFF / #1F1400 | 106.9 | ✓ |

**Số cặp chữ thân trên nền strong không đạt: 0.** Đây là phép tính tĩnh cho cặp màu đã khai báo; kiểm tra hồi quy browser và kiểm tra template/raster thực tế có phạm vi riêng. Bảng này không chứng minh tương phản khi có độ trong suốt, gradient, chuyển tiếp hay lớp phủ tùy ý.

## Ngưỡng APCA của pack dark (đối chiếu gate)

Các ngưỡng đề xuất trong `_audit/apca-dark-preview.html`: bright ≥ 75 · accent ≥ 60 · on-strong/strong ≥ 75 · ink-on-tint ≥ 75. Accent và bright không phải vai trò chữ thân thông thường dùng được trên mọi nền.
| Pack | bright | accent | on | ink |
|---|---|---|---|---|
| tho | 75 | 69.2 | 88.5 | 76.8 |
| tho · sand | 93.8 | 92.7 | 88.5 | 91.5 |
| tho · clay | 76.7 | 60.4 | 107 | 76.2 |
| hoa | 84.2 | 68.2 | 88 | 81.9 |
| hoa · plasma | 93.2 | 91.2 | 87.9 | 90.9 |
| hoa · lava | 76.2 | 61.1 | 106.9 | 75.7 |
| thuy | 87.2 | 72.8 | 88.9 | 84.4 |
| thuy · mist | 94.7 | 94 | 88.8 | 92 |
| thuy · ocean | 76.1 | 60.1 | 106.7 | 75.1 |
| moc | 86.9 | 71.8 | 88.3 | 84.4 |
| moc · bamboo | 94.5 | 93.6 | 88.2 | 92 |
| moc · forest | 75 | 60.8 | 106.6 | 76.3 |
| kim | 85 | 69.2 | 88.5 | 82.6 |
| kim · titanium | 93.4 | 92.1 | 88.7 | 91.1 |
| kim · steel | 75.1 | 60.7 | 106.9 | 76.4 |

