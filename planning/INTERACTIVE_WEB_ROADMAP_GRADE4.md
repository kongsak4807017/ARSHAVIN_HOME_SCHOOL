# แผนพัฒนาสื่อ Interactive Web ชั้น ป.4

วันที่จัดทำ: 19 กรกฎาคม 2569
สถานะ: **รออนุมัติการสร้าง Scheduled Task**

## 1. เป้าหมาย

พัฒนาเว็บไซต์สื่อการเรียนรู้แบบบูรณาการภาษาไทย–อังกฤษสำหรับชั้นประถมศึกษาปีที่ 4 จากหลักสูตร 5 รายวิชา 52 บท ให้ใช้งานได้บน GitHub Pages โดยมีคุณสมบัติหลักดังนี้

1. บทเรียน interactive แบบใช้ได้ทั้งคอมพิวเตอร์ แท็บเล็ต และโทรศัพท์
2. แบบฝึกหัดตรวจคำตอบและให้คำอธิบายย้อนกลับทันที
3. ใบงานขนาด A4 ที่สั่งพิมพ์หรือบันทึกเป็น PDF ได้
4. โหมดผู้เรียน ผู้ปกครอง และผู้สอน
5. ภาษาไทย–อังกฤษในระดับที่เหมาะกับ ป.4
6. รองรับการใช้งานออฟไลน์หรืออินเทอร์เน็ตไม่เสถียร
7. ไม่บังคับสมัครบัญชี และไม่ส่งข้อมูลเด็กออกจากเครื่องเป็นค่าเริ่มต้น
8. รองรับการเข้าถึงตามหลัก WCAG 2.2 ระดับ AA เท่าที่เหมาะสมกับ static web

## 2. หลักการออกแบบ

### 2.1 Static-first

ใช้ HTML, CSS และ JavaScript มาตรฐาน โดยลด dependency ภายนอก เพื่อให้เปิดได้รวดเร็ว ดูแลต่อได้ง่าย และ deploy บน GitHub Pages ได้ทันที

### 2.2 Privacy-first และ child-safe

- ไม่มีโฆษณา ตัวติดตาม หรือ social widget
- ไม่เก็บชื่อจริง วันเกิด ที่อยู่ ภาพถ่าย หรือข้อมูลสุขภาพ
- ความก้าวหน้าเก็บด้วย localStorage/IndexedDB ในอุปกรณ์
- มีปุ่มล้างข้อมูลทั้งหมด
- ลิงก์ภายนอกต้องผ่านหน้าคำเตือนสำหรับผู้ปกครอง
- ไม่มีแชตสาธารณะ การอัปโหลดภาพ หรือการติดต่อคนแปลกหน้า

### 2.3 Accessible and inclusive

- ใช้งานด้วยคีย์บอร์ดได้
- focus indicator ชัดเจน
- ปุ่มและพื้นที่สัมผัสมีขนาดเหมาะสม
- สีไม่เป็นช่องทางเดียวในการสื่อความหมาย
- รองรับการขยายตัวอักษรและ reduced motion
- มี alt text และคำอธิบายภาพ
- ใช้ภาษาง่าย พร้อมคำศัพท์สองภาษา

### 2.4 Print-first worksheets

ใบงานทุกบทใช้ CSS สำหรับสื่อพิมพ์:

```css
@page {
  size: A4 portrait;
  margin: 12mm 14mm;
}

@media print {
  .no-print { display: none !important; }
  .worksheet { break-after: page; }
}
```

ออกแบบให้พิมพ์ขาวดำได้ดี ใช้พื้นที่เขียนเพียงพอ มีชื่อ–วันที่–บทเรียน และไม่ตัดกิจกรรมกลางหน้า

## 3. สถาปัตยกรรมเว็บไซต์

```text
/
├─ index.html
├─ subjects/
│  ├─ human-body/
│  ├─ ai-science/
│  ├─ environment/
│  ├─ maker-engineering/
│  └─ citizenship/
├─ worksheets/
│  ├─ student/
│  └─ teacher-guides/
├─ projects/
├─ parent/
├─ teacher/
├─ assets/
│  ├─ css/
│  ├─ js/
│  ├─ icons/
│  └─ illustrations/
├─ data/
│  ├─ curriculum.json
│  ├─ lessons/
│  └─ vocabulary/
├─ manifest.webmanifest
├─ service-worker.js
└─ 404.html
```

