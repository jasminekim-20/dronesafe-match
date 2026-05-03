"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const fallbackPilots = [
  {
    id: "mock-1",
    display_name: "Seoul Air Studio",
    region: "서울",
    specialties: ["홍보영상", "부동산"],
    price: 600000,
    permit_support: true,
    insured: true,
    delivery_rate: 98,
    reshoot_rate: 1.5,
    experience: "비행 경력 5년",
    bio: "리조트, 브랜드, 부동산 홍보 촬영 전문입니다.",
    portfolio_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "mock-2",
    display_name: "Jeju Drone Film",
    region: "제주",
    specialties: ["홍보영상", "여행콘텐츠", "행사"],
    price: 750000,
    permit_support: true,
    insured: true,
    delivery_rate: 97,
    reshoot_rate: 1.9,
    experience: "비행 경력 7년",
    bio: "관광지, 숙박업소, 야외 행사 항공 영상 촬영 전문입니다.",
    portfolio_url: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
  },
  {
    id: "mock-3",
    display_name: "Busan Sky Works",
    region: "부산",
    specialties: ["행사", "부동산"],
    price: 450000,
    permit_support: false,
    insured: true,
    delivery_rate: 93,
    reshoot_rate: 3.2,
    experience: "비행 경력 4년",
    bio: "행사 스케치와 상업 공간 촬영을 주로 진행합니다.",
    portfolio_url: "",
  },
];

