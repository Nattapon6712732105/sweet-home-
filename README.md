# 🌸 ระบบศูนย์ข้อมูลการบำบัดฟื้นฟูผู้ติดยาเสพติด จังหวัดศรีสะเกษ
### Sisaket Drug Rehabilitation Dynamic Data Visualisation Dashboard (On the Fly)

เว็บแอปพลิเคชันแดชบอร์ดประมวลผลข้อมูลการบำบัดฟื้นฟูผู้ติดยาเสพติด 22 อำเภอ จังหวัดศรีสะเกษ พัฒนาด้วย **Next.js (App Router)** เชื่อมโยงข้อมูลกับ **Google Drive** และ **Google Sheet** แบบ **Real-time On the Fly** (ประมวลผลคำนวณสถิติสดใหม่ทุกครั้งที่มีการร้องขอ โดยไม่มีการแคชถาวร) พร้อมการตกแต่งตามอัตลักษณ์ประจำ **จังหวัดศรีสะเกษ** (ดอกลำดวน, โทนสีแสด-ขาว, และปราสาทขอมโบราณ)

---

## 🌟 จุดเด่นของระบบ (Key Features)

- **⚡ Real-time On-the-Fly Processing**: ดึงข้อมูลและคำนวณสถิติสดใหม่ทันทีจาก Google Sheet ผ่าน API Route `/api/sheets` เมื่อมีการแก้ไขตัวเลขใน Google Sheet หน้าแดชบอร์ดจะคำนวณค่าใหม่ทันที
- **🔄 Auto-Sync & Focus Detection**: มีระบบตรวจเช็คข้อมูลใหม่ทุกๆ 20 วินาที และมีระบบตรวจจับการสลับหน้าต่าง (Window Focus Re-fetch) เมื่อผู้ดูแลแก้ไขข้อมูลใน Google Sheet แล้วสลับกลับมาที่หน้าเว็บ ระบบจะอัปเดตสถิติทันทีโดยไม่ต้องกดรีเฟรชเอง
- **🛡️ Data Security & Protection**: ฝังและคุ้มครองลิงก์ Google Sheet ไว้ที่ระดับ Server-side Backend เพื่อป้องกันไม่ให้บุคคลภายนอกหรือผู้เข้าชมทั่วไปแก้ไขหรือดัดแปลงแหล่งข้อมูล
- **📊 5 Dynamic KPI Cards**:
  1. จำนวนผู้ป่วยเข้ารับบำบัดสะสม (รวม 2,806 ราย)
  2. จำนวนหมู่บ้าน/ชุมชนเป้าหมาย (151 แห่ง)
  3. อัตราเฉลี่ยผู้ป่วยต่อชุมชน (18.58 คน/ชุมชน)
  4. พื้นที่เฝ้าระวังสูงสุด (อ.กันทรลักษ์ 476 ราย)
  5. การแบ่งระดับความเสี่ยง 3 ระดับ (🔴 วิกฤต >50 ราย, 🟠 ปานกลาง 20-50 ราย, 🟢 เฝ้าระวัง <20 ราย)
