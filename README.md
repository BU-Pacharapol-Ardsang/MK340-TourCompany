# Travie Tours

โปรเจกต์เว็บไซต์บริษัททัวร์ด้วย Next.js 14 และ TypeScript โดยตอนนี้โครงสร้างแอปหลักอยู่ที่ root ของ repository แล้ว สามารถรันจากโฟลเดอร์นี้ได้ตรง ๆ

## Development

```bash
npm install
npm run dev
```

เปิด `http://localhost:3000`

## Project Structure

- `src/app` หน้าเว็บและ routes
- `src/components` UI components
- `src/data` ข้อมูลทัวร์
- `public` static assets ของแอป
- `reference-assets` รูปและภาพอ้างอิงที่ยังไม่ผูกเข้ากับแอปโดยตรง
- `archive/legacy-tour-app` สำเนาโครงสร้างเดิมจากโฟลเดอร์ `tour-app`

## Notes

- แอปหลักใช้ `npm` เป็น package manager ตาม `package-lock.json`
- ถ้ายังมีโฟลเดอร์ `tour-app/.next` ค้างอยู่ แปลว่ามี cache/generated files จากรอบก่อน และไม่มีผลกับการรันแอปที่ root