## 4. โครงสร้างหน้าเรียนหนึ่งบท

แต่ละบทประกอบด้วย 12 ส่วน

1. ชื่อบทไทย–อังกฤษ
2. คำถามนำเข้า
3. เป้าหมายการเรียนรู้แบบเด็กอ่านเข้าใจ
4. คำศัพท์สำคัญพร้อมเสียงอ่านในระยะต่อไป
5. เนื้อหาแบบสั้นเป็นช่วง
6. ภาพ แผนผัง หรือ simulation ง่าย
7. กิจกรรมลงมือทำ
8. แบบฝึกหัด interactive 5–10 ข้อ
9. feedback อธิบายเหตุผล ไม่ใช่เพียงถูก–ผิด
10. Exit ticket
11. ใบงาน A4 และปุ่ม Print/Save PDF
12. Parent/Teacher note และหลักฐานที่ควรเก็บใน portfolio

## 5. รูปแบบกิจกรรม Interactive

เลือกใช้ให้เหมาะกับเนื้อหา ไม่ใช้แม่แบบเดียวทุกบท

- จับคู่คำศัพท์และความหมาย
- เรียงลำดับกระบวนการ
- เลือกหลักฐานที่สนับสนุนข้อสรุป
- ลากวางป้ายกำกับ โดยต้องมีทางเลือกแบบคลิกสำหรับ accessibility
- จำแนกข้อมูล fact/opinion และ safe/unsafe
- ปรับตัวแปร simulation อย่างง่าย
- อ่านกราฟ ตาราง และภาพข้อมูล
- ตรวจข้อผิดพลาดของ AI
- ออกแบบชิ้นงานด้วย design canvas
- สถานการณ์ตัดสินใจด้านสุขภาพ สิ่งแวดล้อม และพลเมือง

## 6. ระบบแบบฝึกหัดและประเมินผล

### 6.1 การประเมิน 4 ระดับ

- Recall: จำและระบุ
- Understand: อธิบายด้วยคำของตนเอง
- Apply: ใช้กับสถานการณ์ใหม่
- Create/Reflect: สร้างชิ้นงานและสะท้อนคิด

### 6.2 รูปแบบผลลัพธ์

- คะแนนรายบทเพื่อการเรียนรู้ ไม่ใช้จัดอันดับเด็ก
- feedback รายข้อ
- แสดงหัวข้อที่ควรทบทวน
- บันทึกความก้าวหน้าในอุปกรณ์
- ส่งออกสรุปเป็นไฟล์ JSON/พิมพ์ A4 ในระยะถัดไป

### 6.3 Teacher answer key

เว็บไซต์ GitHub Pages เป็นระบบสาธารณะ จึงไม่สามารถซ่อนเฉลยด้วย JavaScript หรือรหัสผ่านแบบ client-side ได้อย่างปลอดภัย แผนที่เหมาะสมคือ:

1. หน้าเว็บผู้เรียนไม่มีเฉลยรวม
2. feedback แสดงหลังตอบตามวัตถุประสงค์การเรียนรู้
3. คู่มือผู้สอนและ rubric แยกเป็นไฟล์ในโฟลเดอร์ teacher-guides
4. ถ้าต้องการปกปิดเฉลยจริง ต้องใช้ private repository หรือระบบ backend/authentication แยกต่างหาก

## 7. ชุดใบงาน A4

ทุกบทมีอย่างน้อย 2 แผ่น

1. **Core worksheet** — ความเข้าใจและการประยุกต์
2. **Investigation/Project worksheet** — ทดลอง เก็บข้อมูล ออกแบบ หรือสะท้อนคิด

รวมขั้นต่ำ 104 ใบงานสำหรับ 52 บท พร้อม:

- rubric แบบ 4 ระดับ
- checklist ความปลอดภัยตามกิจกรรม
- vocabulary box ไทย–อังกฤษ
- evidence box สำหรับภาพ วัดผล ตาราง หรือคำอธิบาย
- QR/link กลับไปหน้าบทเรียน แต่ไม่บังคับใช้โทรศัพท์

