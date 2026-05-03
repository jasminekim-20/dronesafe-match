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
    user_id: "mock-1",
    display_name: "Jeju Air Visual",
    region: "제주",
    headline: "Resort & villa cinematic drone films",
    specialties: ["홍보영상", "여행콘텐츠", "부동산"],
    style_tags: ["Cinematic", "Soft Light", "Resort"],
    price: 750000,
    delivery_rate: 97,
    reshoot_rate: 1.8,
    experience: "비행 경력 6년",
    bio: "숙박업체와 관광 브랜드를 위한 감도 높은 항공 영상을 제작합니다.",
    portfolio_url: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    thumbnail_url:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mock-2",
    user_id: "mock-2",
    display_name: "Seoul Skyline",
    region: "서울",
    headline: "Architecture & commercial space aerials",
    specialties: ["부동산", "홍보영상"],
    style_tags: ["Architecture", "Urban", "Clean"],
    price: 620000,
    delivery_rate: 98,
    reshoot_rate: 1.5,
    experience: "비행 경력 5년",
    bio: "상업용 건물, 오피스, 모델하우스 촬영을 주로 진행합니다.",
    portfolio_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail_url:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mock-3",
    user_id: "mock-3",
    display_name: "Forest Angle",
    region: "강원",
    headline: "Outdoor, camping and nature brand films",
    specialties: ["행사", "여행콘텐츠"],
    style_tags: ["Nature", "Documentary", "Mood"],
    price: 500000,
    delivery_rate: 94,
    reshoot_rate: 2.7,
    experience: "비행 경력 4년",
    bio: "아웃도어 브랜드와 야외 행사 스케치 촬영을 진행합니다.",
    portfolio_url: "",
    thumbnail_url:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
  },
];

