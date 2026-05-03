import { useState, useEffect, useRef } from "react";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const PILOTS = [
  {
    id: 1,
    name: "에어아이 스튜디오",
    region: ["서울", "경기", "인천"],
    specialty: ["홍보영상", "부동산", "행사"],
    startPrice: 350000,
    rating: 4.9,
    reviews: 128,
    permitSupport: true,
    insured: true,
    reshootRate: 2.1,
    deliveryRate: 98,
    responseTime: "2시간 이내",
    badge: "top",
    avatar: "✈️",
    description: "서울/수도권 전문 상업 드론 촬영팀. 대기업 홍보영상 및 부동산 프로젝트 다수 진행.",
  },
  {
    id: 2,
    name: "스카이렌즈 코리아",
    region: ["부산", "경남", "울산"],
    specialty: ["시설점검", "홍보영상", "여행콘텐츠"],
    startPrice: 280000,
    rating: 4.8,
    reviews: 94,
    permitSupport: true,
    insured: true,
    reshootRate: 3.2,
    deliveryRate: 96,
    responseTime: "4시간 이내",
    badge: "permit",
    avatar: "🛸",
    description: "산업용 시설점검 전문. 항만, 공단, 에너지 시설 촬영 허가 대행 경력 5년.",
  },
  {
    id: 3,
    name: "블루버드 미디어",
    region: ["서울", "경기"],
    specialty: ["행사", "여행콘텐츠", "홍보영상"],
    startPrice: 420000,
    rating: 4.7,
    reviews: 211,
    permitSupport: true,
    insured: true,
    reshootRate: 1.8,
    deliveryRate: 99,
    responseTime: "1시간 이내",
    badge: "delivery",
    avatar: "🦅",
    description: "K-pop 뮤직비디오, 기업 행사 생중계 전문. 당일 편집본 납품 가능.",
  },
  {
    id: 4,
    name: "하늘촬영소",
    region: ["제주", "전남", "광주"],
    specialty: ["여행콘텐츠", "부동산", "행사"],
    startPrice: 220000,
    rating: 4.6,
    reviews: 73,
    permitSupport: false,
    insured: true,
    reshootRate: 4.5,
    deliveryRate: 93,
    responseTime: "6시간 이내",
    badge: null,
    avatar: "🌊",
    description: "제주 및 남해안 자연경관 전문. 여행 콘텐츠, 펜션·호텔 홍보 촬영 다수.",
  },
  {
    id: 5,
    name: "테크플라이 솔루션",
    region: ["대전", "충남", "충북", "세종"],
    specialty: ["시설점검", "홍보영상"],
    startPrice: 500000,
    rating: 4.9,
    reviews: 56,
    permitSupport: true,
    insured: true,
    reshootRate: 1.2,
    deliveryRate: 100,
    responseTime: "2시간 이내",
    badge: "top",
    avatar: "🔬",
    description: "열화상·라이다 탑재 산업용 드론 전문. 태양광, 건물 외벽, 교량 점검 특화.",
  },
  {
    id: 6,
    name: "골든아워 필름",
    region: ["서울", "경기", "강원"],
    specialty: ["부동산", "여행콘텐츠", "홍보영상"],
    startPrice: 380000,
    rating: 4.8,
    reviews: 147,
    permitSupport: true,
    insured: true,
    reshootRate: 2.8,
    deliveryRate: 97,
    responseTime: "3시간 이내",
    badge: "permit",
    avatar: "🎬",
    description: "고급 부동산 및 리조트 전문 촬영팀. 시네마틱 편집 포함 패키지 제공.",
  },
];

function calcMatchScore(pilot, form) {
  let score = 40;
  if (form.region && pilot.region.some(r => r.includes(form.region) || form.region.includes(r))) score += 25;
  if (form.purpose && pilot.specialty.includes(form.purpose)) score += 20;
  if ((form.permit === "모름" || form.permit === "필요") && pilot.permitSupport) score += 15;
  return Math.min(score, 99);
}

function StarRating({ rating }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i <= Math.floor(rating) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs font-semibold text-slate-700 ml-1">{rating}</span>
    </span>
  );
}

