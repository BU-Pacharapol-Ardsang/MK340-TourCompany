export default function ContactCTA() {
  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
          พร้อมออกเดินทางหรือยัง?
        </h2>
        <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
          ทักหาเราได้เลย! ทีมงานพร้อมช่วยวางแผนทริปในฝันให้คุณ ปรึกษาฟรีไม่มีค่าใช้จ่าย
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://line.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-lg"
          >
            <span className="text-xl">💬</span>
            แอดไลน์สอบถาม
          </a>
          <a
            href="tel:0812345678"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-8 py-4 rounded-xl border border-white/30 transition-all"
          >
            <span className="text-xl">📞</span>
            โทร 081-234-5678
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-14 text-white/60 text-sm">
          <span>✅ ใบอนุญาตนำเที่ยว TAT</span>
          <span>✅ ประกันการเดินทาง</span>
          <span>✅ ชำระผ่อนได้</span>
        </div>
      </div>
    </section>
  );
}
