"use client";

import Link from "next/link";
import { BookOpen, Check, ChevronRight, FileText, Highlighter, Headphones, Lightbulb, LockKeyhole, Play, RotateCcw, Upload, Volume2 } from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";
import { getBrowserIdentity, getScopedStorageKey, markAnonymousIdentityMerged, trackEvent, trackEventOnce } from "@/lib/analytics/client";
import { analyticsEvents } from "@/lib/analytics/events";
import { api, getAccessToken } from "@/lib/api/client";
import type { ReadingMaterial, ReadingMaterialBundle, ReadingQuestion as ApiReadingQuestion, ReadingVocabularyItem } from "@/lib/api/types";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { readingCopy } from "@/lib/i18n/reading-copy";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type ReaderTab = "read" | "vocabulary" | "comprehension" | "notes";

type ReaderVocabularyItem = Pick<ReadingVocabularyItem, "id" | "word" | "meaning" | "example" | "audioUrl">;
type ReaderQuestion = Pick<ApiReadingQuestion, "id" | "prompt" | "options"> & { correctOptionIndex?: number };

const sampleArticle = {
  title: "The quiet power of a daily walk",
  text: "A short walk can change the shape of a busy day. It gives your mind a few quiet minutes away from notifications, meetings, and unfinished tasks. Researchers have found that gentle movement can support attention, so a walk may help you return to work with a clearer plan.\n\nThe best part is that a daily walk does not need to be difficult. Ten minutes around the block is enough to build a habit. When the habit feels easy, you can make the route longer or invite a friend. The goal is not to move quickly. It is to create a small, repeatable moment that belongs to you.",
  vocabulary: [
    { word: "shape", meaning: "to influence how something develops", example: "Small choices shape our routines." },
    { word: "attention", meaning: "the ability to concentrate on something", example: "A quiet room helps her attention." },
    { word: "repeatable", meaning: "easy to do again regularly", example: "Make the first step small and repeatable." }
  ],
  questions: [
    { prompt: "What can a short walk give your mind?", options: ["A few quiet minutes", "A faster commute", "A difficult task"], answer: 0 },
    { prompt: "How long can be enough to begin a walking habit?", options: ["One hour", "Ten minutes", "A whole afternoon"], answer: 1 }
  ]
};

const tabs: Array<{ id: ReaderTab; icon: typeof BookOpen }> = [
  { id: "read", icon: BookOpen },
  { id: "vocabulary", icon: Lightbulb },
  { id: "comprehension", icon: Check },
  { id: "notes", icon: FileText }
];

function fallbackVocabulary(copy: typeof readingCopy[Locale]): ReaderVocabularyItem[] {
  return sampleArticle.vocabulary.map((item, index) => ({
    id: `sample-vocabulary-${index + 1}`,
    word: item.word,
    meaning: copy.vocabulary.meanings[index],
    example: item.example,
    audioUrl: null
  }));
}

function fallbackQuestions(): ReaderQuestion[] {
  return sampleArticle.questions.map((question, index) => ({
    id: `sample-question-${index + 1}`,
    prompt: question.prompt,
    options: question.options,
    correctOptionIndex: question.answer
  }));
}

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function supportedReadingFile(file: File) {
  const name = file.name.toLowerCase();
  return file.type.startsWith("text/") || name.endsWith(".txt") || name.endsWith(".pdf") || name.endsWith(".docx");
}

function readTextFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === "string" ? reader.result.trim() : "";
      content ? resolve(content.slice(0, 16000)) : reject(new Error("empty"));
    };
    reader.onerror = () => reject(new Error("read"));
    reader.readAsText(file);
  });
}

function fileExtension(fileName: string) {
  return fileName.toLowerCase().split(".").pop() || "unknown";
}

