"use client";

import { useState } from "react";

const pilots = [
  {
    name: "jinhan338",
    rating: "5.00",
    region: "서울",
    regions: ["서울", "경기"],
    specialty: ["홍보영상", "부동산", "행사"],
    price: 600000,
    permit: true,
    insured: true,
    delivery: 99,
    reshoot: 1.2,
    response: "1시간 이내",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "damik609",
    rating: "4.88",
    region: "부산",
    regions: ["부산", "경남"],
    specialty: ["부동산", "점검촬영"],
    price: 450000,
    permit: false,
    insured: true,
    delivery: 92,
    reshoot: 3.5,
    response: "3시간 이내",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "jackee",
    rating: "4.99",
    region: "전국",
    regions: ["서울", "경기", "부산", "제주", "대전"],
    specialty: ["홍보영상", "행사", "여행콘텐츠"],
    price: 700000,
    permit: true,
    insured: true,
    delivery: 98,
    reshoot: 1.8,
    response: "30분 이내",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "smartlinkcom",
    rating: "4.95",
    region: "대전",
    regions: ["대전", "충청"],
    specialty: ["홍보영상", "부동산"],
    price: 520000,
    permit: true,
    insured: false,
    delivery: 96,
    reshoot: 2.4,
    response: "2시간 이내",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=500&q=80",
  },
];

function getMatch(pilot, form) {
  let score = 0;
  const reasons = [];

  if (pilot.regions.includes(form.region)) {
    score += 25;
    reasons.push("촬영 지역 일치");
  }

  if (pilot.specialty.includes(form.purpose)) {
    score += 25;
    reasons.push("촬영 목적 전문");
  }

  if ((form.permitNeed === "필요" || form.permitNeed === "모름") && pilot.permit) {
    score += 20;
    reasons.push("허가 대행 가능");
  }

  if (pilot.insured) {
    score += 15;
    reasons.push("보험 가입 완료");
  }

  if (pilot.delivery >= 95) {
    score += 10;
    reasons.push("납기 준수율 우수");
  }

  if (pilot.reshoot <= 2) {
    score += 5;
    reasons.push("재촬영 리스크 낮음");
  }

  return { ...pilot, score, reasons };
}

