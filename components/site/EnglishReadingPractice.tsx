"use client";

import Link from "next/link";
import { BookOpen, Check, ChevronRight, FileText, Highlighter, Headphones, Lightbulb, LockKeyhole, Play, RotateCcw, Upload, Volume2 } from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

type ReaderTab = "read" | "vocabulary" | "comprehension" | "notes";

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

const tabs: Array<{ id: ReaderTab; label: string; icon: typeof BookOpen }> = [
  { id: "read", label: "Read", icon: BookOpen },
  { id: "vocabulary", label: "Vocabulary", icon: Lightbulb },
  { id: "comprehension", label: "Comprehension", icon: Check },
  { id: "notes", label: "Study Notes", icon: FileText }
];

export function EnglishReadingPractice() {
  const [activeTab, setActiveTab] = useState<ReaderTab>("read");
  const [articleText, setArticleText] = useState(sampleArticle.text);
  const [articleTitle, setArticleTitle] = useState(sampleArticle.title);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("Sample text ready");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState("");
  const [isReading, setIsReading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("reading-practice-notes");
    if (saved) setNotes(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("reading-practice-notes", notes);
  }, [notes]);

  const paragraphs = useMemo(() => articleText.split(/\n+/).map((paragraph) => paragraph.trim()).filter(Boolean), [articleText]);
  const wordCount = useMemo(() => articleText.trim().split(/\s+/).filter(Boolean).length, [articleText]);
  const correctAnswers = sampleArticle.questions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("text/") && !file.name.toLowerCase().endsWith(".txt")) {
      setStatus("For this preview, choose a .txt file. PDF and DOCX import is available after sign in.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === "string" ? reader.result.trim() : "";
      if (!content) {
        setStatus("That file did not contain readable text.");
        return;
      }
      setArticleText(content.slice(0, 16000));
      setArticleTitle(file.name.replace(/\.txt$/i, ""));
      setFileName(file.name);
      setStatus(`Loaded ${file.name}`);
      setActiveTab("read");
    };
    reader.onerror = () => setStatus("The file could not be read. Try another text file.");
    reader.readAsText(file);
  }

  function resetArticle() {
    setArticleText(sampleArticle.text);
    setArticleTitle(sampleArticle.title);
    setFileName("");
    setStatus("Sample text ready");
    setAnswers({});
  }

  function speakArticle() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(articleText);
    utterance.lang = "en-US";
    utterance.rate = 0.88;
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    setIsReading(true);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <main className="reading-page">
      <header className="reading-header">
        <div className="reading-container reading-header-inner">
          <Link className="reading-brand" href="/" aria-label="AI Language Tutor home">
            <img src="/arno.svg" alt="" />
            <span>AI Language Tutor</span>
          </Link>
          <nav className="reading-nav" aria-label="Reading practice navigation">
            <a href="#how-it-works">How it works</a>
            <a href="#reader-workspace">Try the demo</a>
            <Link href="/login?next=/english-reading-practice">Sign in</Link>
          </nav>
          <Link className="reading-header-cta" href="/login?next=/english-reading-practice">
            Start practicing <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <section className="reading-hero">
        <div className="reading-container reading-hero-grid">
          <div className="reading-hero-copy">
            <p className="reading-kicker"><BookOpen size={16} aria-hidden="true" /> English reading practice</p>
            <h1>Read something real. Learn what stays with you.</h1>
            <p className="reading-hero-lead">Turn an article, note, or short story into a focused English lesson with vocabulary, comprehension checks, and speaking practice in one place.</p>
            <div className="reading-hero-actions">
              <a className="reading-button reading-button-primary" href="#reader-workspace">Try the reading demo <ChevronRight size={17} aria-hidden="true" /></a>
              <Link className="reading-button reading-button-secondary" href="/login?next=/english-reading-practice">Use your own material <Upload size={17} aria-hidden="true" /></Link>
            </div>
            <div className="reading-proof-row" aria-label="Reading practice benefits">
              <span><Check size={15} aria-hidden="true" /> Read at your level</span>
              <span><Check size={15} aria-hidden="true" /> Save notes as you go</span>
            </div>
          </div>

          <div className="reading-hero-preview" aria-label="Reading practice preview">
            <div className="reading-preview-topline"><span className="reading-window-dots"><i /><i /><i /></span><span>Reading workspace</span><span className="reading-preview-status"><span /> Live preview</span></div>
            <div className="reading-preview-body">
              <div className="reading-preview-label">TODAY&apos;S READING</div>
              <h2>The quiet power of a daily walk</h2>
              <p>A short walk can change the shape of a busy day. It gives your mind a few quiet minutes away from notifications...</p>
              <div className="reading-preview-highlight"><Highlighter size={15} aria-hidden="true" /><span>attention</span><small>focus on something</small></div>
              <div className="reading-preview-footer"><span><span className="reading-progress"><i /></span> 3 min lesson</span><button type="button" onClick={speakArticle} aria-label="Listen to the sample reading"><Headphones size={16} aria-hidden="true" /></button></div>
            </div>
          </div>
        </div>
      </section>

      <section className="reading-workspace-section" id="reader-workspace">
        <div className="reading-container">
          <div className="reading-section-intro">
            <div><p className="reading-kicker">A complete practice loop</p><h2>One text, four ways to learn.</h2></div>
            <p>Start with a short sample, then explore the tools a language tutor puts beside the words you are already reading.</p>
          </div>

          <div className="reading-workspace">
            <aside className="reading-workspace-sidebar">
              <div className="reading-sidebar-heading"><span className="reading-sidebar-icon"><BookOpen size={18} aria-hidden="true" /></span><div><strong>Reading practice</strong><span>English - B1</span></div></div>
              <div className="reading-sidebar-progress"><div><span>Lesson progress</span><strong>{activeTab === "read" ? "1 of 4" : "2 of 4"}</strong></div><span className="reading-progress-track"><i style={{ width: activeTab === "read" ? "25%" : "50%" }} /></span></div>
              <nav className="reading-tabs" aria-label="Reading lesson tools">
                {tabs.map(({ id, label, icon: Icon }) => <button className={activeTab === id ? "active" : ""} type="button" key={id} onClick={() => setActiveTab(id)}><Icon size={17} aria-hidden="true" /><span>{label}</span>{id === "vocabulary" ? <small>3</small> : null}</button>)}
              </nav>
              <div className="reading-sidebar-upload">
                <p>Bring a short text to practice with.</p>
                <input ref={fileInputRef} type="file" accept=".txt,text/plain" onChange={handleFileChange} hidden />
                <button type="button" onClick={() => fileInputRef.current?.click()}><Upload size={16} aria-hidden="true" /> Import text</button>
                <Link href="/login?next=/english-reading-practice"><LockKeyhole size={14} aria-hidden="true" /> PDF and DOCX with Tutor</Link>
              </div>
            </aside>

            <section className="reading-workspace-main">
              <div className="reading-lesson-toolbar"><div><span className="reading-lesson-type">{fileName ? "YOUR MATERIAL" : "SAMPLE LESSON"}</span><h3>{articleTitle}</h3><p>{status} - {wordCount} words</p></div><div className="reading-toolbar-actions"><button type="button" onClick={speakArticle}><Volume2 size={16} aria-hidden="true" /> {isReading ? "Stop" : "Listen"}</button>{fileName ? <button type="button" onClick={resetArticle} aria-label="Reset to sample"><RotateCcw size={16} aria-hidden="true" /></button> : null}</div></div>

              {activeTab === "read" ? <div className="reading-article-panel"><div className="reading-article-meta"><span>Everyday English</span><span>3 min read</span><span>Key idea: habits</span></div>{paragraphs.map((paragraph, index) => <p key={`${paragraph.slice(0, 20)}-${index}`}>{paragraph}</p>)}<div className="reading-article-tip"><Lightbulb size={18} aria-hidden="true" /><div><strong>Reading tip</strong><p>Do not translate every word. First, find the main idea of each paragraph.</p></div></div></div> : null}

              {activeTab === "vocabulary" ? <div className="reading-vocabulary-panel"><div className="reading-panel-heading"><div><span className="reading-lesson-type">KEY WORDS</span><h3>Words worth keeping</h3></div><span className="reading-count-badge">3 words</span></div><div className="reading-vocab-list">{sampleArticle.vocabulary.map((item) => <article className="reading-vocab-item" key={item.word}><div><strong>{item.word}</strong><span>{item.meaning}</span></div><p>{item.example}</p><button type="button" onClick={() => { const utterance = new SpeechSynthesisUtterance(item.word); utterance.lang = "en-US"; window.speechSynthesis.speak(utterance); }} aria-label={`Listen to ${item.word}`}><Volume2 size={16} aria-hidden="true" /></button></article>)}</div></div> : null}

              {activeTab === "comprehension" ? <div className="reading-comprehension-panel"><div className="reading-panel-heading"><div><span className="reading-lesson-type">CHECK YOUR UNDERSTANDING</span><h3>Can you remember the main idea?</h3></div><span className="reading-score-badge">{correctAnswers} / {sampleArticle.questions.length}</span></div><div className="reading-question-list">{sampleArticle.questions.map((question, index) => <fieldset key={question.prompt}><legend>{index + 1}. {question.prompt}</legend><div>{question.options.map((option, optionIndex) => <button className={answers[index] === optionIndex ? (optionIndex === question.answer ? "correct" : "wrong") : ""} type="button" key={option} onClick={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))}>{option}{answers[index] === optionIndex && optionIndex === question.answer ? <Check size={15} aria-hidden="true" /> : null}</button>)}</div></fieldset>)}</div></div> : null}

              {activeTab === "notes" ? <div className="reading-notes-panel"><div className="reading-panel-heading"><div><span className="reading-lesson-type">YOUR REVIEW</span><h3>Keep the useful part.</h3></div><span className="reading-saved-note">Saved in this browser</span></div><label htmlFor="reading-notes">Write a phrase, question, or summary to revisit later.</label><textarea id="reading-notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="I want to remember..." /><div className="reading-notes-footer"><span>{notes.trim() ? "Your note is saved automatically." : "Your notes stay private on this device."}</span><Link href="/login?next=/english-reading-practice">Save notes to your account <ChevronRight size={15} aria-hidden="true" /></Link></div></div> : null}
            </section>
          </div>
        </div>
      </section>

      <section className="reading-how-section" id="how-it-works">
        <div className="reading-container"><div className="reading-section-intro"><div><p className="reading-kicker">Designed for steady progress</p><h2>Make reading feel active.</h2></div><p>Good reading practice is more than finishing a page. It helps you notice useful language, test your understanding, and return tomorrow with a little more confidence.</p></div><div className="reading-benefit-grid"><article><span>01</span><h3>Read with a clear focus</h3><p>See the main idea first, then slow down for phrases that are useful in your own life.</p></article><article><span>02</span><h3>Practice what you notice</h3><p>Listen to new words, answer a quick question, and connect meaning with context.</p></article><article><span>03</span><h3>Build your personal library</h3><p>Bring your own materials into the Tutor and keep the notes you want to use again.</p></article></div></div>
      </section>

      <section className="reading-cta-section"><div className="reading-container reading-cta-inner"><div><p className="reading-kicker">Your next lesson can start with one page</p><h2>Read, speak, and remember more.</h2></div><Link className="reading-button reading-button-primary" href="/login?next=/english-reading-practice">Open your reading workspace <ChevronRight size={17} aria-hidden="true" /></Link></div></section>
      <footer className="reading-footer"><div className="reading-container"><span>AI Language Tutor</span><span>English reading practice for real life.</span><Link href="/">Back to home <ChevronRight size={15} aria-hidden="true" /></Link></div></footer>
    </main>
  );
}