export function EnglishReadingPractice({ locale = "en", embedded = false }: { locale?: Locale; embedded?: boolean }) {
  const copy = readingCopy[locale];
  const pagePath = localizedPath(locale, "/english-reading-practice");
  const loginPath = `${localizedPath(locale, "/login")}?next=${encodeURIComponent(pagePath)}`;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<ReaderTab>("read");
  const [articleText, setArticleText] = useState(sampleArticle.text);
  const [articleTitle, setArticleTitle] = useState(sampleArticle.title);
  const [fileName, setFileName] = useState("");
  const [materialId, setMaterialId] = useState<string | null>(null);
  const [materialKind, setMaterialKind] = useState<"sample" | "user_text">("sample");
  const [vocabulary, setVocabulary] = useState<ReaderVocabularyItem[]>(() => fallbackVocabulary(copy));
  const [questions, setQuestions] = useState<ReaderQuestion[]>(fallbackQuestions);
  const [status, setStatus] = useState(copy.status.ready);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, { correct: boolean; correctOptionIndex?: number }>>({});
  const [notes, setNotes] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [storageScope, setStorageScope] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lessonEventsRef = useRef(new Set<string>());
  const attemptSignatureRef = useRef("");

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active) setIsAuthenticated(Boolean(data.session));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function prepareIdentityStorage() {
      const { anonymousId } = getBrowserIdentity();
      const legacyNotesKey = "reading-practice-notes";
      const supabase = createSupabaseBrowserClient();
      const session = await supabase?.auth.getSession();
      const userId = session?.data.session?.user.id;

      if (userId) {
        const userScope = `user:${userId}`;
        const userNotesKey = getScopedStorageKey("reading-practice-notes", userScope);
        const anonymousNotesKey = anonymousId ? getScopedStorageKey("reading-practice-notes", `anonymous:${anonymousId}`) : null;

        // auth/sync is the server-side, idempotent merge boundary. The server
        // derives the destination user from the bearer token, never from JSON.
        let mergeSynced = false;
        try {
          await api.auth.sync();
          mergeSynced = true;
          if (anonymousId) markAnonymousIdentityMerged(anonymousId, userId);
        } catch {
          // The page can still use account-scoped local notes while the API is unavailable.
        }

        if (!cancelled) {
          try {
            const currentUserNotes = window.localStorage.getItem(userNotesKey) || "";
            const anonymousNotes = anonymousNotesKey
              ? window.localStorage.getItem(anonymousNotesKey) || window.localStorage.getItem(legacyNotesKey) || ""
              : window.localStorage.getItem(legacyNotesKey) || "";
            const mergedNotes = currentUserNotes && anonymousNotes && currentUserNotes !== anonymousNotes
              ? `${currentUserNotes}\n\n${anonymousNotes}`
              : currentUserNotes || anonymousNotes;
            if (mergedNotes) window.localStorage.setItem(userNotesKey, mergedNotes);
            if (mergeSynced && anonymousNotesKey && anonymousNotesKey !== userNotesKey) window.localStorage.removeItem(anonymousNotesKey);
            if (mergeSynced) window.localStorage.removeItem(legacyNotesKey);
            setStorageScope(userScope);
            setNotes(mergedNotes);
          } catch {
            setStorageScope(userScope);
          }
        }
        return;
      }

      const anonymousScope = `anonymous:${anonymousId || "local"}`;
      if (!cancelled) {
        setStorageScope(anonymousScope);
        try {
          const scopedKey = getScopedStorageKey("reading-practice-notes", anonymousScope);
          const scopedNotes = window.localStorage.getItem(scopedKey) || "";
          const legacyNotes = window.localStorage.getItem(legacyNotesKey) || "";
          if (!scopedNotes && legacyNotes) {
            window.localStorage.setItem(scopedKey, legacyNotes);
            window.localStorage.removeItem(legacyNotesKey);
          }
          setNotes(scopedNotes || legacyNotes);
        } catch {
          // A blocked localStorage should not prevent reading practice.
        }
      }
    }

    void prepareIdentityStorage();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    void trackEventOnce(`reading_page_viewed:${locale}:${window.location.pathname}`, analyticsEvents.readingPageViewed, {
      locale,
      page_type: "english_reading_practice"
    });
  }, [locale]);

  function trackLessonLoaded(material: ReadingMaterial, source: "api" | "static_fallback" | "local_fallback") {
    const key = `${source}:${material.id}`;
    if (lessonEventsRef.current.has(key)) return;
    lessonEventsRef.current.add(key);
    void trackEvent(analyticsEvents.readingLessonLoaded, {
      material_id: material.id,
      material_kind: material.kind,
      source,
      status: material.status,
      word_count: material.wordCount,
      vocabulary_count: material.kind === "sample" ? sampleArticle.vocabulary.length : undefined,
      question_count: material.kind === "sample" ? sampleArticle.questions.length : undefined
    });
  }

  function applyLesson(bundle: ReadingMaterialBundle, nextFileName = "", nextStatus = copy.status.ready, source: "api" | "local_fallback" = "api") {
    const material = bundle.material;
    const isSample = material.kind === "sample";
    trackLessonLoaded(material, source);
    setMaterialId(material.id);
    setMaterialKind(isSample ? "sample" : "user_text");
    setArticleText(material.content || (isSample ? sampleArticle.text : ""));
    setArticleTitle(material.title || (isSample ? sampleArticle.title : nextFileName));
    setFileName(nextFileName || material.sourceFileName || "");
    setVocabulary(bundle.vocabulary?.length ? bundle.vocabulary : isSample ? fallbackVocabulary(copy) : []);
    setQuestions(bundle.questions?.length ? bundle.questions.map((question, index) => ({
      id: question.id,
      prompt: question.prompt,
      options: question.options,
      correctOptionIndex: question.correctOptionIndex ?? (isSample ? sampleArticle.questions[index]?.answer : undefined)
    })) : isSample ? fallbackQuestions() : []);
    const scopedNotes = storageScope ? window.localStorage.getItem(getScopedStorageKey("reading-practice-notes", storageScope)) || "" : "";
    setNotes(bundle.notes?.content || (isSample ? scopedNotes : ""));
    setAnswers({});
    setAnswerResults({});
    setAudioUrl(null);
    setStatus(nextStatus);
  }

  useEffect(() => {
    let cancelled = false;
    void api.reading.sample(locale).then((bundle) => {
      if (!cancelled) applyLesson(bundle);
    }).catch(() => {
      // Keep the static sample available when the central reading service is unavailable.
      if (!cancelled) {
        trackLessonLoaded({
          id: "static-sample-daily-walk",
          kind: "sample",
          ownerUserId: null,
          title: sampleArticle.title,
          content: sampleArticle.text,
          contentLanguageCode: "en",
          sourceFileName: null,
          status: "ready",
          wordCount: sampleArticle.text.trim().split(/\s+/).length,
          estimatedMinutes: 3,
          createdAt: "",
          updatedAt: ""
        }, "static_fallback");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [locale, storageScope]);

  useEffect(() => {
    if (!storageScope) return;
    window.localStorage.setItem(getScopedStorageKey("reading-practice-notes", storageScope), notes);
  }, [notes, storageScope]);

  useEffect(() => {
    if (!materialId || materialKind === "sample" || typeof window === "undefined") return;
    const timer = window.setTimeout(() => {
      void getAccessToken().then((token) => {
        if (!token) return;
        return api.reading.saveNotes(materialId, notes).then(() => {
          void trackEvent(analyticsEvents.readingNoteSaved, {
            material_id: materialId,
            content_length: notes.length,
            is_empty: !notes.trim()
          });
        }).catch(() => undefined);
      });
    }, 700);
    return () => window.clearTimeout(timer);
  }, [materialId, materialKind, notes]);

  const paragraphs = useMemo(() => articleText.split(/\n+/).map((paragraph) => paragraph.trim()).filter(Boolean), [articleText]);
  const wordCount = useMemo(() => articleText.trim().split(/\s+/).filter(Boolean).length, [articleText]);
  const correctAnswers = questions.reduce((total, question) => {
    const result = answerResults[question.id];
    const correct = result?.correct ?? (question.correctOptionIndex !== undefined && answers[question.id] === question.correctOptionIndex);
    return total + (correct ? 1 : 0);
  }, 0);

  function formatCount(value: string, count: number) {
    return value.replace(/\d+/, String(count));
  }

  async function submitAnswers(nextAnswers: Record<string, number>) {
    if (questions.length === 0 || Object.keys(nextAnswers).length !== questions.length) return;
    const signature = questions.map((question) => `${question.id}:${nextAnswers[question.id]}`).join("|");
    if (attemptSignatureRef.current === signature) return;
    attemptSignatureRef.current = signature;
    if (!materialId || materialKind === "sample") {
      void trackEvent(analyticsEvents.readingAttemptSubmitted, {
        material_id: materialId || "static-sample-daily-walk",
        material_kind: "sample",
        submitted_to_backend: false,
        score: questions.reduce((total, question) => total + (question.correctOptionIndex === nextAnswers[question.id] ? 1 : 0), 0),
        total: questions.length
      });
      return;
    }
    try {
      const result = await api.reading.submitAttempt(materialId, questions.map((question) => ({ questionId: question.id, optionIndex: nextAnswers[question.id] })));
      setAnswerResults(Object.fromEntries(result.answers.map((answer) => [answer.questionId, answer])));
      void trackEvent(analyticsEvents.readingAttemptSubmitted, {
        material_id: materialId,
        material_kind: materialKind,
        submitted_to_backend: true,
        score: result.score,
        total: result.total,
        attempt_id: result.attemptId
      });
    } catch {
      attemptSignatureRef.current = "";
      setStatus(copy.status.readError);
    }
  }

  function selectAnswer(question: ReaderQuestion, optionIndex: number) {
    const nextAnswers = { ...answers, [question.id]: optionIndex };
    setAnswers(nextAnswers);
    void trackEvent(analyticsEvents.readingQuestionAnswered, {
      material_id: materialId || "static-sample-daily-walk",
      material_kind: materialKind,
      question_id: question.id,
      option_index: optionIndex,
      answered_count: Object.keys(nextAnswers).length,
      question_count: questions.length
    });
    void submitAnswers(nextAnswers);
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!supportedReadingFile(file)) {
      setStatus(copy.status.txtOnly);
      return;
    }

    void trackEvent(analyticsEvents.readingMaterialImportStarted, {
      file_extension: fileExtension(file.name),
      mime_type: file.type || "unknown",
      file_size: file.size
    });

    if (!await getAccessToken()) {
      void trackEvent(analyticsEvents.readingMaterialImportFailed, { reason: "unauthenticated", file_extension: fileExtension(file.name) });
      setStatus(copy.status.txtOnly);
      return;
    }

    try {
      const upload = await api.reading.uploadUrl({ fileName: file.name, mimeType: file.type || "application/octet-stream", size: file.size });
      const uploadResponse = await fetch(upload.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file
      });
      if (!uploadResponse.ok) throw new Error("upload");
      const objectPath = upload.objectPath || upload.path;
      if (!objectPath) throw new Error("missing object path");

      let bundle = await api.reading.createMaterial({
        sourceType: "storage_object",
        objectPath,
        sourceFileName: file.name,
        contentLanguageCode: "en",
        interfaceLocale: locale
      });

      for (let attempt = 0; bundle.material.status === "processing" && attempt < 5; attempt += 1) {
        await wait(800);
        bundle = await api.reading.getMaterial(bundle.material.id, locale);
      }

      applyLesson(bundle, file.name, bundle.material.status === "processing" ? copy.status.ready : copy.status.loaded.replace("{file}", file.name));
      void trackEvent(analyticsEvents.readingMaterialImported, {
        material_id: bundle.material.id,
        material_kind: bundle.material.kind,
        file_extension: fileExtension(file.name),
        status: bundle.material.status,
        persisted: true
      });
      setActiveTab("read");
    } catch {
      void trackEvent(analyticsEvents.readingMaterialImportFailed, {
        reason: "api_or_upload_error",
        file_extension: fileExtension(file.name)
      });
      if (file.name.toLowerCase().endsWith(".txt")) {
        try {
          const content = await readTextFile(file);
          setMaterialId(null);
          setMaterialKind("user_text");
          setArticleText(content);
          setArticleTitle(file.name.replace(/\.txt$/i, ""));
          setFileName(file.name);
          setVocabulary([]);
          setQuestions([]);
          setAnswers({});
          setAnswerResults({});
          setStatus(copy.status.loaded.replace("{file}", file.name));
          void trackEvent(analyticsEvents.readingMaterialImported, {
            file_extension: "txt",
            material_kind: "user_text",
            persisted: false,
            source: "local_fallback"
          });
          setActiveTab("read");
          return;
        } catch {
          setStatus(copy.status.empty);
          return;
        }
      }
      setStatus(copy.status.readError);
    }
  }

  function resetArticle() {
    setArticleText(sampleArticle.text);
    setArticleTitle(sampleArticle.title);
    setFileName("");
    setMaterialId(null);
    setMaterialKind("sample");
    setVocabulary(fallbackVocabulary(copy));
    setQuestions(fallbackQuestions());
    setStatus(copy.status.ready);
    setAnswers({});
    setAnswerResults({});
    attemptSignatureRef.current = "";
    setAudioUrl(null);
  }

  async function speakArticle() {
    if (typeof window === "undefined") return;
    if (audioRef.current && audioUrl) {
      if (isReading) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsReading(false);
      } else {
        setIsReading(true);
        void audioRef.current.play();
        void trackEvent(analyticsEvents.readingAudioPlayed, { material_id: materialId, source: "tts", replay: true });
      }
      return;
    }
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }
    if (materialId && materialKind === "user_text") {
      try {
        const audio = await api.reading.audio(materialId, { voice: "default-en-US", rate: 0.88, format: "mp3" });
        const player = new Audio(audio.audioUrl);
        player.onended = () => setIsReading(false);
        player.onerror = () => setIsReading(false);
        audioRef.current = player;
        setAudioUrl(audio.audioUrl);
        setIsReading(true);
        await player.play();
        void trackEvent(analyticsEvents.readingAudioPlayed, { material_id: materialId, source: "tts", replay: false });
        return;
      } catch {
        // Fall through to browser speech when TTS is unavailable.
      }
    }
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(articleText);
    utterance.lang = "en-US";
    utterance.rate = 0.88;
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    setIsReading(true);
    window.speechSynthesis.speak(utterance);
    void trackEvent(analyticsEvents.readingAudioPlayed, { material_id: materialId || "static-sample-daily-walk", source: "browser_speech_synthesis" });
  }

  function selectTab(tab: ReaderTab) {
    if (tab === activeTab) return;
    setActiveTab(tab);
    void trackEvent(analyticsEvents.readingTabViewed, {
      tab,
      material_id: materialId || "static-sample-daily-walk",
      material_kind: materialKind
    });
  }

  function playVocabulary(item: ReaderVocabularyItem) {
    if (item.audioUrl) {
      const audio = new Audio(item.audioUrl);
      void audio.play();
      void trackEvent(analyticsEvents.readingVocabularyAudioPlayed, { word: item.word, source: "provided_audio", material_id: materialId || "static-sample-daily-walk" });
      return;
    }
    const utterance = new SpeechSynthesisUtterance(item.word);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
    void trackEvent(analyticsEvents.readingVocabularyAudioPlayed, { word: item.word, source: "browser_speech_synthesis", material_id: materialId || "static-sample-daily-walk" });
  }

  return (
    <main className={`reading-page${embedded ? " reading-page-embedded" : ""}`}>
      {!embedded ? <header className="reading-header">
        <div className="reading-container reading-header-inner">
          <Link className="reading-brand" href={localizedPath(locale, "/")} aria-label="AI Language Tutor">
            <img src="/arno.svg" alt="" />
            <span>AI Language Tutor</span>
          </Link>
          <nav className="reading-nav" aria-label={copy.nav.aria}>
            <a href="#how-it-works">{copy.nav.how}</a>
            <a href="#reader-workspace">{copy.nav.demo}</a>
            <LanguageSwitcher currentLocale={locale} />
          </nav>
          <Link className="reading-header-cta" href={isAuthenticated ? localizedPath(locale, "/app") : loginPath}>
            {isAuthenticated ? copy.nav.signedIn : copy.nav.start} <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </header> : null}

      {!embedded ? <section className="reading-hero">
        <div className="reading-container reading-hero-grid">
          <div className="reading-hero-copy">
            <p className="reading-kicker"><BookOpen size={16} aria-hidden="true" /> {copy.hero.kicker}</p>
            <h1>{copy.hero.title}</h1>
            <p className="reading-hero-lead">{copy.hero.lead}</p>
            <div className="reading-hero-actions">
              <a className="reading-button reading-button-primary" href="#reader-workspace">{copy.hero.demoCta} <ChevronRight size={17} aria-hidden="true" /></a>
              <Link className="reading-button reading-button-secondary" href={loginPath}>{copy.hero.materialCta} <Upload size={17} aria-hidden="true" /></Link>
            </div>
            <div className="reading-proof-row" aria-label={copy.hero.benefitsAria}>
              <span><Check size={15} aria-hidden="true" /> {copy.hero.levelBenefit}</span>
              <span><Check size={15} aria-hidden="true" /> {copy.hero.notesBenefit}</span>
            </div>
          </div>

          <div className="reading-hero-preview" aria-label={copy.preview.aria}>
            <div className="reading-preview-topline"><span className="reading-window-dots"><i /><i /><i /></span><span>{copy.preview.workspace}</span><span className="reading-preview-status"><span /> {copy.preview.live}</span></div>
            <div className="reading-preview-body">
              <div className="reading-preview-label">{copy.preview.today}</div>
              <h2>The quiet power of a daily walk</h2>
              <p>A short walk can change the shape of a busy day. It gives your mind a few quiet minutes away from notifications...</p>
              <div className="reading-preview-highlight"><Highlighter size={15} aria-hidden="true" /><span>attention</span><small>{copy.preview.highlightMeaning}</small></div>
              <div className="reading-preview-footer"><span><span className="reading-progress"><i /></span> {copy.preview.minutes}</span><button type="button" onClick={speakArticle} aria-label={copy.preview.listen}><Headphones size={16} aria-hidden="true" /></button></div>
            </div>
          </div>
        </div>
      </section> : null}

      <section className="reading-workspace-section" id="reader-workspace">
        <div className="reading-container">
          {!embedded ? <div className="reading-section-intro">
            <div><p className="reading-kicker">{copy.workspace.kicker}</p><h2>{copy.workspace.title}</h2></div>
            <p>{copy.workspace.lead}</p>
          </div> : null}

          <div className="reading-workspace">
            <aside className="reading-workspace-sidebar">
              <div className="reading-sidebar-heading"><span className="reading-sidebar-icon"><BookOpen size={18} aria-hidden="true" /></span><div><strong>{copy.workspace.practice}</strong><span>{copy.workspace.languageLevel}</span></div></div>
              <div className="reading-sidebar-progress"><div><span>{copy.workspace.progress}</span><strong>{activeTab === "read" ? copy.workspace.stepOne : copy.workspace.stepTwo}</strong></div><span className="reading-progress-track"><i style={{ width: activeTab === "read" ? "25%" : "50%" }} /></span></div>
              <nav className="reading-tabs" aria-label={copy.workspace.toolsAria}>
                {tabs.map(({ id, icon: Icon }, index) => <button className={activeTab === id ? "active" : ""} type="button" key={id} onClick={() => selectTab(id)}><Icon size={17} aria-hidden="true" /><span>{copy.workspace.tabs[index]}</span>{id === "vocabulary" ? <small>{vocabulary.length}</small> : null}</button>)}
              </nav>
              <div className="reading-sidebar-upload">
                <p>{copy.workspace.uploadLead}</p>
                <input ref={fileInputRef} type="file" accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} hidden />
                <button type="button" onClick={() => fileInputRef.current?.click()}><Upload size={16} aria-hidden="true" /> {copy.workspace.importText}</button>
                <Link href={loginPath}><LockKeyhole size={14} aria-hidden="true" /> {copy.workspace.signedInFormats}</Link>
              </div>
            </aside>

            <section className="reading-workspace-main">
              <div className="reading-lesson-toolbar"><div><span className="reading-lesson-type">{fileName ? copy.workspace.yourMaterial : copy.workspace.sampleLesson}</span><h3>{articleTitle}</h3><p>{status} - {wordCount} {copy.workspace.words}</p></div><div className="reading-toolbar-actions"><button type="button" onClick={speakArticle}><Volume2 size={16} aria-hidden="true" /> {isReading ? copy.workspace.stop : copy.workspace.listen}</button>{fileName ? <button type="button" onClick={resetArticle} aria-label={copy.workspace.reset}><RotateCcw size={16} aria-hidden="true" /></button> : null}</div></div>

              {activeTab === "read" ? <div className="reading-article-panel"><div className="reading-article-meta"><span>{copy.article.category}</span><span>{copy.article.duration}</span><span>{copy.article.keyIdea}</span></div>{paragraphs.map((paragraph, index) => <p key={`${paragraph.slice(0, 20)}-${index}`}>{paragraph}</p>)}<div className="reading-article-tip"><Lightbulb size={18} aria-hidden="true" /><div><strong>{copy.article.tipTitle}</strong><p>{copy.article.tipBody}</p></div></div></div> : null}

              {activeTab === "vocabulary" ? <div className="reading-vocabulary-panel"><div className="reading-panel-heading"><div><span className="reading-lesson-type">{copy.vocabulary.kicker}</span><h3>{copy.vocabulary.title}</h3></div><span className="reading-count-badge">{formatCount(copy.vocabulary.count, vocabulary.length)}</span></div><div className="reading-vocab-list">{vocabulary.map((item) => <article className="reading-vocab-item" key={item.id}><div><strong>{item.word}</strong><span>{item.meaning}</span></div><p>{item.example}</p><button type="button" onClick={() => playVocabulary(item)} aria-label={copy.vocabulary.listenTo.replace("{word}", item.word)}><Volume2 size={16} aria-hidden="true" /></button></article>)}</div></div> : null}

              {activeTab === "comprehension" ? <div className="reading-comprehension-panel"><div className="reading-panel-heading"><div><span className="reading-lesson-type">{copy.comprehension.kicker}</span><h3>{copy.comprehension.title}</h3></div><span className="reading-score-badge">{correctAnswers} / {questions.length}</span></div><div className="reading-question-list">{questions.map((question, index) => <fieldset key={question.id}><legend>{index + 1}. {question.prompt}</legend><div>{question.options.map((option, optionIndex) => { const selected = answers[question.id] === optionIndex; const result = answerResults[question.id]; const correct = result?.correct ?? question.correctOptionIndex === optionIndex; const wrong = selected && result ? !result.correct : selected && question.correctOptionIndex !== undefined && !correct; return <button className={selected ? (correct ? "correct" : wrong ? "wrong" : "") : ""} type="button" key={option} onClick={() => selectAnswer(question, optionIndex)}>{option}{selected && correct ? <Check size={15} aria-hidden="true" /> : null}</button>; })}</div></fieldset>)}</div></div> : null}

              {activeTab === "notes" ? <div className="reading-notes-panel"><div className="reading-panel-heading"><div><span className="reading-lesson-type">{copy.notes.kicker}</span><h3>{copy.notes.title}</h3></div><span className="reading-saved-note">{copy.notes.savedHere}</span></div><label htmlFor="reading-notes">{copy.notes.label}</label><textarea id="reading-notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={copy.notes.placeholder} /><div className="reading-notes-footer"><span>{notes.trim() ? copy.notes.saved : copy.notes.private}</span><Link href={loginPath}>{copy.notes.accountCta} <ChevronRight size={15} aria-hidden="true" /></Link></div></div> : null}
            </section>
          </div>
        </div>
      </section>

      {!embedded ? <section className="reading-how-section" id="how-it-works">
        <div className="reading-container"><div className="reading-section-intro"><div><p className="reading-kicker">{copy.method.kicker}</p><h2>{copy.method.title}</h2></div><p>{copy.method.lead}</p></div><div className="reading-benefit-grid">{copy.method.benefits.map((benefit, index) => <article key={benefit.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{benefit.title}</h3><p>{benefit.body}</p></article>)}</div></div>
      </section> : null}

      {!embedded ? <section className="reading-cta-section"><div className="reading-container reading-cta-inner"><div><p className="reading-kicker">{copy.cta.kicker}</p><h2>{copy.cta.title}</h2></div><Link className="reading-button reading-button-primary" href={loginPath}>{copy.cta.action} <ChevronRight size={17} aria-hidden="true" /></Link></div></section> : null}
      {!embedded ? <footer className="reading-footer"><div className="reading-container"><span>AI Language Tutor</span><span>{copy.footer.description}</span><Link href={localizedPath(locale, "/")}>{copy.footer.home} <ChevronRight size={15} aria-hidden="true" /></Link></div></footer> : null}
    </main>
  );
}