export default function Home() {
  const [step, setStep] = useState("home");
  const [selectedPilot, setSelectedPilot] = useState(null);
  const [form, setForm] = useState({
    region: "서울",
    purpose: "홍보영상",
    date: "",
    budget: "70만원 이하",
    result: "영상",
    permitNeed: "모름",
    detail: "",
  });

  const matchedPilots = pilots
    .map((pilot) => getMatch(pilot, form))
    .sort((a, b) => b.score - a.score);

  return (
    <main className="min-h-screen bg-[#fffaf6] text-gray-900">
      <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button onClick={() => setStep("home")} className="text-xl font-black text-orange-500">
            DroneSafeMatch
          </button>

          <nav className="hidden gap-8 text-sm font-semibold text-gray-600 md:flex">
            <button onClick={() => setStep("home")}>홈</button>
            <button onClick={() => setStep("request")}>촬영 요청</button>
            <button onClick={() => setStep("pilots")}>조종자 찾기</button>
          </nav>

          <button
            onClick={() => setStep("request")}
            className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-orange-200"
          >
            촬영 요청하기
          </button>
        </div>
      </header>

      {step === "home" && (
        <>
          <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-sm font-bold text-orange-500">
                허가·보험·납기·재촬영 리스크 기반 매칭
              </p>

              <h1 className="text-5xl font-black leading-tight tracking-tight md:text-6xl">
                드론 촬영,
                <br />
                <span className="text-orange-500">검증된 조종자와</span>
                <br />
                안전하게 연결하세요
              </h1>

              <p className="mt-7 text-lg leading-8 text-gray-600">
                단순히 촬영자를 연결하지 않습니다.
                <br />
                촬영 목적, 지역, 허가 가능성, 보험, 납기, 재촬영 리스크까지 고려해 추천합니다.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <button
                  onClick={() => setStep("request")}
                  className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 px-7 py-4 font-bold text-white shadow-xl shadow-orange-200"
                >
                  촬영 요청 시작하기 →
                </button>
                <button
                  onClick={() => setStep("pilots")}
                  className="rounded-2xl border border-orange-200 bg-white px-7 py-4 font-bold text-gray-700 shadow-sm"
                >
                  조종자 둘러보기
                </button>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {[
                  ["허가", "대행 가능 여부"],
                  ["보험", "가입 상태 확인"],
                  ["납기", "준수율 반영"],
                  ["재촬영", "리스크 점수화"],
                ].map(([num, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-black text-orange-500">{num}</p>
                    <p className="mt-1 text-sm text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[3rem] bg-white p-4 shadow-2xl shadow-orange-100">
              <img
                src="https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&w=1200&q=80"
                alt="드론 촬영"
                className="h-[420px] w-full rounded-[2.5rem] object-cover"
              />
            </div>
          </section>

          <section className="border-y border-orange-100 bg-white py-16">
            <div className="mx-auto max-w-7xl px-6">
              <p className="text-sm font-bold text-orange-500">왜 DroneSafeMatch인가요?</p>
              <h2 className="mt-3 text-3xl font-black">
                촬영 실패 리스크를 줄이는 중개 플랫폼
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
                {[
                  ["허가 대행", "촬영 지역에 따라 허가 대행 가능 조종자를 우선 추천합니다."],
                  ["보험 가입", "촬영 사고 리스크를 줄이기 위해 보험 가입 상태를 표시합니다."],
                  ["납기 준수율", "마감이 중요한 촬영을 위해 납기 데이터를 반영합니다."],
                  ["재촬영률", "결과물 실패 가능성을 낮추기 위해 재촬영률을 보여줍니다."],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-3xl bg-[#fffaf6] p-6 shadow-sm">
                    <h3 className="font-black text-orange-500">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-500">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {step === "request" && (
        <section className="mx-auto max-w-4xl px-6 py-16">
          <button onClick={() => setStep("home")} className="mb-6 text-sm font-bold text-orange-500">
            ← 홈으로
          </button>

          <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-orange-100">
            <p className="text-sm font-bold text-orange-500">Step 1</p>
            <h2 className="mt-2 text-3xl font-black">촬영 요청 정보를 입력하세요</h2>
            <p className="mt-3 text-gray-500">
              입력한 조건을 기준으로 허가·보험·납기·재촬영 리스크를 고려해 조종자를 추천합니다.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              <label className="text-sm font-bold">
                촬영 지역
                <select
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-orange-100 p-3"
                >
                  <option>서울</option>
                  <option>경기</option>
                  <option>부산</option>
                  <option>제주</option>
                  <option>대전</option>
                </select>
              </label>

              <label className="text-sm font-bold">
                촬영 목적
                <select
                  value={form.purpose}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-orange-100 p-3"
                >
                  <option>홍보영상</option>
                  <option>부동산</option>
                  <option>행사</option>
                  <option>점검촬영</option>
                  <option>여행콘텐츠</option>
                </select>
              </label>

              <label className="text-sm font-bold">
                희망 날짜
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-orange-100 p-3"
                />
              </label>

              <label className="text-sm font-bold">
                예산
                <select
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-orange-100 p-3"
                >
                  <option>50만원 이하</option>
                  <option>70만원 이하</option>
                  <option>100만원 이하</option>
                  <option>100만원 이상</option>
                </select>
              </label>

              <label className="text-sm font-bold">
                결과물
                <select
                  value={form.result}
                  onChange={(e) => setForm({ ...form, result: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-orange-100 p-3"
                >
                  <option>사진</option>
                  <option>영상</option>
                  <option>편집본 포함</option>
                </select>
              </label>

              <label className="text-sm font-bold">
                비행 허가 필요 여부
                <select
                  value={form.permitNeed}
                  onChange={(e) => setForm({ ...form, permitNeed: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-orange-100 p-3"
                >
                  <option>모름</option>
                  <option>필요</option>
                  <option>불필요</option>
                </select>
              </label>
            </div>

            <label className="mt-5 block text-sm font-bold">
              상세 요청사항
              <textarea
                value={form.detail}
                onChange={(e) => setForm({ ...form, detail: e.target.value })}
                placeholder="예: 리조트 홍보용 30초 영상 3개가 필요합니다."
                className="mt-2 h-28 w-full rounded-xl border border-orange-100 p-3"
              />
            </label>

            <button
              onClick={() => setStep("pilots")}
              className="mt-8 w-full rounded-2xl bg-orange-500 px-7 py-4 font-black text-white shadow-xl shadow-orange-200"
            >
              조건에 맞는 조종자 추천받기 →
            </button>
          </div>
        </section>
      )}

      {step === "pilots" && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <button onClick={() => setStep("request")} className="mb-6 text-sm font-bold text-orange-500">
            ← 요청 정보 수정
          </button>

          <div className="mb-10">
            <p className="text-sm font-bold text-orange-500">Step 2</p>
            <h2 className="mt-2 text-3xl font-black">추천 조종자</h2>
            <p className="mt-3 text-gray-500">
              {form.region} · {form.purpose} · 허가 여부 {form.permitNeed} 기준으로 추천했습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {matchedPilots.map((pilot) => (
              <div key={pilot.name} className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
                <img
                  src={pilot.image}
                  alt={pilot.name}
                  className="mb-5 h-40 w-full rounded-2xl object-cover"
                />

                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black">{pilot.name}</h3>
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-black text-orange-500">
                    {pilot.score}%
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500">⭐ {pilot.rating} · {pilot.region}</p>
                <p className="mt-3 text-sm text-gray-600">
                  시작가 {pilot.price.toLocaleString()}원
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <span className="rounded-full bg-orange-50 px-3 py-2 text-center font-bold text-orange-500">
                    {pilot.permit ? "허가 대행 가능" : "허가 대행 불가"}
                  </span>
                  <span className="rounded-full bg-orange-50 px-3 py-2 text-center font-bold text-orange-500">
                    {pilot.insured ? "보험 가입" : "보험 미확인"}
                  </span>
                  <span className="rounded-full bg-gray-50 px-3 py-2 text-center font-bold text-gray-600">
                    납기 {pilot.delivery}%
                  </span>
                  <span className="rounded-full bg-gray-50 px-3 py-2 text-center font-bold text-gray-600">
                    재촬영 {pilot.reshoot}%
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-black">추천 이유</p>
                  <div className="mt-2 space-y-1 text-sm text-gray-500">
                    {pilot.reasons.length > 0 ? (
                      pilot.reasons.map((reason) => <p key={reason}>✔ {reason}</p>)
                    ) : (
                      <p>조건과 일부만 일치합니다.</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPilot(pilot);
                    setStep("complete");
                  }}
                  className="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-orange-100"
                >
                  견적 요청하기
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {step === "complete" && (
        <section className="mx-auto max-w-3xl px-6 py-20">
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-xl shadow-orange-100">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl">
              ✓
            </div>

            <p className="text-sm font-bold text-orange-500">Step 3</p>
            <h2 className="mt-2 text-3xl font-black">견적 요청이 접수되었습니다</h2>

            <p className="mt-5 leading-7 text-gray-500">
              {selectedPilot?.name} 조종자에게 요청 내용이 전달되었습니다.
              <br />
              조종자가 촬영 가능 여부와 허가 필요 여부를 확인한 뒤 응답합니다.
            </p>

            <div className="mt-8 rounded-2xl bg-[#fffaf6] p-6 text-left">
              <p className="font-black">요청 요약</p>
              <p className="mt-3 text-sm text-gray-600">지역: {form.region}</p>
              <p className="mt-1 text-sm text-gray-600">목적: {form.purpose}</p>
              <p className="mt-1 text-sm text-gray-600">예산: {form.budget}</p>
              <p className="mt-1 text-sm text-gray-600">허가 필요 여부: {form.permitNeed}</p>
              <p className="mt-1 text-sm text-gray-600">
                예상 응답 시간: {selectedPilot?.response}
              </p>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => setStep("home")}
                className="rounded-xl border border-orange-200 bg-white px-6 py-3 font-bold text-gray-700"
              >
                홈으로
              </button>
              <button
                onClick={() => setStep("pilots")}
                className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white"
              >
                다른 조종자 보기
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
