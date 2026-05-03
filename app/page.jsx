"use client";

export default function Home() {
  return (
    <main className="bg-white text-gray-900">
      
      {/* NAVBAR */}
      <header className="flex justify-between items-center px-10 py-6 border-b">
        <h1 className="text-xl font-bold text-orange-500">
          DroneSafeMatch
        </h1>

        <nav className="space-x-6 text-sm">
          <button>홈</button>
          <button>조종자 찾기</button>
          <button>촬영 요청</button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-full">
            회원가입
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section className="flex items-center justify-between px-10 py-20">
        
        {/* LEFT */}
        <div className="max-w-xl">
          <h2 className="text-5xl font-bold leading-tight">
            드론 촬영, <br />
            <span className="text-orange-500">
              허가 가능한 조종자와
            </span><br />
            안전하게 연결하세요
          </h2>

          <p className="mt-6 text-gray-500">
            홍보영상, 부동산, 행사 촬영까지.<br />
            검증된 조종자를 빠르게 매칭합니다.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-xl shadow hover:opacity-90">
              촬영 요청하기
            </button>
            <button className="border px-6 py-3 rounded-xl">
              조종자 둘러보기
            </button>
          </div>

          {/* STATS */}
          <div className="flex gap-10 mt-10 text-sm text-gray-600">
            <div>
              <p className="font-bold text-lg">2,350+</p>
              <p>누적 연결</p>
            </div>
            <div>
              <p className="font-bold text-lg">238명</p>
              <p>검증 조종자</p>
            </div>
            <div>
              <p className="font-bold text-lg">98%</p>
              <p>매칭 성공률</p>
            </div>
            <div>
              <p className="font-bold text-lg">4.8</p>
              <p>평균 평점</p>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-[500px] h-[350px] bg-gray-100 rounded-3xl flex items-center justify-center shadow-inner">
          <p className="text-gray-400">드론 이미지</p>
        </div>
      </section>

      {/* CATEGORY */}
      <section className="px-10 py-16 bg-gray-50">
        <h3 className="text-2xl font-bold mb-8">
          다양한 촬영 니즈를 지원해요
        </h3>

        <div className="grid grid-cols-6 gap-6">
          {["홍보영상","부동산","행사","점검 촬영","농업","기타"].map((item) => (
            <div key={item} className="bg-white p-6 rounded-xl shadow text-center">
              <div className="text-orange-500 mb-2">●</div>
              <p className="font-medium">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PILOTS */}
      <section className="px-10 py-16">
        <h3 className="text-2xl font-bold mb-10">
          검증된 베스트 조종자
        </h3>

        <div className="grid grid-cols-5 gap-6">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6 text-center">
              
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              
              <p className="font-bold">pilot{i}</p>
              <p className="text-sm text-gray-500">⭐ 4.9</p>

              <button className="mt-4 border border-orange-400 text-orange-500 px-4 py-2 rounded-lg text-sm">
                상세 보기
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-10 py-16 bg-orange-50 text-center">
        <h3 className="text-2xl font-bold mb-4">
          원하는 촬영, 빠르게 시작하세요
        </h3>

        <button className="bg-orange-500 text-white px-8 py-4 rounded-xl">
          촬영 요청 시작하기 →
        </button>
      </section>

      {/* FOOTER */}
      <footer className="px-10 py-10 border-t text-sm text-gray-500">
        © 2024 DroneSafeMatch
      </footer>

    </main>
  );
}