function youtubeEmbed(url) {
  if (!url) return "";
  const match =
    url.match(/youtube\.com\/watch\?v=([^&]+)/) ||
    url.match(/youtu\.be\/([^?]+)/) ||
    url.match(/youtube\.com\/shorts\/([^?]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

function getMatch(pilot, form) {
  let score = 25;
  const reasons = [];

  if (pilot.region === form.region) {
    score += 30;
    reasons.push("지역 경험 일치");
  }

  if ((pilot.specialties || []).includes(form.purpose)) {
    score += 30;
    reasons.push("비슷한 촬영 포트폴리오 보유");
  }

  if (Number(pilot.delivery_rate) >= 95) {
    score += 10;
    reasons.push("납품 만족도 우수");
  }

  if (Number(pilot.reshoot_rate) <= 2) {
    score += 5;
    reasons.push("재촬영률 낮음");
  }

  return { ...pilot, score: Math.min(score, 100), reasons };
}

export default function Home() {
  const [step, setStep] = useState("home");
  const [session, setSession] = useState(null);
  const [pilots, setPilots] = useState(fallbackPilots);
  const [selectedPilot, setSelectedPilot] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [authMode, setAuthMode] = useState("signup");
  const [role, setRole] = useState("client");

  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [requestForm, setRequestForm] = useState({
    region: "서울",
    purpose: "홍보영상",
    detail: "",
  });

  const [pilotForm, setPilotForm] = useState({
    display_name: "",
    region: "서울",
    headline: "",
    specialtiesText: "홍보영상, 부동산",
    styleTagsText: "Cinematic, Clean",
    price: 500000,
    delivery_rate: 96,
    reshoot_rate: 2.0,
    experience: "",
    bio: "",
    portfolio_url: "",
    thumbnail_url: "",
    client_examples: "",
  });

  const [workForm, setWorkForm] = useState({
    title: "",
    category: "홍보영상",
    video_url: "",
    thumbnail_url: "",
    description: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchPilots();

    return () => listener.subscription.unsubscribe();
  }, []);

  async function fetchPilots() {
    const { data } = await supabase
      .from("pilot_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (data && data.length > 0) setPilots(data);
  }

  async function fetchPortfolio(userId) {
    if (!userId || userId.startsWith("mock")) {
      setPortfolio([]);
      return;
    }

    const { data } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setPortfolio(data || []);
  }

  async function openPilot(pilot) {
    setSelectedPilot(pilot);
    await fetchPortfolio(pilot.user_id);
  }

  async function handleSignup() {
    const { data, error } = await supabase.auth.signUp({
      email: authForm.email,
      password: authForm.password,
    });

    if (error) return alert(error.message);

    if (data.user?.id) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        role,
        name: authForm.name,
      });
    }

    alert("가입 완료");
    setStep(role === "pilot" ? "pilotManage" : "request");
  }

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email: authForm.email,
      password: authForm.password,
    });

    if (error) return alert(error.message);

    alert("로그인 완료");
    setStep("home");
  }

  async function savePilotProfile() {
    if (!session?.user) {
      alert("먼저 로그인해주세요.");
      setStep("auth");
      setRole("pilot");
      return;
    }

    const payload = {
      user_id: session.user.id,
      display_name: pilotForm.display_name,
      region: pilotForm.region,
      headline: pilotForm.headline,
      specialties: pilotForm.specialtiesText.split(",").map((x) => x.trim()),
      style_tags: pilotForm.styleTagsText.split(",").map((x) => x.trim()),
      price: Number(pilotForm.price),
      delivery_rate: Number(pilotForm.delivery_rate),
      reshoot_rate: Number(pilotForm.reshoot_rate),
      experience: pilotForm.experience,
      bio: pilotForm.bio,
      portfolio_url: pilotForm.portfolio_url,
      thumbnail_url: pilotForm.thumbnail_url,
      client_examples: pilotForm.client_examples,
      permit_support: false,
      insured: false,
    };

    const { error } = await supabase
      .from("pilot_profiles")
      .upsert(payload, { onConflict: "user_id" });

    if (error) return alert(error.message);

    alert("프로필이 저장되었습니다.");
    await fetchPilots();
    setStep("pilots");
  }

  async function saveWork() {
    if (!session?.user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const { error } = await supabase.from("portfolio_items").insert({
      user_id: session.user.id,
      ...workForm,
    });

    if (error) return alert(error.message);

    alert("포트폴리오가 추가되었습니다.");
    setWorkForm({
      title: "",
      category: "홍보영상",
      video_url: "",
      thumbnail_url: "",
      description: "",
    });
  }

  const matchedPilots = useMemo(() => {
    return pilots
      .map((p) => getMatch(p, requestForm))
      .sort((a, b) => b.score - a.score);
  }, [pilots, requestForm]);

  const inputClass =
    "w-full rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-sm outline-none transition focus:border-neutral-900";

  const primaryButton =
    "rounded-full bg-neutral-950 px-7 py-4 text-sm font-bold text-white transition hover:bg-neutral-800";

  const secondaryButton =
    "rounded-full border border-neutral-300 bg-white px-7 py-4 text-sm font-bold text-neutral-900 transition hover:border-neutral-900";

  return (
    <main className="min-h-screen bg-[#f7f6f3] text-neutral-950">
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-[#f7f6f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button
            onClick={() => setStep("home")}
            className="text-xl font-black tracking-tight"
          >
            DroneSafeMatch
          </button>

          <nav className="hidden gap-8 text-sm font-semibold text-neutral-500 md:flex">
            <button onClick={() => setStep("home")} className="hover:text-neutral-950">
              Home
            </button>
            <button onClick={() => setStep("request")} className="hover:text-neutral-950">
              Request
            </button>
            <button onClick={() => setStep("pilots")} className="hover:text-neutral-950">
              Portfolio
            </button>
            <button onClick={() => setStep("pilotManage")} className="hover:text-neutral-950">
              Creator Studio
            </button>
          </nav>

          {session ? (
            <button
              onClick={() => supabase.auth.signOut()}
              className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-bold"
            >
              로그아웃
            </button>
          ) : (
            <button
              onClick={() => setStep("auth")}
              className="rounded-full bg-neutral-950 px-5 py-2 text-sm font-bold text-white"
            >
              로그인 / 가입
            </button>
          )}
        </div>
      </header>

      {step === "home" && (
        <>
          <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-neutral-400">
                Portfolio-first drone matching
              </p>

              <h1 className="text-6xl font-black leading-[0.95] tracking-tight md:text-7xl">
                Find the right
                <br />
                drone creator
                <br />
                by their work.
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-8 text-neutral-600">
                가격과 평점보다 먼저, 실제 촬영 결과물과 스타일을 확인하세요.
                프로젝트에 맞는 드론 촬영자를 포트폴리오로 비교하고 바로 연결합니다.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <button onClick={() => setStep("request")} className={primaryButton}>
                  촬영 의뢰하기
                </button>
                <button onClick={() => setStep("pilotManage")} className={secondaryButton}>
                  촬영자로 등록하기
                </button>
              </div>
            </div>

            <div className="grid grid-cols-5 grid-rows-5 gap-4">
              <div className="col-span-5 row-span-3 overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                  className="h-full w-full object-cover"
                  alt="hero"
                />
              </div>

              <div className="col-span-2 row-span-2 overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80"
                  className="h-full w-full object-cover"
                  alt="building"
                />
              </div>

              <div className="col-span-3 row-span-2 overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80"
                  className="h-full w-full object-cover"
                  alt="forest"
                />
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 pb-20">
            <div className="grid gap-5 md:grid-cols-3">
              {[
                ["Visual portfolio", "촬영자가 등록한 대표 영상과 썸네일 중심으로 비교합니다."],
                ["Style tags", "시네마틱, 도시적, 자연광 등 스타일을 빠르게 파악합니다."],
                ["Direct request", "마음에 드는 촬영자에게 바로 견적 요청을 보낼 수 있습니다."],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-[2rem] bg-white p-7 shadow-sm">
                  <h3 className="text-xl font-black">{title}</h3>
                  <p className="mt-4 text-sm leading-6 text-neutral-500">{desc}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {step === "auth" && (
        <section className="mx-auto max-w-2xl px-6 py-16">
          <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-neutral-200">
            <div className="mb-6 flex gap-3">
              <button
                onClick={() => setAuthMode("signup")}
                className={`rounded-full px-5 py-3 font-bold ${
                  authMode === "signup" ? "bg-neutral-950 text-white" : "bg-neutral-100"
                }`}
              >
                회원가입
              </button>
              <button
                onClick={() => setAuthMode("login")}
                className={`rounded-full px-5 py-3 font-bold ${
                  authMode === "login" ? "bg-neutral-950 text-white" : "bg-neutral-100"
                }`}
              >
                로그인
              </button>
            </div>

            {authMode === "signup" && (
              <div className="mb-5 grid grid-cols-2 gap-4">
                <button
                  onClick={() => setRole("client")}
                  className={`rounded-2xl border p-5 text-left ${
                    role === "client" ? "border-neutral-950 bg-neutral-50" : "border-neutral-200"
                  }`}
                >
                  <b>의뢰자</b>
                  <p className="mt-2 text-sm text-neutral-500">촬영을 맡기고 싶어요.</p>
                </button>
                <button
                  onClick={() => setRole("pilot")}
                  className={`rounded-2xl border p-5 text-left ${
                    role === "pilot" ? "border-neutral-950 bg-neutral-50" : "border-neutral-200"
                  }`}
                >
                  <b>촬영자</b>
                  <p className="mt-2 text-sm text-neutral-500">포트폴리오를 올리고 싶어요.</p>
                </button>
              </div>
            )}

            {authMode === "signup" && (
              <input
                placeholder="이름 또는 업체명"
                className={`${inputClass} mb-4`}
                value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
              />
            )}

            <input
              placeholder="이메일"
              className={`${inputClass} mb-4`}
              value={authForm.email}
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="비밀번호"
              className={`${inputClass} mb-4`}
              value={authForm.password}
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
            />

            <button
              onClick={authMode === "signup" ? handleSignup : handleLogin}
              className="w-full rounded-full bg-neutral-950 p-4 font-black text-white"
            >
              {authMode === "signup" ? "가입하기" : "로그인하기"}
            </button>
          </div>
        </section>
      )}

      {step === "pilotManage" && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-5xl font-black tracking-tight">Creator Studio</h2>
          <p className="mt-4 text-neutral-500">
            촬영자 프로필과 포트폴리오를 등록하고 수정하세요.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-black">Profile</h3>

              <div className="mt-6 grid gap-4">
                <input
                  placeholder="업체명 / 활동명"
                  className={inputClass}
                  value={pilotForm.display_name}
                  onChange={(e) =>
                    setPilotForm({ ...pilotForm, display_name: e.target.value })
                  }
                />
                <input
                  placeholder="한 줄 PR"
                  className={inputClass}
                  value={pilotForm.headline}
                  onChange={(e) => setPilotForm({ ...pilotForm, headline: e.target.value })}
                />
                <select
                  className={inputClass}
                  value={pilotForm.region}
                  onChange={(e) => setPilotForm({ ...pilotForm, region: e.target.value })}
                >
                  <option>서울</option>
                  <option>경기</option>
                  <option>부산</option>
                  <option>제주</option>
                  <option>강원</option>
                  <option>대전</option>
                </select>
                <input
                  placeholder="전문 분야: 홍보영상, 부동산, 행사"
                  className={inputClass}
                  value={pilotForm.specialtiesText}
                  onChange={(e) =>
                    setPilotForm({ ...pilotForm, specialtiesText: e.target.value })
                  }
                />
                <input
                  placeholder="촬영 스타일: Cinematic, Clean, Mood"
                  className={inputClass}
                  value={pilotForm.styleTagsText}
                  onChange={(e) =>
                    setPilotForm({ ...pilotForm, styleTagsText: e.target.value })
                  }
                />
                <input
                  placeholder="대표 썸네일 이미지 URL"
                  className={inputClass}
                  value={pilotForm.thumbnail_url}
                  onChange={(e) =>
                    setPilotForm({ ...pilotForm, thumbnail_url: e.target.value })
                  }
                />
                <textarea
                  placeholder="자기소개"
                  className="h-28 rounded-2xl border border-neutral-200 p-4 outline-none focus:border-neutral-950"
                  value={pilotForm.bio}
                  onChange={(e) => setPilotForm({ ...pilotForm, bio: e.target.value })}
                />
              </div>

              <button
                onClick={savePilotProfile}
                className="mt-6 w-full rounded-full bg-neutral-950 p-4 font-black text-white"
              >
                프로필 저장 / 수정
              </button>
            </div>

            <div className="rounded-[2rem] bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-black">Portfolio</h3>

              <div className="mt-6 grid gap-4">
                <input
                  placeholder="영상 제목"
                  className={inputClass}
                  value={workForm.title}
                  onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })}
                />
                <input
                  placeholder="유튜브 영상 링크"
                  className={inputClass}
                  value={workForm.video_url}
                  onChange={(e) => setWorkForm({ ...workForm, video_url: e.target.value })}
                />
                <input
                  placeholder="썸네일 이미지 URL"
                  className={inputClass}
                  value={workForm.thumbnail_url}
                  onChange={(e) =>
                    setWorkForm({ ...workForm, thumbnail_url: e.target.value })
                  }
                />
                <select
                  className={inputClass}
                  value={workForm.category}
                  onChange={(e) => setWorkForm({ ...workForm, category: e.target.value })}
                >
                  <option>홍보영상</option>
                  <option>부동산</option>
                  <option>행사</option>
                  <option>여행콘텐츠</option>
                </select>
                <textarea
                  placeholder="작품 설명"
                  className="h-24 rounded-2xl border border-neutral-200 p-4 outline-none focus:border-neutral-950"
                  value={workForm.description}
                  onChange={(e) =>
                    setWorkForm({ ...workForm, description: e.target.value })
                  }
                />
              </div>

              <button
                onClick={saveWork}
                className="mt-6 w-full rounded-full bg-neutral-950 p-4 font-black text-white"
              >
                포트폴리오 등록
              </button>
            </div>
          </div>
        </section>
      )}

      {step === "request" && (
        <section className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="text-4xl font-black">촬영 요청</h2>
            <p className="mt-3 text-neutral-500">
              지역과 촬영 목적을 입력하면 포트폴리오 기반으로 추천합니다.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <select
                className={inputClass}
                value={requestForm.region}
                onChange={(e) => setRequestForm({ ...requestForm, region: e.target.value })}
              >
                <option>서울</option>
                <option>경기</option>
                <option>부산</option>
                <option>제주</option>
                <option>강원</option>
                <option>대전</option>
              </select>
              <select
                className={inputClass}
                value={requestForm.purpose}
                onChange={(e) => setRequestForm({ ...requestForm, purpose: e.target.value })}
              >
                <option>홍보영상</option>
                <option>부동산</option>
                <option>행사</option>
                <option>여행콘텐츠</option>
              </select>
            </div>

            <textarea
              placeholder="상세 요청사항"
              className="mt-4 h-28 w-full rounded-2xl border border-neutral-200 p-4 outline-none focus:border-neutral-950"
              value={requestForm.detail}
              onChange={(e) => setRequestForm({ ...requestForm, detail: e.target.value })}
            />

            <button
              onClick={() => setStep("pilots")}
              className="mt-6 w-full rounded-full bg-neutral-950 p-4 font-black text-white"
            >
              포트폴리오 기반 추천 보기
            </button>
          </div>
        </section>
      )}

      {step === "pilots" && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-5xl font-black tracking-tight">Explore portfolios</h2>
          <p className="mt-4 text-neutral-500">
            카드 클릭 시 촬영자의 대표 영상과 PR 정보를 확인할 수 있습니다.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matchedPilots.map((p) => (
              <button
                key={p.id}
                onClick={() => openPilot(p)}
                className="group overflow-hidden rounded-[2rem] bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-neutral-200"
              >
                <div className="overflow-hidden">
                  <img
                    src={
                      p.thumbnail_url ||
                      "https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&w=1000&q=80"
                    }
                    className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                    alt={p.display_name}
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight">{p.display_name}</h3>
                      <p className="mt-1 text-sm text-neutral-500">
                        {p.region} · {p.experience}
                      </p>
                    </div>
                    <span className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-black">
                      {p.score}%
                    </span>
                  </div>

                  <p className="mt-4 font-semibold text-neutral-800">{p.headline}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(p.style_tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="mt-5 text-sm text-neutral-500">
                    시작가 {Number(p.price || 0).toLocaleString()}원
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {selectedPilot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] bg-white p-8">
            <button
              onClick={() => setSelectedPilot(null)}
              className="float-right rounded-full bg-neutral-100 px-4 py-2 font-bold"
            >
              닫기
            </button>

            <h2 className="text-5xl font-black tracking-tight">{selectedPilot.display_name}</h2>
            <p className="mt-3 text-xl font-semibold text-neutral-500">
              {selectedPilot.headline}
            </p>
            <p className="mt-4 max-w-3xl leading-7 text-neutral-600">{selectedPilot.bio}</p>

            <div className="mt-8">
              {selectedPilot.portfolio_url ? (
                <iframe
                  src={youtubeEmbed(selectedPilot.portfolio_url)}
                  className="h-[420px] w-full rounded-[2rem]"
                  allowFullScreen
                />
              ) : (
                <div className="rounded-[2rem] bg-neutral-100 p-16 text-center text-neutral-500">
                  대표 영상이 아직 없습니다.
                </div>
              )}
            </div>

            <h3 className="mt-10 text-2xl font-black">Portfolio</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {portfolio.length > 0 ? (
                portfolio.map((item) => (
                  <div key={item.id} className="overflow-hidden rounded-2xl bg-neutral-50">
                    <img
                      src={
                        item.thumbnail_url ||
                        "https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&w=1000&q=80"
                      }
                      className="h-40 w-full object-cover"
                      alt={item.title}
                    />
                    <div className="p-4">
                      <p className="font-black">{item.title}</p>
                      <p className="mt-1 text-sm text-neutral-500">{item.category}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-neutral-500">등록된 추가 포트폴리오가 없습니다.</p>
              )}
            </div>

            <button className="mt-10 w-full rounded-full bg-neutral-950 p-4 font-black text-white">
              이 촬영자에게 견적 요청하기
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