function youtubeEmbedUrl(url) {
  if (!url) return "";
  const match =
    url.match(/youtube\.com\/watch\?v=([^&]+)/) ||
    url.match(/youtu\.be\/([^?]+)/) ||
    url.match(/youtube\.com\/shorts\/([^?]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

function getMatch(pilot, form) {
  let score = 0;
  const reasons = [];

  if (pilot.region === form.region) {
    score += 25;
    reasons.push("촬영 지역 일치");
  }

  if ((pilot.specialties || []).includes(form.purpose)) {
    score += 25;
    reasons.push("촬영 목적 전문");
  }

  if ((form.permitNeed === "필요" || form.permitNeed === "모름") && pilot.permit_support) {
    score += 20;
    reasons.push("허가 대행 가능");
  }

  if (pilot.insured) {
    score += 15;
    reasons.push("보험 가입 완료");
  }

  if (Number(pilot.delivery_rate) >= 95) {
    score += 10;
    reasons.push("납기 준수율 우수");
  }

  if (Number(pilot.reshoot_rate) <= 2) {
    score += 5;
    reasons.push("재촬영 리스크 낮음");
  }

  return { ...pilot, score, reasons };
}

export default function Home() {
  const [step, setStep] = useState("home");
  const [session, setSession] = useState(null);
  const [pilots, setPilots] = useState(fallbackPilots);
  const [selectedPilot, setSelectedPilot] = useState(null);
  const [authMode, setAuthMode] = useState("signup");
  const [role, setRole] = useState("client");

  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [pilotForm, setPilotForm] = useState({
    display_name: "",
    region: "서울",
    specialtiesText: "홍보영상, 부동산",
    price: 500000,
    permit_support: true,
    insured: true,
    delivery_rate: 96,
    reshoot_rate: 2.0,
    experience: "",
    bio: "",
    portfolio_url: "",
  });

  const [requestForm, setRequestForm] = useState({
    region: "서울",
    purpose: "홍보영상",
    date: "",
    budget: "70만원 이하",
    result: "영상",
    permitNeed: "모름",
    detail: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchPilots();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function fetchPilots() {
    const { data, error } = await supabase
      .from("pilot_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      setPilots(data);
    }
  }

  async function handleSignup() {
    if (!authForm.email || !authForm.password || !authForm.name) {
      alert("이메일, 비밀번호, 이름을 입력해주세요.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: authForm.email,
      password: authForm.password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data.user?.id;
    if (userId) {
      await supabase.from("profiles").insert({
        id: userId,
        role,
        name: authForm.name,
      });
    }

    alert("회원가입 완료. 이메일 인증이 필요한 경우 메일함을 확인해주세요.");
    if (role === "pilot") setStep("pilotRegister");
    else setStep("request");
  }

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email: authForm.email,
      password: authForm.password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("로그인 완료");
    setStep("home");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
    alert("로그아웃되었습니다.");
  }

  async function savePilotProfile() {
    const user = session?.user;

    if (!user) {
      alert("촬영자 프로필을 등록하려면 먼저 로그인해야 합니다.");
      setStep("auth");
      setRole("pilot");
      return;
    }

    const payload = {
      user_id: user.id,
      display_name: pilotForm.display_name,
      region: pilotForm.region,
      specialties: pilotForm.specialtiesText.split(",").map((x) => x.trim()).filter(Boolean),
      price: Number(pilotForm.price),
      permit_support: Boolean(pilotForm.permit_support),
      insured: Boolean(pilotForm.insured),
      delivery_rate: Number(pilotForm.delivery_rate),
      reshoot_rate: Number(pilotForm.reshoot_rate),
      experience: pilotForm.experience,
      bio: pilotForm.bio,
      portfolio_url: pilotForm.portfolio_url,
    };

    const { error } = await supabase.from("pilot_profiles").insert(payload);

    if (error) {
      alert(error.message);
      return;
    }

    alert("촬영자 프로필이 등록되었습니다.");
    await fetchPilots();
    setStep("pilots");
  }

  async function submitRequest(pilot) {
    if (session?.user) {
      await supabase.from("requests").insert({
        user_id: session.user.id,
        region: requestForm.region,
        purpose: requestForm.purpose,
        budget: requestForm.budget,
        desired_date: requestForm.date || null,
        permit_need: requestForm.permitNeed,
        detail: requestForm.detail,
      });
    }

    setSelectedPilot(pilot);
    setStep("complete");
  }

  const matchedPilots = useMemo(() => {
    return pilots
      .map((pilot) => getMatch(pilot, requestForm))
      .sort((a, b) => b.score - a.score);
  }, [pilots, requestForm]);

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
            <button onClick={() => setStep("pilotRegister")}>촬영자로 등록</button>
          </nav>

          <div className="flex gap-3">
            {session ? (
              <button onClick={handleLogout} className="rounded-xl border px-4 py-2 text-sm font-bold">
                로그아웃
              </button>
            ) : (
              <button onClick={() => setStep("auth")} className="rounded-xl border px-4 py-2 text-sm font-bold">
                로그인 / 회원가입
              </button>
            )}
            <button
              onClick={() => setStep("request")}
              className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-orange-200"
            >
              촬영 요청하기
            </button>
          </div>
        </div>
      </header>

      {step === "home" && (
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
              의뢰자는 촬영 목적과 지역을 입력하고, 촬영자는 포트폴리오를 등록합니다.
              <br />
              플랫폼은 허가·보험·납기·재촬영 리스크를 기준으로 조종자를 추천합니다.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <button
                onClick={() => setStep("auth")}
                className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 px-7 py-4 font-bold text-white shadow-xl shadow-orange-200"
              >
                회원가입 시작하기 →
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
              ].map(([title, label]) => (
                <div key={label}>
                  <p className="text-2xl font-black text-orange-500">{title}</p>
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
      )}

      {step === "auth" && (
        <section className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-orange-100">
            <div className="mb-6 flex gap-3">
              <button
                onClick={() => setAuthMode("signup")}
                className={`rounded-xl px-5 py-3 font-bold ${authMode === "signup" ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-500"}`}
              >
                회원가입
              </button>
              <button
                onClick={() => setAuthMode("login")}
                className={`rounded-xl px-5 py-3 font-bold ${authMode === "login" ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-500"}`}
              >
                로그인
              </button>
            </div>

            {authMode === "signup" && (
              <div className="mb-6 grid grid-cols-2 gap-4">
                <button
                  onClick={() => setRole("client")}
                  className={`rounded-2xl border p-6 text-left ${role === "client" ? "border-orange-400 bg-orange-50" : "border-gray-100"}`}
                >
                  <p className="font-black">의뢰자로 가입</p>
                  <p className="mt-2 text-sm text-gray-500">드론 촬영을 맡기고 싶어요.</p>
                </button>
                <button
                  onClick={() => setRole("pilot")}
                  className={`rounded-2xl border p-6 text-left ${role === "pilot" ? "border-orange-400 bg-orange-50" : "border-gray-100"}`}
                >
                  <p className="font-black">촬영자로 가입</p>
                  <p className="mt-2 text-sm text-gray-500">내 포트폴리오를 등록하고 싶어요.</p>
                </button>
              </div>
            )}

            <div className="space-y-4">
              {authMode === "signup" && (
                <input
                  placeholder="이름 또는 업체명"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  className="w-full rounded-xl border border-orange-100 p-4"
                />
              )}
              <input
                placeholder="이메일"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                className="w-full rounded-xl border border-orange-100 p-4"
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="w-full rounded-xl border border-orange-100 p-4"
              />
            </div>

            <button
              onClick={authMode === "signup" ? handleSignup : handleLogin}
              className="mt-6 w-full rounded-2xl bg-orange-500 px-7 py-4 font-black text-white shadow-xl shadow-orange-200"
            >
              {authMode === "signup" ? "가입하기" : "로그인하기"}
            </button>
          </div>
        </section>
      )}

      {step === "pilotRegister" && (
        <section className="mx-auto max-w-4xl px-6 py-16">
          <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-orange-100">
            <p className="text-sm font-bold text-orange-500">촬영자 등록</p>
            <h2 className="mt-2 text-3xl font-black">포트폴리오와 촬영 정보를 등록하세요</h2>
            <p className="mt-3 text-gray-500">
              영상 파일 직접 업로드 대신 유튜브 링크를 등록하는 방식입니다.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              <input placeholder="업체명 / 활동명" value={pilotForm.display_name} onChange={(e) => setPilotForm({ ...pilotForm, display_name: e.target.value })} className="rounded-xl border border-orange-100 p-4" />
              <select value={pilotForm.region} onChange={(e) => setPilotForm({ ...pilotForm, region: e.target.value })} className="rounded-xl border border-orange-100 p-4">
                <option>서울</option><option>경기</option><option>부산</option><option>제주</option><option>대전</option>
              </select>
              <input placeholder="전문 분야: 홍보영상, 부동산" value={pilotForm.specialtiesText} onChange={(e) => setPilotForm({ ...pilotForm, specialtiesText: e.target.value })} className="rounded-xl border border-orange-100 p-4" />
              <input type="number" placeholder="시작 가격" value={pilotForm.price} onChange={(e) => setPilotForm({ ...pilotForm, price: e.target.value })} className="rounded-xl border border-orange-100 p-4" />
              <input placeholder="경력: 비행 경력 5년" value={pilotForm.experience} onChange={(e) => setPilotForm({ ...pilotForm, experience: e.target.value })} className="rounded-xl border border-orange-100 p-4" />
              <input placeholder="유튜브 포트폴리오 링크" value={pilotForm.portfolio_url} onChange={(e) => setPilotForm({ ...pilotForm, portfolio_url: e.target.value })} className="rounded-xl border border-orange-100 p-4" />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <label className="rounded-xl bg-orange-50 p-4 font-bold">
                <input type="checkbox" checked={pilotForm.permit_support} onChange={(e) => setPilotForm({ ...pilotForm, permit_support: e.target.checked })} className="mr-2" />
                허가 대행 가능
              </label>
              <label className="rounded-xl bg-orange-50 p-4 font-bold">
                <input type="checkbox" checked={pilotForm.insured} onChange={(e) => setPilotForm({ ...pilotForm, insured: e.target.checked })} className="mr-2" />
                보험 가입 완료
              </label>
            </div>

            <textarea placeholder="자기소개 / 촬영 스타일" value={pilotForm.bio} onChange={(e) => setPilotForm({ ...pilotForm, bio: e.target.value })} className="mt-5 h-28 w-full rounded-xl border border-orange-100 p-4" />

            <button onClick={savePilotProfile} className="mt-8 w-full rounded-2xl bg-orange-500 px-7 py-4 font-black text-white shadow-xl shadow-orange-200">
              촬영자 프로필 등록하기
            </button>
          </div>
        </section>
      )}

      {step === "request" && (
        <section className="mx-auto max-w-4xl px-6 py-16">
          <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-orange-100">
            <p className="text-sm font-bold text-orange-500">촬영 요청</p>
            <h2 className="mt-2 text-3xl font-black">촬영 조건을 입력하세요</h2>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              <select value={requestForm.region} onChange={(e) => setRequestForm({ ...requestForm, region: e.target.value })} className="rounded-xl border border-orange-100 p-4">
                <option>서울</option><option>경기</option><option>부산</option><option>제주</option><option>대전</option>
              </select>
              <select value={requestForm.purpose} onChange={(e) => setRequestForm({ ...requestForm, purpose: e.target.value })} className="rounded-xl border border-orange-100 p-4">
                <option>홍보영상</option><option>부동산</option><option>행사</option><option>점검촬영</option><option>여행콘텐츠</option>
              </select>
              <input type="date" value={requestForm.date} onChange={(e) => setRequestForm({ ...requestForm, date: e.target.value })} className="rounded-xl border border-orange-100 p-4" />
              <select value={requestForm.permitNeed} onChange={(e) => setRequestForm({ ...requestForm, permitNeed: e.target.value })} className="rounded-xl border border-orange-100 p-4">
                <option>모름</option><option>필요</option><option>불필요</option>
              </select>
            </div>

            <textarea placeholder="상세 요청사항" value={requestForm.detail} onChange={(e) => setRequestForm({ ...requestForm, detail: e.target.value })} className="mt-5 h-28 w-full rounded-xl border border-orange-100 p-4" />

            <button onClick={() => setStep("pilots")} className="mt-8 w-full rounded-2xl bg-orange-500 px-7 py-4 font-black text-white shadow-xl shadow-orange-200">
              조건에 맞는 조종자 추천받기 →
            </button>
          </div>
        </section>
      )}

      {step === "pilots" && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl font-black">추천 조종자</h2>
          <p className="mt-3 text-gray-500">프로필을 클릭하면 포트폴리오 영상을 볼 수 있습니다.</p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matchedPilots.map((pilot) => (
              <div key={pilot.id} className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black">{pilot.display_name}</h3>
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-black text-orange-500">{pilot.score}%</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{pilot.region} · {pilot.experience}</p>
                <p className="mt-3 text-sm text-gray-600">시작가 {Number(pilot.price || 0).toLocaleString()}원</p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <span className="rounded-full bg-orange-50 px-3 py-2 text-center font-bold text-orange-500">{pilot.permit_support ? "허가 대행 가능" : "허가 미지원"}</span>
                  <span className="rounded-full bg-orange-50 px-3 py-2 text-center font-bold text-orange-500">{pilot.insured ? "보험 가입" : "보험 미확인"}</span>
                  <span className="rounded-full bg-gray-50 px-3 py-2 text-center font-bold text-gray-600">납기 {pilot.delivery_rate}%</span>
                  <span className="rounded-full bg-gray-50 px-3 py-2 text-center font-bold text-gray-600">재촬영 {pilot.reshoot_rate}%</span>
                </div>

                <div className="mt-5 text-sm text-gray-500">
                  {(pilot.reasons || []).map((r) => <p key={r}>✔ {r}</p>)}
                </div>

                <div className="mt-6 flex gap-3">
                  <button onClick={() => setSelectedPilot(pilot)} className="flex-1 rounded-xl border border-orange-200 px-4 py-3 font-bold text-orange-500">
                    프로필 보기
                  </button>
                  <button onClick={() => submitRequest(pilot)} className="flex-1 rounded-xl bg-orange-500 px-4 py-3 font-bold text-white">
                    견적 요청
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedPilot && step !== "complete" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white p-8">
            <button onClick={() => setSelectedPilot(null)} className="float-right text-gray-400">닫기</button>
            <h2 className="text-3xl font-black">{selectedPilot.display_name}</h2>
            <p className="mt-3 text-gray-500">{selectedPilot.bio}</p>

            {selectedPilot.portfolio_url ? (
              <iframe
                src={youtubeEmbedUrl(selectedPilot.portfolio_url)}
                className="mt-6 h-80 w-full rounded-2xl"
                allowFullScreen
              />
            ) : (
              <div className="mt-6 rounded-2xl bg-orange-50 p-10 text-center text-gray-500">
                등록된 포트폴리오 영상이 없습니다.
              </div>
            )}

            <button onClick={() => submitRequest(selectedPilot)} className="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 font-black text-white">
              이 조종자에게 견적 요청하기
            </button>
          </div>
        </div>
      )}

      {step === "complete" && (
        <section className="mx-auto max-w-3xl px-6 py-20">
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-xl shadow-orange-100">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl">✓</div>
            <h2 className="text-3xl font-black">견적 요청이 접수되었습니다</h2>
            <p className="mt-5 leading-7 text-gray-500">
              {selectedPilot?.display_name} 조종자에게 요청 내용이 전달되었습니다.
            </p>
            <button onClick={() => setStep("home")} className="mt-8 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white">
              홈으로
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
