import { RawRecord } from './types';

export const DEFAULT_CSV_TEXT = `ปี,อำเภอ,หมู่บ้าน/ชุมชน,ผู้ป่วยเข้ารับบำบัด
2565,ปรางค์กู่,1,0
2565,เมืองศรีสะเกษ,3,17
2565,อุทุมพรพิสัย,1,10
2565,กันทรลักษ์,4,60
2565,กันทรารมย์,1,14
2565,ขุนหาญ,3,8
2565,ราษีไศล,1,1
2565,ไพรบึง,1,16
2565,ขุขันธ์,3,40
2565,โนนคูณ,1,3
2565,ภูสิงห์,1,18
2565,ศรีรัตนะ,2,29
2565,พยุห์,1,13
2565,ยางชุมน้อย,1,5
2565,วังหิน,1,9
2565,ศิลาลาด,1,6
2565,เบญจลักษ์,1,4
2565,เมืองจันทร์,1,9
2565,โพธิ์ศรีสุวรรณ,1,6
2565,บึงบูรพ์,1,7
2565,ห้วยทับทัน,1,3
2565,น้ำเกลี้ยง,1,4
2566,กันทรลักษ์,3,115
2566,กันทรารมย์,1,25
2566,ขุขันธ์,3,64
2566,ขุนหาญ,2,43
2566,ศรีรัตนะ,1,29
2566,น้ำเกลี้ยง,1,33
2566,บึงบูรพ์,1,17
2566,ปรางค์กู่,1,43
2566,ภูสิงห์,1,43
2566,เมืองศรีสะเกษ,2,60
2566,ห้วยทับทัน,1,20
2566,อุทุมพรพิสัย,1,57
2566,โนนคูณ,1,18
2566,ไพรบึง,1,21
2567,กันทรลักษ์,6,140
2567,กันทรารมย์,1,26
2567,ขุขันธ์,3,68
2567,ขุนหาญ,3,62
2567,ศรีรัตนะ,2,41
2567,น้ำเกลี้ยง,1,20
2567,บึงบูรพ์,1,15
2567,ปรางค์กู่,1,41
2567,พยุห์,1,17
2567,ภูสิงห์,1,21
2567,ยางชุมน้อย,1,20
2567,ราษีไศล,1,16
2567,วังหิน,1,30
2567,ศิลาลาด,1,23
2567,เมืองศรีสะเกษ,3,56
2567,ห้วยทับทัน,1,18
2567,อุทุมพรพิสัย,2,32
2567,เบญจลักษ์,1,16
2567,เมืองจันทร์,1,16
2567,โนนคูณ,1,16
2567,โพธิ์ศรีสุวรรณ,1,17
2567,ไพรบึง,1,32
2568,ปรางค์กู่,2,69
2568,เมืองศรีสะเกษ,6,120
2568,อุทุมพรพิสัย,2,58
2568,กันทรลักษ์,8,161
2568,กันทรารมย์,2,51
2568,ขุนหาญ,6,111
2568,ราษีไศล,2,51
2568,ไพรบึง,2,44
2568,ขุขันธ์,6,94
2568,โนนคูณ,2,38
2568,ภูสิงห์,2,37
2568,ศรีรัตนะ,4,63
2568,พยุห์,2,32
2568,ยางชุมน้อย,2,32
2568,วังหิน,2,30
2568,ศิลาลาด,2,30
2568,เบญจลักษ์,2,30
2568,เมืองจันทร์,2,30
2568,โพธิ์ศรีสุวรรณ,2,30
2568,บึงบูรพ์,2,29
2568,ห้วยทับทัน,2,27
2568,น้ำเกลี้ยง,2,26`;

