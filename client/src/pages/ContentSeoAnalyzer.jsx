import React, { useState, useEffect } from 'react';
import {
  Gauge,
  Sparkles,
  Copy,
  Download,
  Check,
  AlignLeft,
  Layers,
  Clock,
  BookOpen,
  Hash,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Tag,
  Search,
  CheckCircle2,
  Info,
  Sliders,
  Type
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/react';
import { useOutletContext, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import Protect from '../components/Protect';
import PremiumToolNotice from '../components/PremiumToolNotice';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

/* ─── Helpers ─────────────────────────────────────────── */
const scoreColor = (score) => {
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 60) return 'text-sky-600 dark:text-sky-400';
  if (score >= 40) return 'text-amber-500 dark:text-amber-400';
  return 'text-rose-600 dark:text-rose-400';
};

const scoreBgRing = (score) => {
  if (score >= 80) return 'stroke-emerald-500';
  if (score >= 60) return 'stroke-sky-500';
  if (score >= 40) return 'stroke-amber-500';
  return 'stroke-rose-500';
};

const StatCard = ({ label, value, icon: Icon, sub }) => (
  <div className='flex flex-col gap-1 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'>
    <div className='flex items-center gap-1.5 text-slate-400 dark:text-slate-500'>
      <Icon className='w-3.5 h-3.5' />
      <span className='text-[11px] font-medium uppercase tracking-wider'>{label}</span>
    </div>
    <span className='text-2xl font-bold text-slate-800 dark:text-white mt-0.5'>{value}</span>
    {sub && <span className='text-[11px] text-slate-500 dark:text-slate-400'>{sub}</span>}
  </div>
);

/* ─── Circular Score Ring ──────────────────────────────── */
const ScoreRing = ({ score, label, subtitle }) => {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((score || 0) / 100) * circumference;

  return (
    <div className='flex items-center gap-3.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40'>
      <div className='relative w-20 h-20 shrink-0 flex items-center justify-center'>
        <svg className='w-full h-full -rotate-90' viewBox='0 0 80 80'>
          <circle
            cx='40'
            cy='40'
            r={radius}
            className='stroke-slate-200 dark:stroke-slate-700'
            strokeWidth='6'
            fill='transparent'
          />
          <circle
            cx='40'
            cy='40'
            r={radius}
            className={`transition-all duration-1000 ease-out ${scoreBgRing(score)}`}
            strokeWidth='6'
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap='round'
            fill='transparent'
          />
        </svg>
        <div className='absolute flex flex-col items-center justify-center'>
          <span className={`text-xl font-bold leading-none ${scoreColor(score)}`}>
            {score ?? 0}
          </span>
          <span className='text-[9px] text-slate-400 font-medium'>/100</span>
        </div>
      </div>
      <div>
        <h4 className='text-sm font-semibold text-slate-800 dark:text-slate-200'>{label}</h4>
        <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>{subtitle}</p>
      </div>
    </div>
  );
};

/* ─── Main Component ───────────────────────────────────── */
const ContentSeoAnalyzer = () => {
  const { plan, fetchUsageAndPlan } = useOutletContext();
  const location = useLocation();

  const [title, setTitle] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('seo'); // 'seo' | 'readability' | 'audit'
  const [copied, setCopied] = useState(false);

  // Prepopulate if navigated from WriteArticle.jsx
  useEffect(() => {
    if (location.state?.content) {
      setContent(location.state.content);
      if (location.state.title) setTitle(location.state.title);
      if (location.state.focusKeyword) setFocusKeyword(location.state.focusKeyword);
    }
  }, [location.state]);

  const { getToken } = useAuth();

  const handleCopy = () => {
    if (!result?.content) return;
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result?.content) return;
    const el = document.createElement('a');
    const blob = new Blob([result.content], { type: 'text/markdown;charset=utf-8' });
    el.href = URL.createObjectURL(blob);
    el.download = `rapidai_seo_audit_${Date.now()}.md`;
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 30) {
      toast.error('Please enter at least 30 characters of content to audit.');
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.post(
        '/api/ai/analyze-content-seo',
        { content, focusKeyword, title },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setResult(data);
        toast.success('Content & SEO analysis completed!');
        if (fetchUsageAndPlan) fetchUsageAndPlan();
      } else {
        toast.error(data.message || 'Analysis failed. Please try again.');
      }
    } catch (error) {
      console.error('Content SEO Analyzer error:', error);
      toast.error(error.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Derived Metrics ── */
  const metrics = result?.metrics ?? {};
  const stats = metrics?.stats ?? {};
  const readability = metrics?.readability ?? {};
  const lexicalDiversity = metrics?.lexicalDiversity ?? 0;
  const passiveVoice = metrics?.passiveVoice ?? {};
  const headings = metrics?.headings ?? {};
  const focusKeywordAnalysis = metrics?.focusKeywordAnalysis ?? {};
  const topKeywords = metrics?.topKeywords ?? [];
  const scores = metrics?.scores ?? {};

  const contentScore = scores.contentQualityScore ?? 0;
  const seoScore = scores.seoScore ?? 0;

  const tabs = [
    { id: 'seo', label: 'SEO & Quality', Icon: Gauge },
    { id: 'readability', label: 'Readability & NLP', Icon: AlignLeft },
    { id: 'audit', label: 'AI Audit Report', Icon: Sparkles }
  ];

  return (
    <Protect
      condition={plan === 'premium'}
      fallback={<PremiumToolNotice message='SEO Analyzer is a Premium tool for reviewing content quality and search readiness. Upgrade your plan to discover improvement areas and make your articles more effective.' gradientClass='from-emerald-600 to-teal-500' accentClass='text-emerald-500' />}
    >
      <div className='h-full p-6 flex items-start flex-col lg:flex-row gap-6 text-slate-700 dark:text-slate-200 transition-colors overflow-hidden'>

        {/* ── Left Column: Configuration Form ── */}
        <form
          onSubmit={onSubmitHandler}
          className='w-full lg:w-[45%] p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm shrink-0 flex flex-col max-h-full overflow-y-auto custom-scrollbar'
        >
          <div className='flex items-center gap-3 mb-5 shrink-0'>
            <div className='p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-600 dark:text-emerald-400'>
              <Gauge className='w-5 h-5' />
            </div>
            <div>
              <h1 className='text-lg font-semibold dark:text-white'>AI Content & SEO Analyzer</h1>
              <p className='text-xs text-slate-400 dark:text-slate-500'>Audit readability, keyword density & SEO health</p>
            </div>
          </div>

          {/* Title / Topic input */}
          <div className='mb-4'>
            <label className='block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5'>
              Article / Page Title (Optional)
            </label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g., How to Build Better Work Habits'
              className='w-full p-2.5 px-3 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white transition'
            />
          </div>

          {/* Focus Keyword input */}
          <div className='mb-4'>
            <label className='block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5'>
              Focus Keyword / Target Phrase (Optional)
            </label>
            <div className='relative'>
              <Search className='w-4 h-4 absolute left-3 top-3 text-slate-400' />
              <input
                type='text'
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder='e.g., better work habits'
                className='w-full p-2.5 pl-9 pr-3 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white transition'
              />
            </div>
            <p className='text-[11px] text-slate-400 mt-1'>Evaluates density, frequency, and distribution (target: 1.0%–2.5%).</p>
          </div>

          {/* Content text area */}
          <div className='flex-1 flex flex-col mb-4 min-h-45'>
            <div className='flex justify-between items-center mb-1.5'>
              <label className='block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider'>
                Article / Content Body <span className='text-rose-500'>*</span>
              </label>
              <span className='text-[11px] text-slate-400 font-mono'>
                {content.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              placeholder='e.g., Good work habits can make each day easier. Start with a short list of tasks, work on one task at a time, and take small breaks. These simple steps can help you stay focused and get more done.'
              required
              className='w-full flex-1 p-3 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white custom-scrollbar resize-none font-sans leading-relaxed'
            />
          </div>

          {/* Submit button */}
          <button
            type='submit'
            disabled={loading}
            className='w-full py-2.5 px-4 bg-linear-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-60 cursor-pointer shrink-0'
          >
            {loading ? (
              <>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                <span>Analyzing Content & SEO...</span>
              </>
            ) : (
              <>
                <Sparkles className='w-4 h-4' />
                <span>Analyze Content & SEO</span>
              </>
            )}
          </button>
        </form>

        {/* ── Right Column: Results & Audit ── */}
        <div className='flex-1 w-full p-6 bg-white dark:bg-slate-800 rounded-xl flex flex-col border border-gray-200 dark:border-slate-700 shadow-sm h-full overflow-hidden'>

          {/* Header */}
          <div className='flex items-center justify-between shrink-0 pb-3 border-b border-gray-100 dark:border-slate-700'>
            <div className='flex items-center gap-2'>
              <BookOpen className='w-5 h-5 text-emerald-500' />
              <h2 className='text-lg font-semibold dark:text-white'>Analysis & SEO Audit</h2>
            </div>

            {result && (
              <div className='flex items-center gap-2'>
                <button
                  onClick={handleCopy}
                  className='flex items-center gap-1.5 text-xs border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer'
                >
                  {copied ? <Check className='w-3.5 h-3.5 text-emerald-500' /> : <Copy className='w-3.5 h-3.5' />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className='flex items-center gap-1.5 text-xs border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer'
                >
                  <Download className='w-3.5 h-3.5' />
                  Export
                </button>
              </div>
            )}
          </div>

          {/* Empty State */}
          {!result ? (
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-4 text-gray-400 dark:text-slate-500 max-w-sm text-center'>
                <div className='p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800'>
                  <Gauge className='w-12 h-12 text-slate-300 dark:text-slate-600' />
                </div>
                <h3 className='font-medium text-slate-700 dark:text-slate-300 text-base'>
                  Ready to audit any article or copy
                </h3>
                <p className='text-xs leading-relaxed'>
                  Paste your content or send it from the AI Article Writer to inspect SEO scores, readability ease, heading hierarchy, keyword density, and get Gemini-powered editorial recommendations.
                </p>
              </div>
            </div>
          ) : (
            <div className='flex-1 overflow-y-auto custom-scrollbar pt-4 pr-1 space-y-5'>

              {/* Score Rings Hero */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5'>
                <ScoreRing
                  score={seoScore}
                  label='SEO Health Score'
                  subtitle='Keywords, headings, depth & discoverability'
                />
                <ScoreRing
                  score={contentScore}
                  label='Content Quality Score'
                  subtitle='Readability, lexical variety & pacing'
                />
              </div>

              {/* Navigation Tabs */}
              <div className='flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-2 shrink-0'>
                {tabs.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${activeTab === id
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                  >
                    <Icon className='w-3.5 h-3.5' />
                    {label}
                  </button>
                ))}
              </div>

              {/* ── Tab 1: SEO & Quality ── */}
              {activeTab === 'seo' && (
                <div className='space-y-4'>

                  {/* Focus Keyword Banner */}
                  <div className='p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-3'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Tag className='w-4 h-4 text-emerald-500' />
                        <h4 className='text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300'>
                          Focus Keyword Analysis
                        </h4>
                      </div>
                      {focusKeywordAnalysis.keyword ? (
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${focusKeywordAnalysis.densityPercent >= 1 && focusKeywordAnalysis.densityPercent <= 2.5
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : focusKeywordAnalysis.densityPercent > 2.5
                            ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          }`}>
                          {focusKeywordAnalysis.status}
                        </span>
                      ) : (
                        <span className='text-xs text-slate-400'>No focus keyword provided</span>
                      )}
                    </div>

                    <div className='grid grid-cols-3 gap-3 pt-1'>
                      <div>
                        <span className='text-[11px] text-slate-400 uppercase'>Target Phrase</span>
                        <p className='text-sm font-semibold dark:text-white mt-0.5'>
                          {focusKeywordAnalysis.keyword ? `"${focusKeywordAnalysis.keyword}"` : '—'}
                        </p>
                      </div>
                      <div>
                        <span className='text-[11px] text-slate-400 uppercase'>Occurrences</span>
                        <p className='text-sm font-semibold dark:text-white mt-0.5'>
                          {focusKeywordAnalysis.count ?? 0} times
                        </p>
                      </div>
                      <div>
                        <span className='text-[11px] text-slate-400 uppercase'>Density</span>
                        <p className='text-sm font-semibold dark:text-white mt-0.5'>
                          {focusKeywordAnalysis.densityPercent ?? 0}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Headings Breakdown */}
                  <div className='p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Hash className='w-4 h-4 text-sky-500' />
                        <h4 className='text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300'>
                          Heading Hierarchy (Markdown)
                        </h4>
                      </div>
                      <span className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
                        Total: {headings.total ?? 0} headings
                      </span>
                    </div>

                    <div className='grid grid-cols-3 gap-2.5 pt-1'>
                      <div className='p-2.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-center'>
                        <span className='text-[10px] text-slate-400 font-bold uppercase'>H1 Tag (#)</span>
                        <p className='text-lg font-bold text-slate-800 dark:text-white mt-0.5'>{headings.h1Count ?? 0}</p>
                      </div>
                      <div className='p-2.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-center'>
                        <span className='text-[10px] text-slate-400 font-bold uppercase'>H2 Subheads (##)</span>
                        <p className='text-lg font-bold text-slate-800 dark:text-white mt-0.5'>{headings.h2Count ?? 0}</p>
                      </div>
                      <div className='p-2.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-center'>
                        <span className='text-[10px] text-slate-400 font-bold uppercase'>H3 Sections (###)</span>
                        <p className='text-lg font-bold text-slate-800 dark:text-white mt-0.5'>{headings.h3Count ?? 0}</p>
                      </div>
                    </div>
                  </div>

                  {/* Top Keywords Cloud */}
                  <div className='p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5'>
                    <div className='flex items-center gap-2'>
                      <TrendingUp className='w-4 h-4 text-violet-500' />
                      <h4 className='text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300'>
                        Discovered Keywords & Frequency
                      </h4>
                    </div>
                    <div className='flex flex-wrap gap-2 pt-1'>
                      {topKeywords.map((k, i) => (
                        <span
                          key={i}
                          className='inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        >
                          <span className='font-medium'>{k.keyword}</span>
                          <span className='text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono'>
                            {k.count}×
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ── Tab 2: Readability & NLP ── */}
              {activeTab === 'readability' && (
                <div className='space-y-4'>

                  {/* Core Stats Grid */}
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                    <StatCard label='Word Count' value={stats.wordCount?.toLocaleString() ?? '—'} icon={AlignLeft} sub='Total words' />
                    <StatCard label='Sentences' value={stats.sentenceCount?.toLocaleString() ?? '—'} icon={Layers} sub='Detected sentences' />
                    <StatCard label='Avg Sent. Len' value={`${stats.avgSentenceLength ?? '—'}w`} icon={AlignLeft} sub='Words per sentence' />
                    <StatCard label='Reading Time' value={`~${stats.estimatedReadingTimeMinutes ?? '—'}m`} icon={Clock} sub='At 200 wpm' />
                    <StatCard label='Lexical Diversity' value={`${lexicalDiversity}%`} icon={Type} sub='Type-Token Ratio' />
                    <StatCard label='Passive Voice' value={`${passiveVoice.sentenceRatioPercent ?? 0}%`} icon={Sliders} sub={`${passiveVoice.count ?? 0} instances`} />
                  </div>

                  {/* Readability Breakdown */}
                  <div className='p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40 space-y-3'>
                    <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-300'>Readability Metrics</h3>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                      <div className='flex flex-col'>
                        <span className='text-[11px] uppercase tracking-wider text-slate-500'>Flesch Reading Ease</span>
                        <span className={`text-2xl font-bold mt-0.5 ${scoreColor(readability.fleschReadingEase)}`}>
                          {readability.fleschReadingEase ?? '—'}
                        </span>
                        <span className='text-[11px] text-slate-500 mt-0.5'>Score out of 100</span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-[11px] uppercase tracking-wider text-slate-500'>FK Grade Level</span>
                        <span className='text-2xl font-bold mt-0.5 text-slate-800 dark:text-white'>
                          Grade {readability.fleschKincaidGrade ?? '—'}
                        </span>
                        <span className='text-[11px] text-slate-500 mt-0.5'>US school grade</span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-[11px] uppercase tracking-wider text-slate-500'>Reading Level</span>
                        <span className='text-sm font-semibold mt-1.5 text-slate-700 dark:text-slate-200 leading-tight'>
                          {readability.readingLevel ?? '—'}
                        </span>
                      </div>
                    </div>

                    {/* Readability Bar */}
                    <div>
                      <div className='flex justify-between text-[10px] text-slate-400 mb-1'>
                        <span>Hard (0)</span>
                        <span>Standard (60)</span>
                        <span>Easy (100)</span>
                      </div>
                      <div className='h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden'>
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${(readability.fleschReadingEase ?? 0) >= 70
                            ? 'bg-emerald-500'
                            : (readability.fleschReadingEase ?? 0) >= 50
                              ? 'bg-amber-400'
                              : 'bg-rose-500'
                            }`}
                          style={{ width: `${Math.min(100, readability.fleschReadingEase ?? 0)}%` }}
                        />
                      </div>
                    </div>

                    {/* Conditional Warning */}
                    {readability.isReliable === false && (
                      <div className='flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs leading-relaxed'>
                        <AlertTriangle className='w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400' />
                        <div>
                          <span className='font-semibold'>Readability Score May Be Inaccurate: </span>
                          <span>
                            {readability.reliabilityNote || 'These metrics are designed for continuous prose and may not accurately represent list-heavy, bulleted, or non-standard documents.'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Passive Voice Examples */}
                  {passiveVoice.examples && passiveVoice.examples.length > 0 && (
                    <div className='p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2'>
                      <span className='text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300'>
                        Detected Passive Voice Constructs ({passiveVoice.count} total)
                      </span>
                      <div className='flex flex-wrap gap-2 pt-1'>
                        {passiveVoice.examples.map((ex, idx) => (
                          <span
                            key={idx}
                            className='text-xs px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-mono'
                          >
                            "{ex}"
                          </span>
                        ))}
                      </div>
                      <p className='text-[11px] text-slate-400 mt-1'>
                        Active voice improves reader engagement and direct search intent fulfillment.
                      </p>
                    </div>
                  )}

                </div>
              )}

              {/* ── Tab 3: AI Audit Report ── */}
              {activeTab === 'audit' && (
                <div className='p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30'>
                  <div className='reset-tw prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-200 leading-relaxed'>
                    <Markdown>{result.aiAudit || result.content}</Markdown>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </Protect>
  );
};

export default ContentSeoAnalyzer;