export default function App() {
  const [form, setForm] = useState({
    purpose: "", region: "", date: "", budget: "",
    deliverable: [], permit: "", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [compared, setCompared] = useState([]);
  const [modalPilot, setModalPilot] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const pilotsRef = useRef(null);
  const formRef = useRef(null);

  const sortedPilots = [...PILOTS]
    .map(p => ({ ...p, score: calcMatchScore(p, form) }))
    .sort((a, b) => b.score - a.score);

  const toggleCompare = (pilot) => {
    setCompared(prev =>
      prev.find(p => p.id === pilot.id)
        ? prev.filter(p => p.id !== pilot.id)
        : prev.length < 3 ? [...prev, pilot] : prev
    );
  };

  const handleDeliverable = (v) => {
    setForm(f => ({
      ...f,
      deliverable: f.deliverable.includes(v)
        ? f.deliverable.filter(x => x !== v)
        : [...f.deliverable, v],
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => pilotsRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;900&display=swap');
        * { font-family: 'Noto Sans KR', sans-serif; }
        .gradient-sky { background: linear-gradient(135deg, #0369a1 0%, #0ea5e9 50%, #38bdf8 100%); }
        .card-hover { transition: all 0.25s cubic-bezier(.4,0,.2,1); }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -8px rgba(3,105,161,0.15); }
        .match-bar { transition: width 1s cubic-bezier(.4,0,.2,1); }
        .fade-in { animation: fadeIn 0.5s ease forwards; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
        .pulse-dot { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.4;} }
        .hero-float { animation: heroFloat 6s ease-in-out infinite; }
        @keyframes heroFloat { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14,165,233,0.15); }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f1f5f9; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .modal-backdrop { backdrop-filter: blur(8px); }
      `}</style>

      <nav className="sticky top-0 z-50 bg-white/90 border-b border-slate-100" style={{ backdropFilter: "blur(12px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-sky rounded-lg flex items-center justify-center text-white text-lg">✈</div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">DroneSafe<span className="text-sky-500">Match</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-500 font-medium">
            <button onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })} className="hover:text-sky-600 transition-colors">촬영 요청</button>
            <button onClick={() => pilotsRef.current?.scrollIntoView({ behavior: "smooth" })} className="hover:text-sky-600 transition-colors">조종자 찾기</button>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400 text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full pulse-dot inline-block"></span>
              현재 {PILOTS.length}명 활동 중
            </span>
          </div>
          <button
            onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="gradient-sky text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            촬영 요청 시작
          </button>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 pt-20 pb-28">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "linear-gradient(rgba(14,165,233,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.3) 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }} />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full pulse-dot" />
              AI 기반 조종자 매칭 플랫폼
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-5">
              드론 촬영,<br />
              <span className="text-sky-400">허가 가능한 조종자</span>와<br />
              안전하게 연결하세요
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              홍보영상, 부동산, 행사, 점검 촬영까지.<br />
              촬영 목적과 지역에 맞는 <strong className="text-slate-300">검증 조종자</strong>를 추천합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="gradient-sky text-white font-bold px-8 py-4 rounded-xl text-base hover:opacity-90 transition-all hover:shadow-lg hover:shadow-sky-500/30 active:scale-95"
              >
                촬영 요청 시작하기 →
              </button>
              <button
                onClick={() => pilotsRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="bg-white/5 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-white/10 transition-all"
              >
                조종자 둘러보기
              </button>
            </div>
            <div className="mt-10 flex gap-8 justify-center lg:justify-start">
              {[["238명", "검증 조종자"], ["98%", "납기 준수율"], ["4.8★", "평균 평점"]].map(([val, label]) => (
                <div key={label} className="text-center">
                  <div className="text-xl font-black text-white">{val}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 hero-float">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              <div className="absolute inset-0 gradient-sky rounded-3xl opacity-20 blur-2xl" />
              <div className="relative w-full h-full gradient-sky rounded-3xl flex items-center justify-center text-8xl sm:text-9xl shadow-2xl shadow-sky-500/30">
                🚁
              </div>
              <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                허가 대행 가능 ✓
              </div>
              <div className="absolute -bottom-3 -left-3 bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                보험 가입 완료 🛡
              </div>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 mt-16">
          <p className="text-center text-slate-600 text-xs font-medium mb-4">촬영 완료 기업</p>
          <div className="flex flex-wrap justify-center gap-6 opacity-40">
            {["현대건설", "LG전자", "CJ ENM", "코오롱", "롯데건설", "KT"].map(b => (
              <span key={b} className="text-slate-400 text-sm font-semibold">{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-10 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: "📋", label: "허가 대행 가능", desc: "비행 허가 취득 지원", color: "sky" },
              { icon: "🛡️", label: "보험 가입", desc: "제3자 배상책임 보험", color: "emerald" },
              { icon: "🎯", label: "납기 준수 우수", desc: "약속한 날짜에 납품", color: "violet" },
              { icon: "🔁", label: "재촬영률 낮음", desc: "1회 촬영 완성도 높음", color: "amber" },
            ].map(({ icon, label, desc, color }) => (
              <div key={label} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-start gap-3 card-hover">
                <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center text-xl flex-shrink-0`}>{icon}</div>
                <div>
                  <div className="text-sm font-bold text-slate-800">{label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={formRef} className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-600 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              Step 1
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">촬영 요청 작성</h2>
            <p className="text-slate-500">입력 내용을 기반으로 최적의 조종자를 AI가 매칭합니다</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">촬영 목적 <span className="text-red-400">*</span></label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {["홍보영상", "부동산", "행사", "시설점검", "여행콘텐츠"].map(p => (
                  <button
                    key={p}
                    onClick={() => setForm(f => ({ ...f, purpose: p }))}
                    className={`py-2.5 px-3 rounded-xl text-sm font-semibold border transition-all ${
                      form.purpose === p
                        ? "gradient-sky text-white border-sky-500 shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">촬영 지역</label>
                <input
                  type="text"
                  placeholder="예: 서울 강남구, 부산 해운대"
                  value={form.region}
                  onChange={e => setForm(f => ({ ...f, region: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 bg-slate-50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">희망 날짜</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 bg-slate-50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">예산 (원)</label>
              <select
                value={form.budget}
                onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 bg-slate-50 transition-all"
              >
                <option value="">예산 범위 선택</option>
                <option value="under200">20만원 미만</option>
                <option value="200-400">20~40만원</option>
                <option value="400-600">40~60만원</option>
                <option value="600-1000">60~100만원</option>
                <option value="over1000">100만원 이상</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">결과물 형태 (복수 선택 가능)</label>
              <div className="flex flex-wrap gap-2">
                {["사진", "영상", "편집본"].map(d => (
                  <button
                    key={d}
                    onClick={() => handleDeliverable(d)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                      form.deliverable.includes(d)
                        ? "bg-sky-500 text-white border-sky-500"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-sky-300"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">비행 허가 필요 여부</label>
              <div className="grid grid-cols-3 gap-2">
                {["모름", "필요", "불필요"].map(p => (
                  <button
                    key={p}
                    onClick={() => setForm(f => ({ ...f, permit: p }))}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      form.permit === p
                        ? "gradient-sky text-white border-sky-500"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              {(form.permit === "모름" || form.permit === "필요") && (
                <div className="mt-2 flex items-start gap-2 bg-sky-50 rounded-xl p-3">
                  <span className="text-sky-500 text-sm mt-0.5">ℹ️</span>
                  <p className="text-xs text-sky-700">허가 대행이 가능한 조종자를 우선 추천합니다.</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">상세 요청사항</label>
              <textarea
                rows={3}
                placeholder="촬영 목적, 장소 특이사항, 특별 요청 등을 자유롭게 입력하세요."
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 bg-slate-50 transition-all resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full gradient-sky text-white font-bold py-4 rounded-xl text-base hover:opacity-90 transition-all hover:shadow-lg hover:shadow-sky-500/30"
            >
              {submitted ? "✓ 조종자 매칭 완료 — 아래에서 확인하세요" : "조종자 매칭 시작하기 →"}
            </button>
          </div>
        </div>
      </section>

      <section ref={pilotsRef} className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-600 text-xs font-bold px-3 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                {submitted ? "AI 매칭 결과" : "전체 조종자"}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {submitted ? "추천 조종자" : "검증된 드론 조종자"}
              </h2>
              {submitted && (
                <p className="text-slate-500 text-sm mt-1">요청 조건 기반으로 매칭 점수 순 정렬</p>
              )}
            </div>
            {compared.length > 0 && (
              <div className="flex items-center gap-3 bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-xl">
                <span>{compared.length}명 비교 선택됨</span>
                <button
                  className="bg-white text-sky-600 text-xs font-bold px-3 py-1 rounded-lg"
                  onClick={() => document.getElementById("compare-section")?.scrollIntoView({ behavior: "smooth" })}
                >
                  비교 보기
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedPilots.map((pilot, idx) => (
              <PilotCard
                key={pilot.id}
                pilot={pilot}
                submitted={submitted}
                isCompared={compared.some(p => p.id === pilot.id)}
                onCompare={toggleCompare}
                onRequest={setModalPilot}
                idx={idx}
              />
            ))}
          </div>
        </div>
      </section>

      {compared.length >= 2 && (
        <section id="compare-section" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-600 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
                비교 분석
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">조종자 상세 비교</h2>
              <p className="text-slate-500 mt-2 text-sm">선택한 조종자의 핵심 지표를 한눈에 비교하세요</p>
            </div>
            <CompareTable pilots={compared} onRequest={setModalPilot} />
          </div>
        </section>
      )}

      {modalPilot && (
        <RequestModal
          pilot={modalPilot}
          sent={requestSent}
          onSend={() => setRequestSent(true)}
          onClose={() => { setModalPilot(null); setRequestSent(false); }}
        />
      )}
    </div>
  );
}

function PilotCard({ pilot, submitted, isCompared, onCompare, onRequest, idx }) {
  const badges = [];
  if (pilot.permitSupport) badges.push({ label: "허가 대행", color: "sky", icon: "📋" });
  if (pilot.insured) badges.push({ label: "보험 가입", color: "emerald", icon: "🛡" });
  if (pilot.deliveryRate >= 97) badges.push({ label: "납기 우수", color: "violet", icon: "🎯" });
  if (pilot.reshootRate < 3) badges.push({ label: "재촬영 낮음", color: "amber", icon: "🔁" });

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden card-hover fade-in"
      style={{ animationDelay: `${idx * 60}ms` }}
    >
      {submitted && (
        <div className="h-1 bg-slate-100">
          <div className="h-full gradient-sky match-bar" style={{ width: `${pilot.score}%` }} />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-sky rounded-2xl flex items-center justify-center text-2xl shadow-sm">
              {pilot.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm">{pilot.name}</span>
                {pilot.badge === "top" && (
                  <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded-full">TOP</span>
                )}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{pilot.region[0]} {pilot.region.length > 1 ? `외 ${pilot.region.length - 1}개 지역` : ""}</div>
            </div>
          </div>
          {submitted && (
            <div className="text-right">
              <div className="text-lg font-black text-sky-600">{pilot.score}%</div>
              <div className="text-[10px] text-slate-400">매칭 점수</div>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mb-3">{pilot.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {pilot.specialty.map(s => (
            <span key={s} className="text-[11px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-md">{s}</span>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {badges.map(b => (
            <span key={b.label} className="text-[11px] font-semibold px-2 py-0.5 rounded-full border"
              style={{
                background: b.color === "sky" ? "#e0f2fe" : b.color === "emerald" ? "#d1fae5" : b.color === "violet" ? "#ede9fe" : "#fef3c7",
                color: b.color === "sky" ? "#0369a1" : b.color === "emerald" ? "#065f46" : b.color === "violet" ? "#5b21b6" : "#92400e",
                borderColor: b.color === "sky" ? "#bae6fd" : b.color === "emerald" ? "#a7f3d0" : b.color === "violet" ? "#ddd6fe" : "#fde68a",
              }}>
              {b.icon} {b.label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-xl p-3 mb-4">
          <div className="text-center">
            <div className="text-sm font-black text-slate-800">{pilot.deliveryRate}%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">납기 준수</div>
          </div>
          <div className="text-center border-x border-slate-200">
            <div className="text-sm font-black text-slate-800">{pilot.reshootRate}%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">재촬영률</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-black text-slate-800">{pilot.responseTime.replace("이내", "")}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">응답 시간</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <StarRating rating={pilot.rating} />
          <div className="text-right">
            <span className="text-xs text-slate-400">시작가 </span>
            <span className="font-black text-sky-700">{pilot.startPrice.toLocaleString()}원~</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onRequest(pilot)}
            className="flex-1 gradient-sky text-white text-sm font-bold py-2.5 rounded-xl hover:opacity-90 transition-all"
          >
            견적 요청하기
          </button>
          <button
            onClick={() => onCompare(pilot)}
            className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              isCompared
                ? "bg-sky-50 border-sky-300 text-sky-700"
                : "bg-slate-50 border-slate-200 text-slate-500 hover:border-sky-200 hover:bg-sky-50"
            }`}
          >
            {isCompared ? "✓ 비교중" : "+ 비교"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CompareTable({ pilots, onRequest }) {
  const rows = [
    { label: "시작 가격", key: v => `${v.startPrice.toLocaleString()}원~` },
    { label: "전문 분야", key: v => v.specialty.join(", ") },
    { label: "활동 지역", key: v => v.region.join(", ") },
    { label: "허가 대행", key: v => v.permitSupport ? "✅ 가능" : "❌ 불가" },
    { label: "보험", key: v => v.insured ? "✅ 가입" : "❌ 미가입" },
    { label: "재촬영률", key: v => `${v.reshootRate}%` },
    { label: "납기 준수율", key: v => `${v.deliveryRate}%` },
    { label: "평점", key: v => `⭐ ${v.rating} (${v.reviews}건)` },
    { label: "예상 응답", key: v => v.responseTime },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left text-xs font-bold text-slate-500 px-4 py-3 w-28">항목</th>
            {pilots.map(p => (
              <th key={p.id} className="text-center px-4 py-3">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl">{p.avatar}</span>
                  <span className="font-bold text-slate-900 text-xs">{p.name}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row.label} className={`border-b border-slate-100 ${ri % 2 === 0 ? "" : "bg-slate-50/50"}`}>
              <td className="px-4 py-3 text-xs font-semibold text-slate-500">{row.label}</td>
              {pilots.map(p => (
                <td key={p.id} className="px-4 py-3 text-center text-sm text-slate-700 font-medium">
                  {row.key(p)}
                </td>
              ))}
            </tr>
          ))}
          <tr className="bg-sky-50">
            <td className="px-4 py-4 text-xs font-bold text-slate-500">견적 요청</td>
            {pilots.map(p => (
              <td key={p.id} className="px-4 py-4 text-center">
                <button
                  onClick={() => onRequest(p)}
                  className="gradient-sky text-white text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-all"
                >
                  선택하기
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function RequestModal({ pilot, sent, onSend, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop bg-black/50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {sent ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-black text-slate-900 mb-2">견적 요청 접수 완료!</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              견적 요청이 접수되었습니다.<br />
              <strong className="text-slate-700">{pilot.name}</strong>이(가) 촬영 가능 여부와 허가 필요 여부를 확인한 뒤 응답합니다.
            </p>
            <div className="bg-sky-50 rounded-2xl p-4 mb-6 text-left">
              <p className="text-xs text-sky-700 font-semibold mb-1">예상 응답 시간</p>
              <p className="text-sky-900 font-black">{pilot.responseTime}</p>
            </div>
            <button onClick={onClose} className="w-full gradient-sky text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all">
              확인
            </button>
          </div>
        ) : (
          <>
            <div className="gradient-sky p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">{pilot.avatar}</div>
                <div>
                  <h3 className="font-black text-lg">{pilot.name}</h3>
                  <p className="text-sky-100 text-sm">{pilot.region[0]} • {pilot.specialty[0]}</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">견적 요청 전 확인사항</p>
                <div className="space-y-2">
                  {[
                    pilot.permitSupport ? "이 조종자는 허가 대행이 가능합니다." : "이 조종자는 허가 대행을 지원하지 않습니다.",
                    `평균 응답 시간: ${pilot.responseTime}`,
                    `납기 준수율: ${pilot.deliveryRate}% | 재촬영률: ${pilot.reshootRate}%`,
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-sky-500 mt-0.5">•</span>{item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-amber-50 rounded-xl p-3">
                <p className="text-xs text-amber-700 font-semibold">💡 안내</p>
                <p className="text-xs text-amber-600 mt-0.5">견적 요청은 계약이 아닙니다. 조종자의 응답 이후 최종 확인 과정이 있습니다.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={onClose} className="py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all">
                  취소
                </button>
                <button onClick={onSend} className="py-3 rounded-xl gradient-sky text-white font-bold text-sm hover:opacity-90 transition-all">
                  견적 요청하기
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
