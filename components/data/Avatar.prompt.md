**Avatar / AvatarGroup** — image or auto-initials on Umber. Sizes sm/md/lg; `square` for app tiles; stack several in `AvatarGroup`.

```jsx
<Avatar name="Nguyễn Hoàng Vũ" />
<AvatarGroup><Avatar name="An" /><Avatar name="Bảo" /><Avatar name="Chi" /></AvatarGroup>
```

Keyboard: Avatar and AvatarGroup add no keyboard action. A surrounding link/button owns focus and activation.

Localization: The supplied name provides image alt text and up to two initials. Initials are decorative; provide nearby identity text or an explicit image role/name when an initials-only avatar conveys identity. There is no built-in translated name.

Source evidence: `Avatar.jsx` and `Avatar.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
