# Travie Tours

โปรเจ็กต์เว็บบริษัททัวร์ด้วย Next.js 14 และ TypeScript ตอนนี้รองรับการอ่านข้อมูลทัวร์จาก Neon และรองรับรูปภาพจาก Vercel Blob แล้ว โดยถ้ายังไม่ตั้งค่า env ระบบจะ fallback ไปใช้ข้อมูล local ใน `src/data/tours.ts`

## Development

```bash
npm install
npm run dev
```

เปิด `http://localhost:3000`

## Environment Variables

คัดลอกจาก `.env.example` มาเป็น `.env.local` แล้วใส่ค่า env ที่ Vercel inject ให้โปรเจ็กต์

```bash
STORAGE_URL=
BLOB_READ_WRITE_TOKEN=
```

หมายเหตุ:

- ฝั่งฐานข้อมูลรองรับชื่อ env หลายแบบ เช่น `STORAGE_URL`, `DATABASE_URL`, `POSTGRES_URL`
- ถ้าคุณใช้ prefix ตามภาพใน Vercel ตอนนี้ให้ใส่ `STORAGE_URL`
- `BLOB_READ_WRITE_TOKEN` ใช้ตอน seed รูปขึ้น Blob ถ้าไม่ใส่ ระบบจะเก็บ path local เดิมไว้แทน

## Initial Seed

หลังจากตั้งค่า env แล้ว ให้รัน:

```bash
npm run db:seed
```

สิ่งที่ script จะทำ:

- สร้างตาราง `tours` ใน Neon ถ้ายังไม่มี
- อัปโหลดรูปจาก `public/images` ไปที่ Vercel Blob ถ้ามี `BLOB_READ_WRITE_TOKEN`
- upsert ข้อมูลทัวร์ทั้งหมดจาก `src/data/tours.ts` เข้า Neon

## Admin Route

มีหน้า CRUD ที่ ` /admin `

- เพิ่มทัวร์ใหม่ได้
- แก้ไขข้อมูลทัวร์เดิมได้
- ลบทัวร์ได้
- อัปโหลดรูปขึ้น Blob จากฟอร์มได้ตรง ๆ
- เพิ่ม Gallery ของแต่ละแพ็กเกจได้ทั้งแบบ URL และ multi-file upload

หมายเหตุ: ตอนนี้ยังไม่มีระบบ login หรือ auth สำหรับหน้าแอดมิน

## Project Structure

- `src/app` หน้าเว็บและ routes
- `src/components` UI components
- `src/data` seed data และ type ของทัวร์
- `src/lib/env.ts` ตัวช่วยอ่าน env สำหรับ Neon/Blob
- `src/lib/tours.ts` server data layer สำหรับโหลดทัวร์จาก Neon
- `scripts/seed-tours.ts` seed script สำหรับสร้างตารางและย้ายข้อมูลขึ้น Neon/Blob
- `public` static assets ของแอป
- `reference-assets` รูปและภาพอ้างอิงที่ยังไม่ผูกเข้ากับแอปโดยตรง
- `archive/legacy-tour-app` สำเนาโครงสร้างเดิมจากโฟลเดอร์ `tour-app`

## Notes

- แอปหลักใช้ `npm` เป็น package manager ตาม `package-lock.json`
- Next image ถูกตั้งค่าให้โหลดรูปจาก Vercel Blob domain ได้แล้ว
- ถ้ายังมีโฟลเดอร์ `tour-app/.next` ค้างอยู่ แปลว่ามี cache/generated files จากรอบก่อน และไม่มีผลกับการรันแอปที่ root
