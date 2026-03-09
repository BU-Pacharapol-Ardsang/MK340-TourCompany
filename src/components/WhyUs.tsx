export default function WhyUs() {
  const reasons = [
    {
      icon: "🛡️",
      title: "ปลอดภัยมั่นใจ",
      desc: "ประกันการเดินทางทุกทริป พร้อมทีมดูแลตลอด 24 ชม.",
    },
    {
      icon: "💰",
      title: "ราคาโปร่งใส",
      desc: "ไม่มีค่าใช้จ่ายแอบแฝง ราคาที่เห็นคือราคาจริง รวมทุกอย่างแล้ว",
    },
    {
      icon: "🗺️",
      title: "โปรแกรมคุณภาพ",
      desc: "จัดเส้นทางไม่เร่งรีบ ที่พักดี อาหารอร่อย ครบจบในทริปเดียว",
    },
    {
      icon: "👨‍✈️",
      title: "ไกด์มืออาชีพ",
      desc: "ไกด์พูดไทยที่มีประสบการณ์ ดูแลเป็นกันเอง พร้อมให้ข้อมูลทุกจุด",
    },
  ];

  return (
    <section id="why-us" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">
            ทำไมต้องเที่ยวกับเรา?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors duration-300 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {r.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {r.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
