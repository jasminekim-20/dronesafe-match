"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const DEFAULT_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
    <rect width="240" height="240" rx="120" fill="#eeeeee"/>
    <circle cx="120" cy="88" r="38" fill="#bdbdbd"/>
    <path d="M52 198c10-46 42-70 68-70s58 24 68 70" fill="#bdbdbd"/>
  </svg>
`);

const fallbackRequests = [
  {
    id: "req-1",
    user_id: "mock",
    title: "제주 리조트 홍보 영상 촬영",
    client_type: "기업/브랜드",
    region: "제주",
    location_detail: "제주 서귀포시",
    purpose: "홍보영상",
    budget: "150만원 ~ 250만원",
    deadline: "2026-05-20",
    tags: ["홍보 영상", "리조트", "4K", "편집 포함"],
    thumbnail_url:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    description:
      "리조트 객실, 수영장, 해변 동선을 포함한 감성적인 항공 홍보 영상 제작 의뢰입니다.",
  },
  {
    id: "req-2",
    user_id: "mock",
    title: "서울 도심 오피스 빌딩 촬영",
    client_type: "부동산/건설",
    region: "서울",
    location_detail: "서울 강남구",
    purpose: "부동산",
    budget: "120만원 ~ 200만원",
    deadline: "2026-05-28",
    tags: ["건축 촬영", "매물 홍보", "사진+영상"],
    thumbnail_url:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
    description:
      "상업용 오피스 외관, 주변 입지, 도로 접근성을 보여주는 항공 컷이 필요합니다.",
  },
  {
    id: "req-3",
    user_id: "mock",
    title: "여수 관광지 홍보 영상 제작",
    client_type: "공공기관",
    region: "전남",
    location_detail: "전라남도 여수시",
    purpose: "여행콘텐츠",
    budget: "200만원 ~ 300만원",
    deadline: "2026-05-18",
    tags: ["관광 홍보", "영상 제작", "하이라이트"],
    thumbnail_url:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1000&q=80",
    description:
      "해안 경관과 관광지 동선을 담은 지역 홍보용 드론 영상 의뢰입니다.",
  },
  {
    id: "req-4",
    user_id: "mock",
    title: "설악산 국립공원 자연 영상 촬영",
    client_type: "공공기관",
    region: "강원",
    location_detail: "강원도 속초시",
    purpose: "여행콘텐츠",
    budget: "180만원 ~ 280만원",
    deadline: "2026-06-05",
    tags: ["자연 영상", "산악", "풍경"],
    thumbnail_url:
      "https://images.unsplash.com/photo-1508264165352-258a6c2cf578?auto=format&fit=crop&w=1000&q=80",
    description: "산악 경관과 자연 분위기를 담은 영상 콘텐츠 제작 의뢰입니다.",
  },
  {
    id: "req-5",
    user_id: "mock",
    title: "공장 및 시설 항공 촬영",
    client_type: "기업/브랜드",
    region: "경기",
    location_detail: "경기도 화성시",
    purpose: "시설촬영",
    budget: "160만원 ~ 220만원",
    deadline: "2026-06-02",
    tags: ["시설 촬영", "공장", "항공 사진"],
    thumbnail_url:
      "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1000&q=80",
    description:
      "공장 부지, 시설 배치, 출입 동선을 보여주는 항공 사진과 짧은 영상이 필요합니다.",
  },
];

const fallbackPilots = [
  {
    id: "mock-1",
    user_id: "mock-1",
    display_name: "Jeju Air Visual",
    avatar_url: "",
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
    avatar_url: "",
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
    avatar_url: "",
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

function daysLeft(dateText) {
  if (!dateText) return "";
  const target = new Date(dateText);
  const today = new Date();
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  if (Number.isNaN(diff)) return "";
  if (diff < 0) return "마감";
  return `D-${diff}`;
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

const emptyRequestForm = {
  title: "",
  client_type: "기업/브랜드",
  region: "서울",
  location_detail: "",
  purpose: "홍보영상",
  budget: "100만원 ~ 200만원",
  deadline: "",
  thumbnail_url: "",
  tagsText: "홍보 영상, 4K",
  description: "",
};

const emptyPilotForm = {
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
  avatar_url: "",
  client_examples: "",
};

export default function Home() {
  const [step, setStep] = useState("home");
  const [session, setSession] = useState(null);

  const [pilots, setPilots] = useState(fallbackPilots);
  const [requests, setRequests] = useState(fallbackRequests);
  const [myRequests, setMyRequests] = useState([]);
  const [myPilotProfile, setMyPilotProfile] = useState(null);
  const [myPortfolio, setMyPortfolio] = useState([]);

  const [selectedPilot, setSelectedPilot] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [portfolio, setPortfolio] = useState([]);

  const [authMode, setAuthMode] = useState("signup");
  const [role, setRole] = useState("client");

  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [requestForm, setRequestForm] = useState(emptyRequestForm);
  const [editingRequestId, setEditingRequestId] = useState(null);

  const [pilotForm, setPilotForm] = useState(emptyPilotForm);

  const [workForm, setWorkForm] = useState({
    title: "",
    category: "홍보영상",
    video_url: "",
    thumbnail_url: "",
    description: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        fetchMyPage(data.session.user.id);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchMyPage(session.user.id);
      } else {
        setMyRequests([]);
        setMyPilotProfile(null);
        setMyPortfolio([]);
      }
    });

    fetchPilots();
    fetchRequests();

    return () => listener.subscription.unsubscribe();
  }, []);

  async function fetchPilots() {
    const { data } = await supabase
      .from("pilot_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      setPilots([...data, ...fallbackPilots]);
    } else {
      setPilots(fallbackPilots);
    }
  }

  async function fetchRequests() {
    const { data } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      setRequests([...data, ...fallbackRequests]);
    } else {
      setRequests(fallbackRequests);
    }
  }

  async function fetchMyPage(userId) {
    const { data: reqs } = await supabase
      .from("requests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setMyRequests(reqs || []);

    const { data: profile } = await supabase
      .from("pilot_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    setMyPilotProfile(profile || null);

    if (profile) {
      setPilotForm({
        display_name: profile.display_name || "",
        region: profile.region || "서울",
        headline: profile.headline || "",
        specialtiesText: (profile.specialties || []).join(", "),
        styleTagsText: (profile.style_tags || []).join(", "),
        price: profile.price || 500000,
        delivery_rate: profile.delivery_rate || 96,
        reshoot_rate: profile.reshoot_rate || 2.0,
        experience: profile.experience || "",
        bio: profile.bio || "",
        portfolio_url: profile.portfolio_url || "",
        thumbnail_url: profile.thumbnail_url || "",
        avatar_url: profile.avatar_url || "",
        client_examples: profile.client_examples || "",
      });
    }

    const { data: works } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setMyPortfolio(works || []);
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

  async function uploadAvatar(file) {
    if (!session?.user) {
      alert("프로필 사진을 올리려면 먼저 로그인해야 합니다.");
      return;
    }

    if (!file) return;

    const ext = file.name.split(".").pop();
    const filePath = `${session.user.id}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (error) {
      alert(error.message);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setPilotForm({ ...pilotForm, avatar_url: data.publicUrl });
  }

  async function handleSignup() {
    if (!authForm.email || !authForm.password || !authForm.name) {
      alert("이름, 이메일, 비밀번호를 입력해주세요.");
      return;
    }

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
    setStep("myPage");
  }

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email: authForm.email,
      password: authForm.password,
    });

    if (error) return alert(error.message);

    alert("로그인 완료");
    setStep("myPage");
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
      specialties: pilotForm.specialtiesText.split(",").map((x) => x.trim()).filter(Boolean),
      style_tags: pilotForm.styleTagsText.split(",").map((x) => x.trim()).filter(Boolean),
      price: Number(pilotForm.price),
      delivery_rate: Number(pilotForm.delivery_rate),
      reshoot_rate: Number(pilotForm.reshoot_rate),
      experience: pilotForm.experience,
      bio: pilotForm.bio,
      portfolio_url: pilotForm.portfolio_url,
      thumbnail_url: pilotForm.thumbnail_url,
      avatar_url: pilotForm.avatar_url,
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
    await fetchMyPage(session.user.id);
    setStep("myPage");
  }

  async function saveWork() {
    if (!session?.user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!workForm.title) {
      alert("영상 제목을 입력해주세요.");
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

    await fetchMyPage(session.user.id);
  }

  function startNewRequest() {
    setEditingRequestId(null);
    setRequestForm(emptyRequestForm);
    setStep("requestCreate");
  }

  function startEditRequest(req) {
    if (!session?.user || req.user_id !== session.user.id) {
      alert("내가 작성한 의뢰만 수정할 수 있습니다.");
      return;
    }

    setEditingRequestId(req.id);
    setRequestForm({
      title: req.title || "",
      client_type: req.client_type || "기업/브랜드",
      region: req.region || "서울",
      location_detail: req.location_detail || "",
      purpose: req.purpose || "홍보영상",
      budget: req.budget || "100만원 ~ 200만원",
      deadline: req.deadline || "",
      thumbnail_url: req.thumbnail_url || "",
      tagsText: (req.tags || []).join(", "),
      description: req.description || "",
    });
    setStep("requestCreate");
  }

  async function saveRequest() {
    if (!session?.user) {
      alert("의뢰를 등록하려면 먼저 로그인해주세요.");
      setStep("auth");
      setRole("client");
      return;
    }

    const payload = {
      user_id: session.user.id,
      title: requestForm.title,
      client_type: requestForm.client_type,
      region: requestForm.region,
      location_detail: requestForm.location_detail,
      purpose: requestForm.purpose,
      budget: requestForm.budget,
      deadline: requestForm.deadline || null,
      thumbnail_url: requestForm.thumbnail_url,
      tags: requestForm.tagsText.split(",").map((x) => x.trim()).filter(Boolean),
      description: requestForm.description,
    };

    if (editingRequestId) {
      const { error } = await supabase
        .from("requests")
        .update(payload)
        .eq("id", editingRequestId)
        .eq("user_id", session.user.id);

      if (error) return alert(error.message);

      alert("의뢰가 수정되었습니다.");
    } else {
      const { error } = await supabase.from("requests").insert(payload);

      if (error) return alert(error.message);

      alert("의뢰가 등록되었습니다.");
    }

    setEditingRequestId(null);
    setRequestForm(emptyRequestForm);

    await fetchRequests();
    await fetchMyPage(session.user.id);
    setStep("myPage");
  }

  async function deleteRequest(reqId) {
    if (!session?.user) return;

    const ok = confirm("이 의뢰를 삭제할까요?");
    if (!ok) return;

    const { error } = await supabase
      .from("requests")
      .delete()
      .eq("id", reqId)
      .eq("user_id", session.user.id);

    if (error) return alert(error.message);

    alert("삭제되었습니다.");
    await fetchRequests();
    await fetchMyPage(session.user.id);
  }

  const matchedPilots = useMemo(() => {
    return pilots
      .map((p) => getMatch(p, { region: requestForm.region, purpose: requestForm.purpose }))
      .sort((a, b) => b.score - a.score);
  }, [pilots, requestForm.region, requestForm.purpose]);

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
          <button onClick={() => setStep("home")} className="text-xl font-black tracking-tight">
            DroneSafeMatch
          </button>

          <nav className="hidden gap-8 text-sm font-semibold text-neutral-500 md:flex">
            <button onClick={() => setStep("home")} className="hover:text-neutral-950">
              Home
            </button>
            <button onClick={() => setStep("pilots")} className="hover:text-neutral-950">
              Portfolio
            </button>
            <button onClick={() => setStep("requests")} className="hover:text-neutral-950">
              Requests
            </button>
            <button onClick={startNewRequest} className="hover:text-neutral-950">
              Post request
            </button>
            <button onClick={() => setStep("pilotManage")} className="hover:text-neutral-950">
              Creator Studio
            </button>
            {session && (
              <button onClick={() => setStep("myPage")} className="hover:text-neutral-950">
                My Page
              </button>
            )}
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
                의뢰자는 촬영 요청을 올리고, 촬영자는 포트폴리오로 지원합니다.
                실제 결과물과 스타일을 보고 프로젝트에 맞는 촬영자를 선택하세요.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <button onClick={startNewRequest} className={primaryButton}>
                  의뢰 등록하기
                </button>
                <button onClick={() => setStep("pilots")} className={secondaryButton}>
                  촬영자 보기
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

      {step === "myPage" && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-400">
                My workspace
              </p>
              <h2 className="mt-4 text-5xl font-black tracking-tight">내 페이지</h2>
              <p className="mt-4 text-neutral-500">
                내가 올린 의뢰, 촬영자 프로필, 포트폴리오를 한 곳에서 관리합니다.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={startNewRequest} className={primaryButton}>
                새 의뢰 등록
              </button>
              <button onClick={() => setStep("pilotManage")} className={secondaryButton}>
                내 프로필 수정
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] bg-white p-7 shadow-sm">
              <h3 className="text-xl font-black">계정</h3>
              <p className="mt-4 text-sm text-neutral-500">로그인 이메일</p>
              <p className="mt-2 font-bold">{session?.user?.email}</p>
            </div>

            <div className="rounded-[2rem] bg-white p-7 shadow-sm">
              <h3 className="text-xl font-black">내 의뢰</h3>
              <p className="mt-4 text-4xl font-black">{myRequests.length}</p>
              <p className="mt-2 text-sm text-neutral-500">등록한 촬영 의뢰</p>
            </div>

            <div className="rounded-[2rem] bg-white p-7 shadow-sm">
              <h3 className="text-xl font-black">내 포트폴리오</h3>
              <p className="mt-4 text-4xl font-black">{myPortfolio.length}</p>
              <p className="mt-2 text-sm text-neutral-500">등록한 작업물</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-black">내 촬영자 프로필</h3>

              {myPilotProfile ? (
                <div className="mt-6">
                  <div className="flex items-center gap-5">
                    <img
                      src={myPilotProfile.avatar_url || DEFAULT_AVATAR}
                      className="h-24 w-24 rounded-full object-cover"
                      alt="avatar"
                    />
                    <div>
                      <p className="text-2xl font-black">{myPilotProfile.display_name}</p>
                      <p className="mt-1 text-neutral-500">{myPilotProfile.region}</p>
                      <p className="mt-2 font-semibold">{myPilotProfile.headline}</p>
                    </div>
                  </div>

                  <p className="mt-6 text-sm leading-6 text-neutral-600">
                    {myPilotProfile.bio || "자기소개가 아직 없습니다."}
                  </p>

                  <button
                    onClick={() => setStep("pilotManage")}
                    className="mt-6 w-full rounded-full bg-neutral-950 p-4 font-black text-white"
                  >
                    내 프로필 수정하기
                  </button>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl bg-neutral-50 p-6">
                  <p className="font-bold">아직 촬영자 프로필이 없습니다.</p>
                  <p className="mt-2 text-sm text-neutral-500">
                    프로필을 만들면 포트폴리오 목록에 노출됩니다.
                  </p>
                  <button
                    onClick={() => setStep("pilotManage")}
                    className="mt-5 rounded-full bg-neutral-950 px-6 py-3 font-bold text-white"
                  >
                    촬영자 프로필 만들기
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-[2rem] bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black">내가 올린 의뢰</h3>
                <button onClick={startNewRequest} className="rounded-full border px-5 py-2 text-sm font-bold">
                  새 글
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {myRequests.length > 0 ? (
                  myRequests.map((req) => (
                    <div key={req.id} className="rounded-2xl border border-neutral-200 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xl font-black">{req.title || "제목 없는 의뢰"}</p>
                          <p className="mt-2 text-sm text-neutral-500">
                            {req.region} · {req.budget} · {daysLeft(req.deadline)}
                          </p>
                          <p className="mt-3 text-sm text-neutral-600 line-clamp-2">
                            {req.description}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => startEditRequest(req)}
                            className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-bold text-white"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => deleteRequest(req.id)}
                            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-bold"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-neutral-50 p-6">
                    <p className="font-bold">아직 올린 의뢰가 없습니다.</p>
                    <p className="mt-2 text-sm text-neutral-500">
                      의뢰를 등록하면 이곳에서 수정하고 관리할 수 있습니다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {step === "requestCreate" && (
        <section className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-5xl font-black tracking-tight">
            {editingRequestId ? "Edit request" : "Post a request"}
          </h2>
          <p className="mt-4 text-neutral-500">
            {editingRequestId
              ? "내가 작성한 의뢰 내용을 수정합니다."
              : "의뢰를 올리면 같은 카드 형식으로 의뢰 게시판에 표시됩니다."}
          </p>

          <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                placeholder="의뢰 제목"
                className={inputClass}
                value={requestForm.title}
                onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })}
              />
              <select
                className={inputClass}
                value={requestForm.client_type}
                onChange={(e) => setRequestForm({ ...requestForm, client_type: e.target.value })}
              >
                <option>기업/브랜드</option>
                <option>부동산/건설</option>
                <option>공공기관</option>
                <option>개인/기타</option>
              </select>
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
                <option>전남</option>
              </select>
              <input
                placeholder="상세 위치: 제주 서귀포시"
                className={inputClass}
                value={requestForm.location_detail}
                onChange={(e) =>
                  setRequestForm({ ...requestForm, location_detail: e.target.value })
                }
              />
              <select
                className={inputClass}
                value={requestForm.purpose}
                onChange={(e) => setRequestForm({ ...requestForm, purpose: e.target.value })}
              >
                <option>홍보영상</option>
                <option>부동산</option>
                <option>행사</option>
                <option>여행콘텐츠</option>
                <option>시설촬영</option>
              </select>
              <input
                placeholder="예산: 150만원 ~ 250만원"
                className={inputClass}
                value={requestForm.budget}
                onChange={(e) => setRequestForm({ ...requestForm, budget: e.target.value })}
              />
              <input
                type="date"
                className={inputClass}
                value={requestForm.deadline}
                onChange={(e) => setRequestForm({ ...requestForm, deadline: e.target.value })}
              />
              <input
                placeholder="썸네일 이미지 URL"
                className={inputClass}
                value={requestForm.thumbnail_url}
                onChange={(e) =>
                  setRequestForm({ ...requestForm, thumbnail_url: e.target.value })
                }
              />
              <input
                placeholder="태그: 홍보 영상, 리조트, 4K"
                className={`${inputClass} md:col-span-2`}
                value={requestForm.tagsText}
                onChange={(e) => setRequestForm({ ...requestForm, tagsText: e.target.value })}
              />
            </div>

            <textarea
              placeholder="상세 설명"
              className="mt-4 h-32 w-full rounded-2xl border border-neutral-200 p-4 outline-none focus:border-neutral-950"
              value={requestForm.description}
              onChange={(e) =>
                setRequestForm({ ...requestForm, description: e.target.value })
              }
            />

            <div className="mt-6 flex gap-3">
              <button onClick={saveRequest} className="flex-1 rounded-full bg-neutral-950 p-4 font-black text-white">
                {editingRequestId ? "의뢰 수정 저장" : "의뢰 등록하기"}
              </button>
              {editingRequestId && (
                <button
                  onClick={() => {
                    setEditingRequestId(null);
                    setRequestForm(emptyRequestForm);
                    setStep("myPage");
                  }}
                  className="rounded-full border border-neutral-300 px-7 py-4 font-black"
                >
                  취소
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {step === "requests" && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-400">
                Open requests
              </p>
              <h2 className="mt-4 text-5xl font-black tracking-tight">현재 올라온 촬영 의뢰</h2>
              <p className="mt-4 text-neutral-500">
                기본 의뢰 5개와 사용자가 등록한 의뢰가 같은 카드 형식으로 표시됩니다.
              </p>
            </div>

            <button onClick={startNewRequest} className={primaryButton}>
              의뢰 등록하기
            </button>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((req) => (
              <article
                key={req.id}
                className="overflow-hidden rounded-[2rem] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-neutral-200"
              >
                <img
                  src={
                    req.thumbnail_url ||
                    "https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&w=1000&q=80"
                  }
                  className="h-56 w-full object-cover"
                  alt={req.title}
                />

                <div className="p-6">
                  <div className="mb-4 flex justify-between">
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold">
                      {req.client_type || "의뢰"}
                    </span>
                    <span className="text-sm font-bold text-red-500">
                      {daysLeft(req.deadline)}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black">{req.title || "제목 없는 의뢰"}</h3>

                  <div className="mt-4 space-y-2 text-sm text-neutral-500">
                    <p>📍 {req.location_detail || req.region}</p>
                    <p>💰 {req.budget || "예산 협의"}</p>
                    <p>📅 마감 {req.deadline || "협의"}</p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {(req.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="flex-1 rounded-full border border-neutral-300 px-4 py-3 text-sm font-black"
                    >
                      의뢰 상세
                    </button>

                    {session?.user?.id === req.user_id ? (
                      <button
                        onClick={() => startEditRequest(req)}
                        className="flex-1 rounded-full bg-neutral-950 px-4 py-3 text-sm font-black text-white"
                      >
                        내 글 수정
                      </button>
                    ) : (
                      <button
                        onClick={() => setStep("pilots")}
                        className="flex-1 rounded-full bg-neutral-950 px-4 py-3 text-sm font-black text-white"
                      >
                        지원하기
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {step === "pilots" && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-5xl font-black tracking-tight">Explore portfolios</h2>
          <p className="mt-4 text-neutral-500">
            카드 클릭 시 촬영자의 대표 영상, 프로필 사진, PR 정보를 확인할 수 있습니다.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matchedPilots.map((p) => (
              <button
                key={p.id}
                onClick={() => openPilot(p)}
                className="group overflow-hidden rounded-[2rem] bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-neutral-200"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      p.thumbnail_url ||
                      "https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&w=1000&q=80"
                    }
                    className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                    alt={p.display_name}
                  />
                  <img
                    src={p.avatar_url || DEFAULT_AVATAR}
                    className="absolute bottom-4 left-4 h-16 w-16 rounded-full border-4 border-white object-cover shadow-lg"
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

      {step === "pilotManage" && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-5xl font-black tracking-tight">Creator Studio</h2>
          <p className="mt-4 text-neutral-500">
            프로필 사진, 자기소개, 대표작을 등록하고 수정하세요.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-black">Profile</h3>

              <div className="mt-6 flex items-center gap-5">
                <img
                  src={pilotForm.avatar_url || DEFAULT_AVATAR}
                  className="h-24 w-24 rounded-full object-cover"
                  alt="avatar"
                />
                <label className="cursor-pointer rounded-full border border-neutral-300 px-5 py-3 text-sm font-bold">
                  프로필 사진 업로드
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => uploadAvatar(e.target.files?.[0])}
                  />
                </label>
              </div>

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
                <input
                  placeholder="대표 유튜브 영상 링크"
                  className={inputClass}
                  value={pilotForm.portfolio_url}
                  onChange={(e) =>
                    setPilotForm({ ...pilotForm, portfolio_url: e.target.value })
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

              <div className="mt-8">
                <h4 className="font-black">내 포트폴리오</h4>
                <div className="mt-4 space-y-3">
                  {myPortfolio.length > 0 ? (
                    myPortfolio.map((item) => (
                      <div key={item.id} className="rounded-2xl bg-neutral-50 p-4">
                        <p className="font-bold">{item.title}</p>
                        <p className="text-sm text-neutral-500">{item.category}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-neutral-500">아직 등록한 포트폴리오가 없습니다.</p>
                  )}
                </div>
              </div>
            </div>
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

            <div className="flex items-center gap-5">
              <img
                src={selectedPilot.avatar_url || DEFAULT_AVATAR}
                className="h-24 w-24 rounded-full object-cover"
                alt={selectedPilot.display_name}
              />
              <div>
                <h2 className="text-5xl font-black tracking-tight">
                  {selectedPilot.display_name}
                </h2>
                <p className="mt-3 text-xl font-semibold text-neutral-500">
                  {selectedPilot.headline}
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-3xl leading-7 text-neutral-600">{selectedPilot.bio}</p>

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

      {selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white p-8">
            <button
              onClick={() => setSelectedRequest(null)}
              className="float-right rounded-full bg-neutral-100 px-4 py-2 font-bold"
            >
              닫기
            </button>
            <h2 className="text-4xl font-black">{selectedRequest.title}</h2>
            <p className="mt-4 text-neutral-500">{selectedRequest.description}</p>

            <div className="mt-8 grid gap-3 text-sm text-neutral-600">
              <p>📍 {selectedRequest.location_detail || selectedRequest.region}</p>
              <p>💰 {selectedRequest.budget}</p>
              <p>📅 마감 {selectedRequest.deadline}</p>
            </div>

            <div className="mt-8 flex gap-3">
              {session?.user?.id === selectedRequest.user_id && (
                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    startEditRequest(selectedRequest);
                  }}
                  className="flex-1 rounded-full border border-neutral-300 p-4 font-black"
                >
                  이 글 수정하기
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setStep("pilots");
                }}
                className="flex-1 rounded-full bg-neutral-950 p-4 font-black text-white"
              >
                이 의뢰에 지원할 촬영자 찾기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
