import '@cyberskill/design/styles.css';

export const metadata = { title: 'Hello, CyberSkill' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
