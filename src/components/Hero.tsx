import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[92vh] min-h-[600px] flex items-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/73xOjfHu1ny3RYEw7LVp.webp"
        alt="Tour destination cover"
        fill
        className="object-cover"
        priority
        quality={85}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-2xl">
          <span className="inline-block bg-blue-600/90 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            🌏 ทัวร์ต่างประเทศ &amp; ในประเทศ
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
            ออกเดินทาง
            <br />
            <span className="text-blue-400">สร้างความทรงจำ</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed max-w-lg">
            แพ็กเกจทัวร์คุณภาพ ราคาโปร่งใส พร้อมไกด์ดูแลตลอดทริป
            <br className="hidden sm:block" />
            เลือกทริปที่ใช่ แล้วออกเดินทางกันเลย!
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#packages"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-center transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-600/30"
            >
              ดูแพ็กเกจทั้งหมด
            </a>
            <a
              href="#contact"
              className="border-2 border-white/40 hover:border-white text-white font-semibold px-8 py-4 rounded-xl text-center transition-all hover:bg-white/10"
            >
              ปรึกษาฟรี
            </a>
          </div>

          {/* Quick stats */}
          <div className="flex gap-8 mt-12">
            {[
              { value: "500+", label: "ทริปสำเร็จ" },
              { value: "15K+", label: "ลูกค้าไว้ใจ" },
              { value: "4.9★", label: "รีวิวเฉลี่ย" },
            ].map((stat) => (
              <div key={stat.label} className="text-white">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-white/40 flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full" />
        </div>
      </div>
    </section>
  );
}
