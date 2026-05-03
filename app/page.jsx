"use client";
import { useState } from "react";

/**
 * 조종자 데이터 (리스크 포함)
 */
const PILOTS = [
  {
    name: "jackee",
    region: ["서울", "경기"],
    specialty: ["홍보영상", "부동산"],
    permit: true,
    insured: true,
    delivery: 98,
    reshoot: 1.8,
    price: 50,
  },
  {
    name: "damik609",
    region: ["부산"],
    specialty: ["행사"],
    permit: false,
    insured: true,
    delivery: 92,
    reshoot: 3.5,
    price: 40,
  },
  {
    name: "jinhan338",
    region: ["서울"],
    specialty: ["홍보영상", "행사"],
    permit: true,
    insured: true,
    delivery: 99,
    reshoot: 1.2,
    price: 60,
  },
];

/**
 * 매칭 점수 계산
 */
function calcScore(pilot, form) {
  let score = 0;
  let reasons = [];

  if (pilot.region.includes(form.region)) {
    score += 25;
    reasons.push("지역 일치");
  }

  if (pilot.specialty.includes(form.type)) {
    score += 25;
    reasons.push("촬영 목적 전문");
  }

  if (pilot.permit) {
    score += 20;
    reasons.push("허가 대행 가능");
  }

  if (pilot.insured) {
    score += 15;
    reasons.push("보험 가입");
  }

  if (pilot.delivery > 95) {
    score += 10;
    reasons.push("납기 안정");
  }

  if (pilot.reshoot < 2) {
    score += 5;
    reasons.push("재촬영 리스크 낮음");
  }

  return { score, reasons };
}

export default function Home() {
  const [form, setForm] = useState({
    region: "서울",
    type: "홍보영상",
  });

  const [result, setResult] = useState([]);

  /**
   * 매칭 실행
   */
  const handleMatch = () => {
    const data = PILOTS.map((p) => {
      const res = calcScore(p, form);
      return { ...p, ...res };
    }).sort((a, b) => b.score - a.score);

    setResult(data);
  };

  return (
    <main className="min-h-screen bg-[#fffaf6] p-10">

      {/* 제목 */}
      <h1 className="text-4xl font-bold mb-6">
        드론 촬영 매칭
      </h1>

      {/* 입력 폼 */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">

        <div className="flex gap-4 mb-4">

          <select
            value={form.region}
            onChange={(e) =>
              setForm({ ...form, region: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option>서울</option>
            <option>경기</option>
            <option>부산</option>
          </select>

          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option>홍보영상</option>
            <option>부동산</option>
            <option>행사</option>
          </select>

          <button
            onClick={handleMatch}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            매칭 시작
          </button>

        </div>

      </div>

      {/* 결과 */}
      <div className="grid md:grid-cols-3 gap-6">

        {result.map((p) => (
          <div
            key={p.name}
            className="bg-white p-6 rounded-xl shadow"
          >

            <h2 className="text-xl font-bold">{p.name}</h2>

            <p className="text-orange-500 text-lg font-bold">
              매칭률 {p.score}%
            </p>

            <div className="text-sm text-gray-500 mt-2">
              납기 {p.delivery}% / 재촬영 {p.reshoot}%
            </div>

            {/* 핵심 차별 포인트 */}
            <div className="mt-4 text-sm">

              {p.reasons.map((r, i) => (
                <div key={i} className="text-gray-700">
                  ✔ {r}
                </div>
              ))}

            </div>

          </div>
        ))}

      </div>

    </main>
  );
}
