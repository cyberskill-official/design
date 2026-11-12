'use client';
import { Star, TextB, TextItalic, TextUnderline } from '@phosphor-icons/react';
import { Toggle } from '@cyberskill/design';
import { useState } from 'react';

export function ToggleDemo() {
  const [favorite, setFavorite] = useState(false);
  return (
    <>
      <Toggle icon={<Star />} pressedIcon={<Star weight="fill" />} pressed={favorite} onPressedChange={setFavorite}>
        {favorite ? 'Favorited' : 'Favorite'}
      </Toggle>
      <Toggle icon={<Star />} defaultPressed>Pinned</Toggle>
      <Toggle disabled>Locked</Toggle>
    </>
  );
}

export function ToggleIconOnly() {
  return (
    <>
      <Toggle icon={<TextB />} label="Bold" defaultPressed />
      <Toggle icon={<TextItalic />} label="Italic" />
      <Toggle icon={<TextUnderline />} label="Underline" />
    </>
  );
}

export function ToggleSizes() {
  return (
    <>
      <Toggle size="sm" icon={<Star />}>Small</Toggle>
      <Toggle icon={<Star />}>Medium</Toggle>
      <Toggle size="lg" icon={<Star />}>Large</Toggle>
    </>
  );
}
