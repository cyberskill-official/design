export type BrandPack = {
  element: string;
  intensity: "soft" | "middle" | "deep";
  name: string;
  label: string;
};
export function listBrandPacks(): BrandPack[];
export function resolveBrandPack(input: string | { element: string; intensity?: string; name?: string } | null | undefined): BrandPack | null;
export function applyBrandPack(input: string | { element: string; intensity?: string; name?: string }, root: { setAttribute: Function; removeAttribute: Function }): BrandPack | null;
