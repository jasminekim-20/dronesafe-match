import "./globals.css";
export const metadata = {
  title: "DroneSafe Match",
  description: "드론 촬영 조종자 매칭 플랫폼",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
