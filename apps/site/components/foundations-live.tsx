'use client';
import dynamic from 'next/dynamic';

// The interactive blocks of Foundations → Motion and Color, each in its own chunk. Every docs page shares one route,
// so a plain import would ship them (and the Motion library) to every page; see lib/remark-lazy-demos.mjs.
// The import() sits outside dynamic(): written inline, the static export preloads chunk names it never emits (404s).
const lab = () => import('./motion-lab'), stages = () => import('./motion-stages'), color = () => import('./color-live');
export const CurveLab = dynamic(() => lab().then((m) => m.CurveLab));
export const SpringTuner = dynamic(() => lab().then((m) => m.SpringTuner));
export const MotionStages = dynamic(() => stages().then((m) => m.MotionStages));
export const ColorInUse = dynamic(() => color().then((m) => m.ColorInUse));
export const ColorComponents = dynamic(() => color().then((m) => m.ColorComponents));
