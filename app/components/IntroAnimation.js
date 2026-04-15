"use client";

export function IntroAnimation({ fading }) {
  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center
                  bg-gradient-to-br from-rose-400 via-pink-400 to-orange-300
                  transition-opacity duration-1000
                  ${fading ? "opacity-0" : "opacity-100"}`}
    >
      <div className="text-center px-6 intro-content max-w-[40ch]">
        <div className="text-7xl md:text-8xl mb-6 float-animation">🎂</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight text-balance">
          猜猜秧予抓什麼
        </h1>
        <p className="text-white/80 text-sm md:text-base leading-7 text-pretty">
          猜猜寶寶會選什麼？每人可以投{" "}
          <span className="font-semibold text-yellow-100">3</span> 票
        </p>
      </div>
    </div>
  );
}
