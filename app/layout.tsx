import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CrunchPop | Pipoca como sobremesa",
  description:
    "Pipocas caramelizadas, cobertas com chocolates e cremes selecionados. Preparadas diariamente em pequenos lotes.",
  openGraph: {
    title: "CrunchPop",
    description: "Pipoca, como você nunca experimentou."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
