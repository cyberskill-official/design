"use client";

import { Button } from "@cyberskill/react";
import { ThemeProvider, getThemeInitScript } from "@cyberskill/themes";

const boot = getThemeInitScript({ defaultTheme: "system" });

export default function Page() {
  return (
    <ThemeProvider theme="dark" contrast="high">
      <script dangerouslySetInnerHTML={{ __html: boot }} />
      <Button variant="primary">next-canary</Button>
    </ThemeProvider>
  );
}