- **📈 Multi-Year Comparative Trend**: กราฟแท่งเปรียบเทียบแนวโน้มรายปี (พ.ศ. 2565 - 2568) พร้อมคำนวณอัตราการเปลี่ยนแปลง % YoY และ Interactive Tooltip
- **🏆 Horizontal District Ranking**: กราฟแท่งแนวนอนจัดอันดับอำเภอตามจำนวนผู้ป่วย พร้อมแยกสีตามระดับความเสี่ยง
- **🗺️ 22 Districts Sisaket Matrix**: การ์ดแสดงผลสรุป 22 อำเภอของจังหวัดศรีสะเกษ พร้อม Sparklines แนวโน้มย้อนหลัง 4 ปี และระบบค้นหา/กรองตามระดับความเสี่ยง
- **🔍 District Deep-Dive Modal**: คลิกดูข้อมูลเจาะลึกรายอำเภอ แสดงสถิติย้อนหลัง 4 ปี อัตราส่วนต่อชุมชน และข้อเสนอแนะเชิงยุทธศาสตร์
- **📋 Filterable Data Table**: ตารางข้อมูลดิบที่สามารถค้นหา เรียงลำดับคอลัมน์ แบ่งหน้า (Pagination) และส่งออกเป็นไฟล์ CSV ที่ผ่านการกรองได้

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
sweethome/
├── public/
│   ├── data/
│   │   └── sisaket_rehab_data.csv    # ชุดข้อมูล CSV มาตรฐาน
│   └── images/
│       ├── sisaket_banner.jpg        # ภาพแบนเนอร์ดอกลำดวนและปราสาทขอม
│       └── sisaket_seal.jpg          # ตราสัญลักษณ์ดอกลำดวนสีทอง
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── sheets/route.ts       # Dynamic API Route ดึงและประมวลผล Google Sheet on-the-fly
│   │   ├── globals.css               # ระบบดีไซน์โทนสีแสด-ขาว-ทอง Glassmorphism
│   │   ├── layout.tsx                # โครงสร้าง Layout และ Meta Tags
│   │   └── page.tsx                  # หน้าแดชบอร์ดหลักและการจัดการ State
│   ├── components/
│   │   ├── DataTable.tsx             # ตารางข้อมูลดิบ ค้นหา จัดลำดับ ส่งออก CSV
│   │   ├── DistrictGrid.tsx          # เมทริกซ์ 22 อำเภอ พร้อม Sparkline
│   │   ├── DistrictModal.tsx         # หน้าต่างเจาะลึกสถิติรายอำเภอ
│   │   ├── DistrictRankingChart.tsx  # กราฟจัดอันดับอำเภอแนวนอน
│   │   ├── KPICards.tsx              # การ์ดสรุปตัวชี้วัดสำคัญ
│   │   ├── SisaketHeader.tsx         # ส่วนหัวอัตลักษณ์ศรีสะเกษและปุ่มฟังก์ชัน
│   │   └── YearlyTrendChart.tsx      # กราฟเปรียบเทียบแนวโน้มรายปี
│   └── lib/
│       ├── defaultData.ts            # ข้อมูลสำรอง 22 อำเภอ 4 ปี (2565-2568)
│       ├── parser.ts                 # ตัวแปลง CSV และระบบคำนวณสถิติ On-the-Fly
│       ├── sheets.ts                 # ตัวเชื่อมต่อ Google Sheets API/CSV Endpoint
│       └── types.ts                  # TypeScript Interfaces และ Types
├── .env.example                      # ตัวอย่างการกำหนดค่า Environment Variables
├── .env.local                        # การกำหนดค่า Environment Variables ในเครื่อง
├── vercel.json                       # การตั้งค่า Deploy บน Vercel (Region: Singapore sin1)
└── package.json
```

---

## 🚀 การติดตั้งและเริ่มใช้งาน (Getting Started)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รันเซิร์ฟเวอร์สำหรับทดสอบ (Development)
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

### 3. ทดสอบสร้าง Production Build
```bash
npm run build
npm run start
```

---

## ⚙️ การตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` ในโฟลเดอร์หลักของโปรเจกต์:
```env
NEXT_PUBLIC_GOOGLE_SHEET_URL="https://docs.google.com/spreadsheets/d/1aPuNopIwNKeN3HlA413IFbjG2feiNGuKvQ6PJA2y8UM/edit?usp=sharing"
GOOGLE_SHEET_URL="https://docs.google.com/spreadsheets/d/1aPuNopIwNKeN3HlA413IFbjG2feiNGuKvQ6PJA2y8UM/edit?usp=sharing"
```

---

## ☁️ การ Deploy ขึ้น Vercel

โปรเจกต์นี้รองรับการ Deploy บน Vercel ทันทีโดยไม่ต้องตั้งค่าเพิ่มเติม:

1. **Push โค้ดขึ้น GitHub**:
   ```bash
   git push -u origin main
   ```
2. **เปิด Vercel**: ไปที่ [vercel.com/new](https://vercel.com/new)
3. **Import Project**: เลือกคลัง Repository `sweet-home-` แล้วคลิก **Import**
4. **กด Deploy**: คลิกปุ่ม **Deploy** สีฟ้า ระบบจะทำการ Build และสร้าง URL ใช้งานจริงให้อัตโนมัติภายใน 1 นาที

---

## 🏛️ อัตลักษณ์ประจำจังหวัดศรีสะเกษ
- **ดอกไม้ประจำจังหวัด**: ดอกลำดวน (White Cheesewood)
- **สีประจำจังหวัด**: สีแสดและสีขาว
- **คำขวัญประจำจังหวัด**: *"แดนปราสาทขอม ดอกลำดวนบาน กระเทียมดี ข้าวสารหอม ผ้าไหมงาม ดินดำน้ำชุ่ม จิตใจโอบอ้อมอารี"*

---
ศูนย์ปฏิบัติการข้อมูลการบำบัดฟื้นฟูผู้ติดยาเสพติด จังหวัดศรีสะเกษ • พัฒนาด้วย Next.js 16 & Vercel
