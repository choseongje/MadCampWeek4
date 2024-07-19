import "./globals.css";

export const metadata = {
  title: "Spotify Visualizer",
  description: "A Spotify music visualizer using Next.js and TypeScript",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
