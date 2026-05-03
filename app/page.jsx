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
    headline: "리조트·풀빌라 홍보영상 전문",
    specialties: ["홍보영상", "여행콘텐츠", "부동산"],
    style_tags: ["시네마틱", "감성적인", "자연광"],
    price: 750000,
    delivery_rate: 97,
    reshoot_rate: 1.8,
    experience: "비행 경력 6년",
    bio: "숙박업체와 관광 브랜드를 위한 항공 영상을 제작합니다.",
    portfolio_url: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    thumbnail_url:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "mock-2",
    user_id: "mock-2",
    display_name: "Seoul Skyline Drone",
    region: "서울",
    headline: "상업공간·건물 외관 항공 컷 전문",
    specialties: ["부동산", "홍보영상"],
    style_tags: ["도시적인", "깔끔한", "브랜드형"],
    price: 620000,
    delivery_rate: 98,
    reshoot_rate: 1.5,
    experience: "비행 경력 5년",
    bio: "상업용 건물, 오피스, 모델하우스 촬영을 주로 진행합니다.",
    portfolio_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail_url:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "mock-3",
    user_id: "mock-3",
    display_name: "Forest Angle Studio",
    region: "강원",
    headline: "산악·캠핑·야외 행사 촬영 전문",
    specialties: ["행사", "여행콘텐츠"],
    style_tags: ["자연친화적", "다큐멘터리", "역동적인"],
    price: 500000,
    delivery_rate: 94,
    reshoot_rate: 2.7,
    experience: "비행 경력 4년",
    bio: "아웃도어 브랜드와 야외 행사 스케치 촬영을 진행합니다.",
    portfolio_url: "",
    thumbnail_url:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80",
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
  let score = 20;
  const reasons = [];

  if (pilot.region === form.region) {
    score += 30;
    reasons.push("촬영 지역이 일치합니다");
  }

  if ((pilot.specialties || []).includes(form.purpose)) {
    score += 30;
    reasons.push("비슷한 촬영 포트폴리오가 있습니다");
  }

  if (Number(pilot.delivery_rate) >= 95) {
    score += 10;
    reasons.push("납품 만족도가 높습니다");
  }

  if (Number(pilot.reshoot_rate) <= 2) {
    score += 10;
    reasons.push("재촬영률이 낮습니다");
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
    styleTagsText: "시네마틱, 감성적인",
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

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-gray-950">
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button
            onClick={() => setStep("home")}
            className="text-xl font-black text-orange-500"
          >
            DroneSafeMatch
          </button>

          <nav className="hidden gap-8 text-sm font-semibold text-gray-600 md:flex">
            <button onClick={() => setStep("home")}>홈</button>
            <button onClick={() => setStep("request")}>촬영 요청</button>
            <button onClick={() => setStep("pilots")}>포트폴리오 보기</button>
            <button onClick={() => setStep("pilotManage")}>촬영자 관리</button>
          </nav>

          {session ? (
            <button
              onClick={() => supabase.auth.signOut()}
              className="rounded-full border px-5 py-2 text-sm font-bold"
            >
              로그아웃
            </button>
          ) : (
            <button
              onClick={() => setStep("auth")}
              className="rounded-full bg-orange-500 px-5 py-2 text-sm font-bold text-white"
            >
              로그인 / 가입
            </button>
          )}
        </div>
      </header>

      {step === "home" && (
        <>
          <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-2">
            <div>
              <p className="mb-4 font-bold text-orange-500">
                포트폴리오 기반 드론 촬영 매칭
              </p>
              <h1 className="text-5xl font-black leading-tight md:text-6xl">
                잘 찍는 사람을
                <br />
                <span className="text-orange-500">영상으로 확인하고</span>
                <br />
                바로 연결하세요
              </h1>
              <p className="mt-7 text-lg leading-8 text-gray-600">
                가격과 평점만 비교하지 않습니다. 실제 포트폴리오, 촬영 스타일,
                지역 경험을 보고 내 프로젝트에 맞는 촬영자를 선택합니다.
              </p>

              <div className="mt-9 flex gap-4">
                <button
                  onClick={() => setStep("request")}
                  className="rounded-2xl bg-orange-500 px-7 py-4 font-black text-white shadow-xl shadow-orange-100"
                >
                  촬영 의뢰하기 →
                </button>
                <button
                  onClick={() => setStep("pilotManage")}
                  className="rounded-2xl border bg-white px-7 py-4 font-black"
                >
                  촬영자로 등록하기
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {fallbackPilots.slice(0, 4).map((p, i) => (
                <div
                  key={p.id}
                  className={`overflow-hidden rounded-[2rem] bg-white shadow-xl ${
                    i === 0 ? "col-span-2" : ""
                  }`}
                >
                  <img
                    src={p.thumbnail_url}
                    className={`w-full object-cover ${i === 0 ? "h-72" : "h-44"}`}
                    alt={p.display_name}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 pb-20">
            <div className="rounded-[2rem] bg-white p-8 shadow-sm">
              <p className="font-bold text-orange-500">핵심 방향</p>
              <h2 className="mt-3 text-3xl font-black">
                설명보다 결과물로 판단하는 플랫폼
              </h2>
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {[
                  ["영상 포트폴리오", "촬영자가 직접 등록한 대표작을 먼저 보여줍니다."],
                  ["촬영 스타일", "감성적, 시네마틱, 도시적 등 스타일 태그로 비교합니다."],
                  ["PR 강화", "촬영자가 자신의 강점과 사례를 직접 소개합니다."],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-3xl bg-[#fff6ef] p-6">
                    <h3 className="font-black">{t}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-600">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {step === "auth" && (
        <section className="mx-auto max-w-2xl px-6 py-16">
          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <div className="mb-6 flex gap-3">
              <button
                onClick={() => setAuthMode("signup")}
                className={`rounded-xl px-5 py-3 font-bold ${
                  authMode === "signup" ? "bg-orange-500 text-white" : "bg-orange-50"
                }`}
              >
                회원가입
              </button>
              <button
                onClick={() => setAuthMode("login")}
                className={`rounded-xl px-5 py-3 font-bold ${
                  authMode === "login" ? "bg-orange-500 text-white" : "bg-orange-50"
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
                    role === "client" ? "border-orange-400 bg-orange-50" : ""
                  }`}
                >
                  <b>의뢰자</b>
                  <p className="mt-2 text-sm text-gray-500">촬영을 맡기고 싶어요.</p>
                </button>
                <button
                  onClick={() => setRole("pilot")}
                  className={`rounded-2xl border p-5 text-left ${
                    role === "pilot" ? "border-orange-400 bg-orange-50" : ""
                  }`}
                >
                  <b>촬영자</b>
                  <p className="mt-2 text-sm text-gray-500">내 포트폴리오를 올리고 싶어요.</p>
                </button>
              </div>
            )}

            {authMode === "signup" && (
              <input
                placeholder="이름 또는 업체명"
                className="mb-4 w-full rounded-xl border p-4"
                value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
              />
            )}

            <input
              placeholder="이메일"
              className="mb-4 w-full rounded-xl border p-4"
              value={authForm.email}
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="비밀번호"
              className="mb-4 w-full rounded-xl border p-4"
              value={authForm.password}
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
            />

            <button
              onClick={authMode === "signup" ? handleSignup : handleLogin}
              className="w-full rounded-2xl bg-orange-500 p-4 font-black text-white"
            >
              {authMode === "signup" ? "가입하기" : "로그인하기"}
            </button>
          </div>
        </section>
      )}

      {step === "pilotManage" && (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-4xl font-black">촬영자 프로필 관리</h2>
          <p className="mt-3 text-gray-500">
            자기소개, 촬영 스타일, 대표작을 등록해 의뢰자에게 PR하세요.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-black">프로필 수정</h3>

              <div className="mt-6 grid gap-4">
                <input
                  placeholder="업체명 / 활동명"
                  className="rounded-xl border p-4"
                  value={pilotForm.display_name}
                  onChange={(e) =>
                    setPilotForm({ ...pilotForm, display_name: e.target.value })
                  }
                />
                <input
                  placeholder="한 줄 PR: 리조트·풀빌라 홍보영상 전문"
                  className="rounded-xl border p-4"
                  value={pilotForm.headline}
                  onChange={(e) => setPilotForm({ ...pilotForm, headline: e.target.value })}
                />
                <select
                  className="rounded-xl border p-4"
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
                  className="rounded-xl border p-4"
                  value={pilotForm.specialtiesText}
                  onChange={(e) =>
                    setPilotForm({ ...pilotForm, specialtiesText: e.target.value })
                  }
                />
                <input
                  placeholder="촬영 스타일: 시네마틱, 감성적인, 도시적인"
                  className="rounded-xl border p-4"
                  value={pilotForm.styleTagsText}
                  onChange={(e) =>
                    setPilotForm({ ...pilotForm, styleTagsText: e.target.value })
                  }
                />
                <input
                  placeholder="썸네일 이미지 URL"
                  className="rounded-xl border p-4"
                  value={pilotForm.thumbnail_url}
                  onChange={(e) =>
                    setPilotForm({ ...pilotForm, thumbnail_url: e.target.value })
                  }
                />
                <textarea
                  placeholder="자기소개"
                  className="h-28 rounded-xl border p-4"
                  value={pilotForm.bio}
                  onChange={(e) => setPilotForm({ ...pilotForm, bio: e.target.value })}
                />
              </div>

              <button
                onClick={savePilotProfile}
                className="mt-6 w-full rounded-2xl bg-orange-500 p-4 font-black text-white"
              >
                프로필 저장 / 수정
              </button>
            </div>

            <div className="rounded-[2rem] bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-black">포트폴리오 추가</h3>

              <div className="mt-6 grid gap-4">
                <input
                  placeholder="영상 제목"
                  className="rounded-xl border p-4"
                  value={workForm.title}
                  onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })}
                />
                <input
                  placeholder="유튜브 영상 링크"
                  className="rounded-xl border p-4"
                  value={workForm.video_url}
                  onChange={(e) => setWorkForm({ ...workForm, video_url: e.target.value })}
                />
                <input
                  placeholder="썸네일 이미지 URL"
                  className="rounded-xl border p-4"
                  value={workForm.thumbnail_url}
                  onChange={(e) =>
                    setWorkForm({ ...workForm, thumbnail_url: e.target.value })
                  }
                />
                <select
                  className="rounded-xl border p-4"
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
                  className="h-24 rounded-xl border p-4"
                  value={workForm.description}
                  onChange={(e) =>
                    setWorkForm({ ...workForm, description: e.target.value })
                  }
                />
              </div>

              <button
                onClick={saveWork}
                className="mt-6 w-full rounded-2xl bg-black p-4 font-black text-white"
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
            <h2 className="text-3xl font-black">촬영 요청</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <select
                className="rounded-xl border p-4"
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
                className="rounded-xl border p-4"
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
              className="mt-4 h-28 w-full rounded-xl border p-4"
              value={requestForm.detail}
              onChange={(e) => setRequestForm({ ...requestForm, detail: e.target.value })}
            />
            <button
              onClick={() => setStep("pilots")}
              className="mt-6 w-full rounded-2xl bg-orange-500 p-4 font-black text-white"
            >
              포트폴리오 기반 추천 보기
            </button>
          </div>
        </section>
      )}

      {step === "pilots" && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-4xl font-black">포트폴리오로 비교하세요</h2>
          <p className="mt-3 text-gray-500">
            카드 클릭 시 촬영자의 대표 영상과 PR 정보를 확인할 수 있습니다.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matchedPilots.map((p) => (
              <button
                key={p.id}
                onClick={() => openPilot(p)}
                className="group overflow-hidden rounded-[2rem] bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <img
                  src={
                    p.thumbnail_url ||
                    "https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&w=1000&q=80"
                  }
                  className="h-64 w-full object-cover transition group-hover:scale-105"
                  alt={p.display_name}
                />
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-black">{p.display_name}</h3>
                      <p className="mt-1 text-gray-500">{p.region} · {p.experience}</p>
                    </div>
                    <span className="rounded-full bg-orange-100 px-4 py-2 font-black text-orange-500">
                      {p.score}%
                    </span>
                  </div>

                  <p className="mt-4 font-bold">{p.headline}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(p.style_tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#fff3e8] px-3 py-1 text-xs font-bold text-orange-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    시작가 {Number(p.price || 0).toLocaleString()}원
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {selectedPilot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] bg-white p-8">
            <button
              onClick={() => setSelectedPilot(null)}
              className="float-right rounded-full bg-gray-100 px-4 py-2 font-bold"
            >
              닫기
            </button>

            <h2 className="text-4xl font-black">{selectedPilot.display_name}</h2>
            <p className="mt-3 text-xl font-bold text-orange-500">{selectedPilot.headline}</p>
            <p className="mt-4 leading-7 text-gray-600">{selectedPilot.bio}</p>

            <div className="mt-8">
              {selectedPilot.portfolio_url ? (
                <iframe
                  src={youtubeEmbed(selectedPilot.portfolio_url)}
                  className="h-[420px] w-full rounded-[2rem]"
                  allowFullScreen
                />
              ) : (
                <div className="rounded-[2rem] bg-[#fff6ef] p-16 text-center text-gray-500">
                  대표 영상이 아직 없습니다.
                </div>
              )}
            </div>

            <h3 className="mt-10 text-2xl font-black">포트폴리오</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {portfolio.length > 0 ? (
                portfolio.map((item) => (
                  <div key={item.id} className="overflow-hidden rounded-2xl bg-[#fbfaf7]">
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
                      <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">등록된 추가 포트폴리오가 없습니다.</p>
              )}
            </div>

            <button className="mt-10 w-full rounded-2xl bg-orange-500 p-4 font-black text-white">
              이 촬영자에게 견적 요청하기
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
