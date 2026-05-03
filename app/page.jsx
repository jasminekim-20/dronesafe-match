"use client";

const categories = [
  ["🎬", "홍보영상", "브랜드·리조트·매장 홍보 촬영"],
  ["🏠", "부동산", "건물·토지·매물 항공 촬영"],
  ["🎪", "행사", "축제·공연·웨딩 현장 기록"],
  ["🛡️", "점검 촬영", "시설물·공사 현장 안전 점검"],
  ["🌾", "농업·산림", "작물·산림 모니터링"],
  ["➕", "기타 촬영", "맞춤형 촬영 요청"],
];

const pilots = [
  ["jinhan338", "5.00", "서울·경기", "홍보영상 · 부동산 · 행사", "비행 경력 5년"],
  ["damik609", "4.88", "부산·경남", "부동산 · 점검 촬영", "비행 경력 4년"],
  ["jackee", "4.99", "전국 가능", "홍보영상 · 행사 · 드론 레이싱", "비행 경력 7년"],
  ["smartlinkcom", "4.95", "대전·충청", "홍보영상 · 부동산", "비행 경력 6년"],
  ["appfactory2018", "4.89", "광주·전라", "행사 · 점검 촬영", "비행 경력 5년"],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffaf6] text-[#1f1f1f]">
      <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-xl">
              ✣
            </div>
            <span className="text-xl font-extrabold text-orange-500">
              DroneSafeMatch
            </span>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
            <a className="text-orange-500" href="#">홈</a>
            <a href="#">조종자 찾기</a>
            <a href="#">촬영 요청</a>
            <a href="#">이용 방법</a>
            <a href="#">커뮤니티</a>
          </nav>

          <div className="flex gap-3">
            <button className="rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-500">
              로그인
            </button>
            <button className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-200">
              회원가입
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-bold text-orange-500">
            AI 기반 조종자 매칭 플랫폼
          </p>

          <h1 className="text-5xl font-black leading-tight tracking-tight md:text-6xl">
            드론 촬영,
            <br />
            <span className="text-orange-500">허가 가능한</span> 조종자와
            <br />
            안전하게 연결하세요
          </h1>

          <p className="mt-7 text-lg leading-8 text-gray-600">
            홍보영상, 부동산, 행사, 점검 촬영까지.
            <br />
            촬영 목적과 지역에 맞는 검증 조종자를 추천합니다.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <button className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 px-7 py-4 font-bold text-white shadow-xl shadow-orange-200 transition hover:-translate-y-0.5">
              촬영 요청 시작하기 →
            </button>
            <button className="rounded-2xl border border-orange-200 bg-white px-7 py-4 font-bold text-gray-700 shadow-sm transition hover:-translate-y-0.5">
              조종자 둘러보기
            </button>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ["2,350+", "누적 연결"],
              ["238명", "검증 조종자"],
              ["98%", "만족도"],
              ["4.8★", "평균 평점"],
            ].map(([num, label]) => (
              <div key={label}>
                <p className="text-2xl font-black">{num}</p>
                <p className="mt-1 text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 bottom-8 h-52 w-52 rounded-full bg-orange-100 blur-sm" />
          <div className="absolute -right-4 -top-8 h-64 w-64 rounded-full bg-blue-100 blur-sm" />

          <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-orange-50 via-white to-blue-50 p-8 shadow-2xl shadow-orange-100">
            <div className="flex h-[360px] items-center justify-center rounded-[2.5rem] bg-white/60">
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-orange-100 text-6xl">
                  🚁
                </div>
                <p className="text-lg font-bold text-gray-700">
                  안전한 드론 촬영 매칭
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  허가 · 보험 · 경력 기반 추천
                </p>
              </div>
            </div>

            <div className="absolute right-6 top-16 rounded-2xl bg-white p-5 shadow-xl">
              <p className="text-sm font-bold text-gray-800">100% 검증 조종자</p>
              <p className="mt-1 text-xs text-gray-500">비행 경력 · 자격 확인</p>
            </div>

            <div className="absolute bottom-12 right-8 rounded-2xl bg-white p-5 shadow-xl">
              <p className="text-sm font-bold text-gray-800">전국 어디든 매칭</p>
              <p className="mt-1 text-xs text-gray-500">원하는 지역 선택</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-orange-100 bg-white py-18">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-bold text-orange-500">촬영 유형</p>
          <h2 className="mt-3 text-3xl font-black">다양한 촬영 니즈를 지원해요</h2>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {categories.map(([icon, title, desc]) => (
              <div
                key={title}
                className="rounded-3xl border border-orange-100 bg-[#fffaf6] p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-2xl">
                  {icon}
                </div>
                <h3 className="font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold text-orange-500">추천 조종자</p>
            <h2 className="mt-3 text-3xl font-black">검증된 베스트 조종자</h2>
          </div>
          <button className="rounded-2xl border border-orange-200 bg-white px-5 py-3 text-sm font-bold text-orange-500">
            더 많은 조종자 보기 →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {pilots.map(([name, rating, region, specialty, exp], idx) => (
            <div
              key={name}
              className={`rounded-3xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                idx === 2
                  ? "border-orange-200 shadow-orange-100"
                  : "border-orange-100"
              }`}
            >
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-blue-100 text-3xl">
                {idx === 0 ? "🌅" : idx === 1 ? "🌲" : idx === 2 ? "🛩️" : idx === 3 ? "🏙️" : "🏝️"}
              </div>

              <h3 className="font-black">{name}</h3>
              <p className="mt-1 text-sm text-gray-600">⭐ {rating}</p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {specialty.split(" · ").slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-sm text-gray-500">📍 {region}</p>
              <p className="mt-2 text-sm text-gray-500">{exp}</p>

              <button className="mt-6 w-full rounded-xl border border-orange-300 px-4 py-3 text-sm font-bold text-orange-500 hover:bg-orange-50">
                상세히 보기
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-orange-50 via-white to-orange-100 p-8 shadow-xl shadow-orange-100">
          <p className="text-sm font-bold text-orange-500">간편한 3단계 매칭</p>
          <div className="mt-5 grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_220px]">
            <div>
              <h2 className="text-3xl font-black">원하는 촬영, 쉽고 빠르게 연결하세요</h2>

              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                  ["1. 촬영 요청", "촬영 목적과 지역, 일정을 입력하세요"],
                  ["2. 조종자 매칭", "검증된 전문가를 추천받으세요"],
                  ["3. 안전한 촬영", "허가 및 안전 절차를 확인하세요"],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-2xl bg-white p-5 shadow-sm">
                    <h3 className="font-black text-orange-500">{title}</h3>
                    <p className="mt-2 text-sm text-gray-500">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <button className="rounded-2xl bg-orange-500 px-8 py-5 font-black text-white shadow-xl shadow-orange-200">
              촬영 요청 시작하기 →
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-orange-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-4">
          <div>
            <p className="text-xl font-black text-orange-500">DroneSafeMatch</p>
            <p className="mt-4 text-sm leading-6 text-gray-500">
              드론 촬영을 더 안전하고 합리적으로 연결합니다.
            </p>
          </div>

          <div>
            <h4 className="font-black">서비스</h4>
            <p className="mt-3 text-sm text-gray-500">조종자 찾기</p>
            <p className="mt-2 text-sm text-gray-500">촬영 요청</p>
          </div>

          <div>
            <h4 className="font-black">회사</h4>
            <p className="mt-3 text-sm text-gray-500">회사 소개</p>
            <p className="mt-2 text-sm text-gray-500">이용약관</p>
          </div>

          <div>
            <h4 className="font-black">고객센터</h4>
            <p className="mt-3 text-sm text-gray-500">support@dronesafematch.com</p>
            <p className="mt-2 text-sm text-gray-500">평일 09:00 - 18:00</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
