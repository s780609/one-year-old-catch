"use client";

export function IntroAnimation({ fading }) {
  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center
                  bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500
                  transition-opacity duration-1000
                  ${fading ? "opacity-0" : "opacity-100"}`}
    >
      <div className="text-center px-6 intro-content">
        <div className="text-7xl md:text-8xl mb-6 float-animation">🎂</div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">
          秧予抓周猜猜看
        </h1>
        <p className="text-white/90 text-lg md:text-xl">
          猜猜寶寶會選什麼？每人可以投 <span className="font-bold text-yellow-200">3</span> 票
        </p>
      </div>
    </div>
  );
}
