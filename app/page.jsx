"use client";

const pilots = [
  ["jinhan338", "5.00", "서울·경기", "홍보영상 · 부동산 · 행사", "비행 경력 5년", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"],
  ["damik609", "4.88", "부산·경남", "부동산 · 점검 촬영", "비행 경력 4년", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"],
  ["jackee", "4.99", "전국 가능", "홍보영상 · 행사", "비행 경력 7년", "https://images.unsplash.com/photo-1473968512647-3e447244af8f"],
  ["smartlinkcom", "4.95", "대전·충청", "홍보영상 · 부동산", "비행 경력 6년", "https://images.unsplash.com/photo-1494526585095-c41746248156"],
  ["appfactory2018", "4.89", "광주·전라", "행사 · 점검 촬영", "비행 경력 5년", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffaf6] text-gray-900">

      {/* HEADER */}
      <header className="flex justify-between items-center px-10 py-6 border-b bg-white">
        <h1 className="text-xl font-bold text-orange-500">
          DroneSafeMatch
        </h1>

        <div className="flex gap-4">
          <button className="border px-4 py-2 rounded-lg">로그인</button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
            회원가입
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="grid md:grid-cols-2 gap-10 px-10 py-20">

        {/* TEXT */}
        <div>
          <h2 className="text-5xl font-bold leading-tight">
            드론 촬영,<br />
            <span className="text-orange-500">
              허가 가능한 조종자와
            </span><br />
            연결하세요
          </h2>

          <p className="mt-6 text-gray-500">
            홍보영상, 부동산, 행사 촬영까지.<br />
            검증된 조종자를 빠르게 매칭합니다.
          </p>

          <button className="mt-8 bg-orange-500 text-white px-6 py-3 rounded-xl shadow">
            촬영 요청하기 →
          </button>
        </div>

        {/* IMAGE */}
        <div className="rounded-3xl overflow-hidden shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1506947411487-a56738267384"
            className="w-full h-[350px] object-cover"
          />
        </div>

      </section>

      {/* PILOTS */}
      <section className="px-10 py-16">

        <h3 className="text-2xl font-bold mb-10">
          추천 조종자
        </h3>

        <div className="grid md:grid-cols-5 gap-6">

          {pilots.map(([name, rating, region, type, exp, image]) => (
            <div key={name} className="bg-white rounded-xl shadow p-6 text-center">

              <img
                src={image}
                className="w-20 h-20 mx-auto rounded-full object-cover mb-4"
              />

              <p className="font-bold">{name}</p>
              <p className="text-sm text-gray-500">⭐ {rating}</p>
              <p className="text-xs text-gray-400 mt-1">{region}</p>
              <p className="text-xs text-gray-400">{exp}</p>

              <button className="mt-4 border border-orange-400 text-orange-500 px-4 py-2 rounded-lg text-sm">
                상세보기
              </button>
            </div>
          ))}

        </div>

      </section>

    </main>
  );
}