## 8. เนื้อหาที่ต้องเพิ่มจากหลักสูตรเดิม

### ทุกวิชา

- Information literacy และการตรวจสอบหลักฐาน
- ภาษาอังกฤษเพื่อใช้สื่อสารจริง ไม่ใช่เพียงท่องศัพท์
- การอ่านกราฟ ตาราง และข้อมูล
- ความปลอดภัย การขอความช่วยเหลือ และบทบาทผู้ใหญ่
- portfolio evidence และ student reflection
- บริบทเชียงราย ชุมชน ครอบครัว และสิ่งแวดล้อมท้องถิ่น

### ร่างกายมนุษย์

- การนอน หน้าจอ ท่าทาง สุขอนามัย PM2.5 และการอ่านฉลาก
- ไม่วินิจฉัยโรค และมีข้อความให้ปรึกษาผู้ใหญ่/บุคลากรสุขภาพเมื่อจำเป็น

### วิทยาศาสตร์ AI

- ข้อมูลฝึก AI, bias, hallucination, privacy, deepfake และ human oversight
- ห้ามขอให้เด็กส่งข้อมูลส่วนบุคคลหรือภาพใบหน้าเข้า AI ภายนอก

### สิ่งแวดล้อม

- climate mitigation, adaptation, resilience, AQI, waste audit และ biodiversity

### เครื่องมือช่างและการประดิษฐ์

- hazard identification, measurement tolerance, design-test-improve และ low-voltage safety
- กิจกรรมเสี่ยงต้องระบุ adult supervision และใช้วัสดุปลอดภัยตามวัย

### พลเมืองไทย

- digital citizenship, misinformation, AI-generated media, consent, privacy, cyberbullying และ civic action

## 9. มาตรฐานคุณภาพและ Definition of Done

หนึ่งบทถือว่าเสร็จเมื่อ:

- เนื้อหาตรงกับแผนหลักสูตรและระดับ ป.4
- มีข้อความไทย–อังกฤษที่ตรวจความหมายแล้ว
- มี interactive activity อย่างน้อย 1 แบบ
- มีแบบฝึกหัดอย่างน้อย 5 ข้อพร้อม feedback
- มีใบงาน A4 อย่างน้อย 2 หน้า
- ใช้งานบนมือถือและคีย์บอร์ดได้
- ไม่มี console error
- ผ่านการตรวจลิงก์
- พิมพ์ A4 ไม่ล้นหรือตัดเนื้อหา
- มีแหล่งอ้างอิงของผู้สอนใน metadata
- ไม่มีการเก็บข้อมูลเด็กออกจากอุปกรณ์

## 10. แผนดำเนินงานแบบรอบละ 2 ชั่วโมง

เวลาที่เสนอในเขตเวลา Asia/Bangkok:

- 12:15
- 14:15
- 16:15
- 18:15
- 20:15
- 22:15

รวม 6 รอบต่อวัน

### งานที่ต้องทำทุกครั้งก่อนแก้ repository

1. อ่าน README, roadmap, progress ledger และ commit ล่าสุด
2. ตรวจว่ามีงานใหม่จากผู้พัฒนาหรือ agent อื่นหรือไม่
3. ทำเฉพาะงานที่ยังไม่ซ้ำและมี acceptance criteria ชัดเจน
4. ตรวจข้อมูลวิชาการจากแหล่งปฐมภูมิหรือองค์การที่น่าเชื่อถือ
5. สร้างหรือแก้ไขไฟล์
6. รัน validation ตามชนิดงาน
7. commit พร้อมบันทึกสิ่งที่เปลี่ยน หลักฐาน และงานถัดไป

### ลำดับ milestone

#### M0 — Foundation and governance

- information architecture
- design tokens และ component library
- bilingual content schema
- safety/privacy/accessibility policy
- GitHub Pages workflow
- progress dashboard

#### M1 — Working vertical slice

สร้างบทตัวอย่างครบวงจร 1 บทต่อรายวิชา รวม 5 บท เพื่อพิสูจน์ระบบก่อนผลิตจำนวนมาก

