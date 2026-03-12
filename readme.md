```markdown
# ระบบประเมินความพึงพอใจงานซ่อม (SENA) — สถานะปัจจุบัน

เอกสารนี้สรุปสถานะปัจจุบันของโค้ด (frontend + backend) และขั้นตอนการปรับใช้/ทดสอบ ให้สอดคล้องกับการเปลี่ยนแปลงล่าสุด

เวอร์ชันที่แก้ไขล่าสุด: Frontend: `ระบบประเมินความพึงพอใจงานซ่อม V.1.4.html` | Backend: Google Apps Script (ไฟล์ใน `Backend code.txt`)

---

## โครงสร้างไฟล์ (Project files)

- `ระบบประเมินความพึงพอใจงานซ่อม V.1.4.html` — หน้า frontend ของแอป (สร้าง QR, แสดงผลหลังสแกน, แบบสอบถาม และการส่งข้อมูล)
- `Backend code.txt` — โค้ด Google Apps Script (doGet / doPost) ที่เชื่อมต่อกับ Google Sheets
- `LOGO-SENA.png` — โลโก้ที่ใช้บนหน้าเว็บ
- `readme.md` — เอกสารฉบับนี้

---

## สรุปการเปลี่ยนแปลงสำคัญ (ล่าสุด)

หมายเหตุ: รายการด้านล่างสะท้อนสถานะปัจจุบันของโค้ดตามที่แก้แล้วใน repository นี้

- Frontend (V.1.4):
  - ลบหน้า "นโยบายคุ้มครองข้อมูลส่วนบุคคล" และ Spinner ออกจาก flow — หลังจากสแกน QR ระบบจะพาผู้ตอบไปยังแบบสอบถามทันที
  - เปลี่ยน UX ให้แสดงแบบสอบถามทันที และรันการตรวจสอบใบงานซ้ำ (duplicate check) เป็นงาน background แบบไม่บล็อก (หากพบซ้ำ จะตั้ง flag เพื่อบล็อกการส่งเมื่อผู้ใช้กดส่ง)
  - เอาออก: การเก็บ `deviceId` (ถูกลบทั้งฝั่ง frontend และ backend ตามคำขอ)
  - เก็บ `houseNumber` (บ้านเลขที่) จากหน้าสร้าง QR และส่งเป็นพารามิเตอร์ `houseNumber` ให้ backend (จะถูกบันทึกลงคอลัมน์ `Unit` ในชีท)
  - เก็บ IP สาธารณะของผู้ตอบโดยเรียก `https://api.ipify.org?format=json` แล้วส่งเป็น `userIp` ให้ backend (backend จะเก็บในรูป HMAC hash)
  - ลบลิงก์ทดสอบ/ปุ่ม "เปิดแบบสอบถาม" (QA controls) ออกจากหน้าสร้าง QR เพื่อเตรียมใช้งานจริง

- Backend (Google Apps Script):
  - เขียนข้อมูลโดยแมปคอลัมน์ตามชื่อหัวตาราง (header-by-name) แทนการ rely กับตำแหน่งคอลัมน์แบบคงที่ — ลดปัญหาลำดับคอลัมน์สลับ
  - การค้นหาหัวตารางเป็น case-insensitive และมี alias สำหรับคอลัมน์ `Unit` (เช่น `บ้านเลขที่`, `บ้านเลขที่ / Unit` ฯลฯ) เพื่อให้การแมปคอลัมน์ทนทานต่อชื่อที่ต่างกัน
  - เก็บค่า IP ในชีทเป็น HMAC-SHA256 (prefix `hmac_`) โดยอ่าน secret จาก Script Properties (หากยังไม่มี สร้างขึ้นอัตโนมัติ)
  - เอาออก: คอลัมน์/ฟิลด์ `deviceId` และฟิลด์นโยบายส่วนบุคคล (policy accept fields) ตามคำขอ
  - เพิ่ม debug Logger.log ใน `doPost` เพื่อให้คุณตรวจสอบ `e.parameter` และแถวที่จะถูก append (แนะนำให้ดู Execution logs หลังทดสอบ)

---

## Contract / Data shape (สรุปสั้น ๆ)

- Frontend → Backend (POST form-data):
  - `responseId` (string)
  - `workOrderIds` (comma separated string)
  - `houseNumber` (string)  -> mapped to `Unit` column on sheet
  - `userIp` (string) -> backend hashes this and stores as `IP` column
  - rating fields, comment, timestamp handled by backend

- Backend writes to `SurveyResponses` sheet using header-by-name mapping. Error modes: missing required fields will be logged; duplicate workOrders may be blocked client-side but backend still records rows unless extra checks are added server-side.

---

## วิธีการปรับใช้ (Deploy) และทดสอบ (Quick verification)

1. Backend: เปิด Google Apps Script (จาก `Backend code.txt`) และวางโค้ดลงใน Project
2. ตรวจสอบตัวแปร `SPREADSHEET_ID` ให้ชี้ไปยัง Google Sheet ที่มีชีทต่อไปนี้ (ถ้ายังไม่มี ให้สร้าง):
   - `SurveyResponses`
   - `WorkOrderLog`
   - `MigratetoSH`
