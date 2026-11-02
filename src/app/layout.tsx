import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ระบบศูนย์ข้อมูลการบำบัดฟื้นฟูผู้ติดยาเสพติด จังหวัดศรีสะเกษ | Sisaket Drug Rehab Dashboard',
  description: 'แดชบอร์ดประมวลผลข้อมูลการบำบัดฟื้นฟูผู้ติดยาเสพติด 22 อำเภอ จังหวัดศรีสะเกษ แบบ Real-time On the Fly เชื่อมโยง Google Sheet & Google Drive',
  keywords: ['ศรีสะเกษ', 'บำบัดยาเสพติด', 'Google Sheet Dashboard', 'On the Fly Data', 'Sisaket'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body>{children}</body>
    </html>
  );
}