#### M2 — Core learning engine

- lesson renderer
- quiz engine
- local progress
- print engine
- vocabulary and glossary
- offline cache

#### M3 — Content production 52 lessons

ผลิตทีละกลุ่ม โดยแต่ละรอบทำงานที่ทดสอบและ commit ได้จริง ไม่เปิดงานพร้อมกันมากเกินไป

#### M4 — A4 worksheet library

สร้างใบงานอย่างน้อย 104 ชุด พร้อม rubric และ teacher guide

#### M5 — Integrated projects

เพิ่มโครงงานบูรณาการ 5 โครงงาน พร้อม project journal และ exhibition rubric

#### M6 — QA and release

- mobile/desktop QA
- accessibility QA
- print QA
- content and bilingual review
- offline test
- release notes และ deployment guide

## 11. การจัดสรรงานต่อรอบ

หนึ่งรอบควรส่งมอบงานที่จบเป็นหน่วย เช่น:

- 1 component ที่มี test/demo ครบ
- 1 บทเรียนเต็มพร้อมใบงาน
- 2–3 ใบงานที่ผ่าน print QA
- 1 ชุดตรวจ accessibility หรือ content QA

ไม่กำหนดจำนวนไฟล์ตายตัว เพราะคุณภาพ ความยาว และความซับซ้อนแต่ละบทต่างกัน

## 12. ระบบติดตามความก้าวหน้า

เพิ่มไฟล์ต่อไปนี้เมื่อเริ่มดำเนินงาน:

- `PROGRESS.md` — สถานะ milestone และจำนวนบทที่ผ่านเกณฑ์
- `DECISIONS.md` — บันทึกการตัดสินใจสำคัญ
- `CONTENT_SOURCES.md` — แหล่งข้อมูลและวันที่ตรวจสอบ
- `QA_REPORT.md` — ผลตรวจเว็บ ใบงาน และ accessibility
- `CHANGELOG.md` — การเปลี่ยนแปลงสำหรับผู้ใช้

ตัวชี้วัดหลัก:

- Lessons complete / 52
- Interactive activities complete / 52+
- Student worksheets complete / 104+
- Teacher guides complete / 52
- Print QA pass rate
- Accessibility QA pass rate
- Broken links
- Unresolved safety/content issues

## 13. ความเสี่ยงและมาตรการควบคุม

| ความเสี่ยง | มาตรการ |
|---|---|
| ผลิต 52 บทเร็วเกินจนใช้แม่แบบซ้ำ | ทำ vertical slice และ quality gate ก่อน scale |
| เฉลยถูกเปิดเผยในเว็บสาธารณะ | แยก teacher guide และไม่อ้างว่า client-side password ปลอดภัย |
| เด็กกรอกข้อมูลส่วนตัว | ไม่ออกแบบช่องข้อมูลส่วนตัวและใช้ local-only storage |
| ใช้งานในพื้นที่อินเทอร์เน็ตอ่อน | static assets, caching และลด dependency |
| ใบงานพิมพ์ไม่พอดี | print preview QA ใน Chrome/Edge และ PDF reference |
| เนื้อหาล้าสมัย | metadata แหล่งอ้างอิงและ review date |
| งาน schedule ทับกับ commit อื่น | change-aware preflight ก่อนทุก commit |

## 14. รูปแบบ Scheduled Task ที่เสนอ

**ชื่อ:** ARSHAVIN Interactive Learning Build

**ตารางเวลา:** ทุกวัน เวลา 12:15, 14:15, 16:15, 18:15, 20:15 และ 22:15 ตามเวลา Asia/Bangkok

**หลักการทำงาน:** ตรวจ repository และงานล่าสุดก่อนทุกครั้ง ศึกษาแหล่งข้อมูลที่เกี่ยวข้อง พัฒนางานตาม milestone ที่ยังไม่เสร็จ ทดสอบ บันทึกหลักฐาน และ commit งานที่สมบูรณ์เป็นหน่วย โดยไม่เขียนทับงานอื่น

ยังไม่สร้าง Scheduled Task จนกว่าจะได้รับอนุมัติจากเจ้าของโครงการ
