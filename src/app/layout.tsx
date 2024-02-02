"use client";

import { pdfjs } from "react-pdf";
import "./globals.css";
import { ProfessorProvider } from "@/contexts/ProfessorContext";

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <ProfessorProvider>
    <html lang="en" className="w-full h-full box-border">
      <body className="w-full h-full box-border">{children}</body>
    </html>
  </ProfessorProvider>
);

export default RootLayout;