3. Deploy → New deployment → เลือก ``Web app`` → ตั้งค่า ``Execute as`` เป็น ``Me`` และ ``Who has access`` เป็น ``Anyone`` (หรือจำกัดตามต้องการ)
4. คัดลอก URL ของ Web App และวางลงในตัวแปร `googleAppScriptUrl` ภายใน `ระบบประเมินความพึงพอใจงานซ่อม V.1.4.html`
5. เปิด `ระบบประเมินความพึงพอใจงานซ่อม V.1.4.html` ในเบราว์เซอร์ (หรือโฮสต์จากเครื่องของคุณ)
6. สร้างรายการใบงาน และกรอก `บ้านเลขที่` ที่หน้าสร้าง QR แล้วกดสร้าง QR
7. สแกน QR (หรือเปิดลิงก์) → แบบสอบถามจะแสดงขึ้นทันที
8. กรอกคะแนนและกดส่ง

Verification: หลังการส่ง ให้เปิด Google Sheet `SurveyResponses`:
- คอลัมน์ `Unit` ควรมีค่าที่คุณกรอกเป็น `houseNumber`
- คอลัมน์ `IP` ควรมีค่าในรูป `hmac_<hex...>` (ไม่ใช่ IP ดิบ)

ถ้าข้อมูลไม่ขึ้น: เปิด Google Apps Script → Executions → ดู log ของรันล่าสุด (ดู Logger.log ที่เพิ่มไว้ใน `doPost`) เพื่อดู `e.parameter` และข้อมูลแถวที่จะถูก append

---

## การตรวจสอบปัญหา (Troubleshooting checklist)

- ถ้า `Unit` ว่าง:
  1. ยืนยันว่า `googleAppScriptUrl` ในไฟล์ `.html` ชี้ไปยัง Deployment ที่เป็นเวอร์ชันล่าสุดของ Apps Script
  2. เปิด Executions logs ใน Apps Script และดู Logger output ของ `doPost` — ตรวจสอบว่า `houseNumber` ถูกส่งมาใน `e.parameter`
  3. ตรวจสอบหัวตาราง (`SurveyResponses`) ว่ามีคอลัมน์ชื่อที่รองรับ alias ของ `Unit` หรือไม่ (ตัวอย่าง: `Unit`, `บ้านเลขที่`)

- ถ้า `IP` เป็นค่า IP ดิบแทนที่จะเป็น `hmac_...`:
  - ตรวจสอบว่า Apps Script มีฟังก์ชัน `hashIpAddress_()` และว่า secret ถูกตั้งใน Script Properties (โค้ดจะสร้าง secret ให้ถ้ายังไม่มี)

- ถ้า Requests ไม่ไปถึง Apps Script:
  - ดูที่ Console ของเบราว์เซอร์ ข้อความ CORS หรือข้อผิดพลาดเครือข่ายจะช่วยชี้ปัญหา
  - เบื้องต้น โค้ด frontend ใช้ `fetch(..., { mode: 'no-cors' })` สำหรับ POST — ซึ่งหมายความว่าเบราว์เซอร์จะไม่ยอมรับ response body; ตรวจสอบ Execution logs ใน Apps Script เพื่อยืนยันว่า request มาถึง

---

## ข้อแนะนำ (Next steps / Suggestions)

- ถ้าต้องการให้ backend ป้องกันการส่งซ้ำขั้นเด็ดขาด: เพิ่มการตรวจสอบ duplicate โดยตรงใน `doPost` (เช่น เช็ค `WorkOrderLog` ก่อน append และ return early)
- ถ้าต้องการให้ frontend อ่านผลลัพธ์จาก backend (เช่น เลขอ้างอิงการบันทึก): เปลี่ยนการ deploy และ CORS policy เพื่ออนุญาตการตอบกลับ (ลบ `mode: 'no-cors'` และตั้ง CORS ใน Apps Script)
- ถ้าต้องการความปลอดภัยเพิ่ม: เพิ่ม token/secret ใน header และตรวจสอบใน `doPost`

---

## ไฟล์ที่แก้ไขล่าสุด

- `ระบบประเมินความพึงพอใจงานซ่อม V.1.4.html` — แก้ flow: แสดงแบบสอบถามทันที, background duplicate check, เอา deviceId และนโยบายออก, เพิ่มการส่ง `houseNumber` และ `userIp` ให้ backend
- `Backend code.txt` — เขียนแถวโดยใช้ header-by-name mapping, alias สำหรับ `Unit`, เก็บ IP เป็น HMAC, เอา deviceId/policy columns ออก และเพิ่ม Logger.log ใน `doPost`

---

หากต้องการให้ผมเพิ่มตัวอย่าง `SurveyResponses` sheet template (CSV) หรือเพิ่มตัวอย่าง Log ของการรัน `doPost` บอกได้เลย ผมจะสร้างให้พร้อมใช้งาน

``` 