export const DEFAULT_RAW_RECORDS: RawRecord[] = [
  { year: 2565, district: "ปรางค์กู่", villages: 1, patients: 0 },
  { year: 2565, district: "เมืองศรีสะเกษ", villages: 3, patients: 17 },
  { year: 2565, district: "อุทุมพรพิสัย", villages: 1, patients: 10 },
  { year: 2565, district: "กันทรลักษ์", villages: 4, patients: 60 },
  { year: 2565, district: "กันทรารมย์", villages: 1, patients: 14 },
  { year: 2565, district: "ขุนหาญ", villages: 3, patients: 8 },
  { year: 2565, district: "ราษีไศล", villages: 1, patients: 1 },
  { year: 2565, district: "ไพรบึง", villages: 1, patients: 16 },
  { year: 2565, district: "ขุขันธ์", villages: 3, patients: 40 },
  { year: 2565, district: "โนนคูณ", villages: 1, patients: 3 },
  { year: 2565, district: "ภูสิงห์", villages: 1, patients: 18 },
  { year: 2565, district: "ศรีรัตนะ", villages: 2, patients: 29 },
  { year: 2565, district: "พยุห์", villages: 1, patients: 13 },
  { year: 2565, district: "ยางชุมน้อย", villages: 1, patients: 5 },
  { year: 2565, district: "วังหิน", villages: 1, patients: 9 },
  { year: 2565, district: "ศิลาลาด", villages: 1, patients: 6 },
  { year: 2565, district: "เบญจลักษ์", villages: 1, patients: 4 },
  { year: 2565, district: "เมืองจันทร์", villages: 1, patients: 9 },
  { year: 2565, district: "โพธิ์ศรีสุวรรณ", villages: 1, patients: 6 },
  { year: 2565, district: "บึงบูรพ์", villages: 1, patients: 7 },
  { year: 2565, district: "ห้วยทับทัน", villages: 1, patients: 3 },
  { year: 2565, district: "น้ำเกลี้ยง", villages: 1, patients: 4 },
  { year: 2566, district: "กันทรลักษ์", villages: 3, patients: 115 },
  { year: 2566, district: "กันทรารมย์", villages: 1, patients: 25 },
  { year: 2566, district: "ขุขันธ์", villages: 3, patients: 64 },
  { year: 2566, district: "ขุนหาญ", villages: 2, patients: 43 },
  { year: 2566, district: "ศรีรัตนะ", villages: 1, patients: 29 },
  { year: 2566, district: "น้ำเกลี้ยง", villages: 1, patients: 33 },
  { year: 2566, district: "บึงบูรพ์", villages: 1, patients: 17 },
  { year: 2566, district: "ปรางค์กู่", villages: 1, patients: 43 },
  { year: 2566, district: "ภูสิงห์", villages: 1, patients: 43 },
  { year: 2566, district: "เมืองศรีสะเกษ", villages: 2, patients: 60 },
  { year: 2566, district: "ห้วยทับทัน", villages: 1, patients: 20 },
  { year: 2566, district: "อุทุมพรพิสัย", villages: 1, patients: 57 },
  { year: 2566, district: "โนนคูณ", villages: 1, patients: 18 },
  { year: 2566, district: "ไพรบึง", villages: 1, patients: 21 },
  { year: 2567, district: "กันทรลักษ์", villages: 6, patients: 140 },
  { year: 2567, district: "กันทรารมย์", villages: 1, patients: 26 },
  { year: 2567, district: "ขุขันธ์", villages: 3, patients: 68 },
  { year: 2567, district: "ขุนหาญ", villages: 3, patients: 62 },
  { year: 2567, district: "ศรีรัตนะ", villages: 2, patients: 41 },
  { year: 2567, district: "น้ำเกลี้ยง", villages: 1, patients: 20 },
  { year: 2567, district: "บึงบูรพ์", villages: 1, patients: 15 },
  { year: 2567, district: "ปรางค์กู่", villages: 1, patients: 41 },
  { year: 2567, district: "พยุห์", villages: 1, patients: 17 },
  { year: 2567, district: "ภูสิงห์", villages: 1, patients: 21 },
  { year: 2567, district: "ยางชุมน้อย", villages: 1, patients: 20 },
  { year: 2567, district: "ราษีไศล", villages: 1, patients: 16 },
  { year: 2567, district: "วังหิน", villages: 1, patients: 30 },
  { year: 2567, district: "ศิลาลาด", villages: 1, patients: 23 },
  { year: 2567, district: "เมืองศรีสะเกษ", villages: 3, patients: 56 },
  { year: 2567, district: "ห้วยทับทัน", villages: 1, patients: 18 },
  { year: 2567, district: "อุทุมพรพิสัย", villages: 2, patients: 32 },
  { year: 2567, district: "เบญจลักษ์", villages: 1, patients: 16 },
  { year: 2567, district: "เมืองจันทร์", villages: 1, patients: 16 },
  { year: 2567, district: "โนนคูณ", villages: 1, patients: 16 },
  { year: 2567, district: "โพธิ์ศรีสุวรรณ", villages: 1, patients: 17 },
  { year: 2567, district: "ไพรบึง", villages: 1, patients: 32 },
  { year: 2568, district: "ปรางค์กู่", villages: 2, patients: 69 },
  { year: 2568, district: "เมืองศรีสะเกษ", villages: 6, patients: 120 },
  { year: 2568, district: "อุทุมพรพิสัย", villages: 2, patients: 58 },
  { year: 2568, district: "กันทรลักษ์", villages: 8, patients: 161 },
  { year: 2568, district: "กันทรารมย์", villages: 2, patients: 51 },
  { year: 2568, district: "ขุนหาญ", villages: 6, patients: 111 },
  { year: 2568, district: "ราษีไศล", villages: 2, patients: 51 },
  { year: 2568, district: "ไพรบึง", villages: 2, patients: 44 },
  { year: 2568, district: "ขุขันธ์", villages: 6, patients: 94 },
  { year: 2568, district: "โนนคูณ", villages: 2, patients: 38 },
  { year: 2568, district: "ภูสิงห์", villages: 2, patients: 37 },
  { year: 2568, district: "ศรีรัตนะ", villages: 4, patients: 63 },
  { year: 2568, district: "พยุห์", villages: 2, patients: 32 },
  { year: 2568, district: "ยางชุมน้อย", villages: 2, patients: 32 },
  { year: 2568, district: "วังหิน", villages: 2, patients: 30 },
  { year: 2568, district: "ศิลาลาด", villages: 2, patients: 30 },
  { year: 2568, district: "เบญจลักษ์", villages: 2, patients: 30 },
  { year: 2568, district: "เมืองจันทร์", villages: 2, patients: 30 },
  { year: 2568, district: "โพธิ์ศรีสุวรรณ", villages: 2, patients: 30 },
  { year: 2568, district: "บึงบูรพ์", villages: 2, patients: 29 },
  { year: 2568, district: "ห้วยทับทัน", villages: 2, patients: 27 },
  { year: 2568, district: "น้ำเกลี้ยง", villages: 2, patients: 26 },
];
