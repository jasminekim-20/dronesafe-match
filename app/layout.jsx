import "./globals.css";

export const metadata = {
  title: "DroneSafeMatch",
  description: "허가 가능한 드론 조종자 매칭 플랫폼",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
