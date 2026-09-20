import React, { useState } from 'react';
import {
  FileSearch,
  Sparkles,
  Copy,
  Download,
  Check,
  BookOpen,
  FileText,
  BarChart2,
  Tag,
  Clock,
  AlignLeft,
  Layers,
  Hash,
  Microscope,
  ScrollText,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/react';
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import FilePreview from '../components/FilePreview';
import Protect from '../components/Protect';
import PremiumToolNotice from '../components/PremiumToolNotice';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

/* ─── Helpers ─────────────────────────────────────────── */
const readabilityColor = (score) => {
  if (score >= 70) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 50) return 'text-amber-600 dark:text-amber-400';
  return 'text-rose-600 dark:text-rose-400';
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

/* ─── Main Page ─────────────────────────────────────────── */
const DocumentAnalyzer = () => {
  const { plan, fetchUsageAndPlan } = useOutletContext();
  const [docFile, setDocFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');   // 'stats' | 'keywords' | 'analysis'
  const [copied, setCopied] = useState(false);

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
    el.download = `rapidai_doc_analysis_${Date.now()}.md`;
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!docFile || !(docFile instanceof File)) {
      return toast.error('Please upload a PDF document to analyze.');
    }
    if (docFile.type !== 'application/pdf') {
      return toast.error('Only PDF files are supported.');
    }

    try {
      setLoading(true);
      setResult(null);
      setActiveTab('stats');

      const formData = new FormData();
      formData.append('document', docFile);

      const { data } = await axios.post('/api/ai/analyze-document', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        setResult(data);
        toast.success('Document analyzed successfully!');
        if (fetchUsageAndPlan) fetchUsageAndPlan();
      } else {
        toast.error(data.message || 'Analysis failed. Please try again.');
      }
    } catch (error) {
      console.error('Document Analyzer error:', error);
      toast.error(error.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Derived display values ── */
  const isResearch = result?.structure?.isResearchPaper;
  const confidence = result?.structure?.confidence ?? 0;
  const docType = result?.structure?.documentType ?? '';
  const sections = result?.structure?.detectedSections ?? [];
  const stats = result?.stats ?? {};
  const readability = result?.readability ?? {};
  const topKeywords = result?.topKeywords ?? [];

  const typeColor = isResearch
    ? 'bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800'
    : 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800';

  const TypeIcon = isResearch ? Microscope : ScrollText;

  const tabs = [
    { id: 'stats', label: 'Statistics', Icon: BarChart2 },
    { id: 'keywords', label: 'Keywords', Icon: Tag },
    { id: 'analysis', label: 'AI Analysis', Icon: Sparkles }
  ];

  return (
    <Protect
      condition={plan === 'premium'}
      fallback={<PremiumToolNotice message='Document Analyzer is a Premium tool for understanding important documents more clearly. Upgrade your plan to review document structure, key details, and helpful AI-generated insights.' gradientClass='from-cyan-500 to-sky-600' accentClass='text-sky-500' />}
    >
      <div className='h-full p-6 flex items-start flex-col lg:flex-row gap-6 text-slate-700 dark:text-slate-200 transition-colors overflow-hidden'>

        {/* ── Left Column: Upload Form ── */}
        <form
          onSubmit={onSubmitHandler}
          className='w-full lg:w-[45%] p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm shrink-0 flex flex-col max-h-full overflow-y-auto custom-scrollbar'
        >
          {/* Header */}
          <div className='flex items-center gap-3 mb-6'>
            <div className='p-2 rounded-lg bg-linear-to-r from-cyan-500 to-sky-600 text-white'>
              <FileSearch className='w-5 h-5' />
            </div>
            <div>
              <h1 className='text-xl font-semibold text-slate-800 dark:text-white'>Document Analyzer</h1>
              <p className='text-xs text-slate-500 dark:text-slate-400'>Research Papers & General Documents</p>
            </div>
          </div>

          {/* File Upload */}
          <div className='mb-5'>
            <label className='text-sm font-medium dark:text-slate-300 block mb-1.5'>
              Upload Document (PDF)
            </label>
            <input
              id='doc-upload-input'
              type='file'
              accept='application/pdf'
              onChange={(e) => setDocFile(e.target.files[0])}
              className='w-full p-2 outline-none text-xs rounded-md border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 bg-transparent file:font-medium file:border-0 file:bg-sky-500 file:text-white file:px-3 file:py-1 file:rounded file:cursor-pointer hover:file:bg-sky-600 transition-all'
              required
            />
            <p className='text-[11px] text-gray-400 dark:text-slate-500 mt-1'>
              Max 10MB
            </p>
          </div>

          <FilePreview
            file={docFile}
            onRemove={() => setDocFile(null)}
            accentClass='text-sky-500'
          />

          {/* Submit Button */}
          <button
            type='submit'
            disabled={loading}
            id='doc-analyze-btn'
            className='w-full flex justify-center items-center gap-2 bg-linear-to-r from-cyan-500 to-sky-600 hover:shadow-lg hover:shadow-sky-500/30 text-white px-4 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-all disabled:opacity-70 mt-auto'
          >
            {loading ? (
              <>
                <span className='w-4 h-4 rounded-full border-2 border-t-white border-r-transparent animate-spin' />
                <span>Analyzing Document...</span>
              </>
            ) : (
              <>
                <Sparkles className='w-4 h-4' />
                <span>Analyze Document</span>
              </>
            )}
          </button>
        </form>

        {/* ── Right Column: Results ── */}
        <div className='flex-1 w-full p-6 bg-white dark:bg-slate-800 rounded-xl flex flex-col border border-gray-200 dark:border-slate-700 shadow-sm h-full overflow-hidden'>

          {/* Header */}
          <div className='flex items-center justify-between shrink-0 pb-3 border-b border-gray-100 dark:border-slate-700'>
            <div className='flex items-center gap-2'>
              <BookOpen className='w-5 h-5 text-sky-500' />
              <h2 className='text-lg font-semibold dark:text-white'>Analysis Results</h2>
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
                  <Download className='w-3.5 h-3.5' /> Export
                </button>
              </div>
            )}
          </div>

          {/* Empty State */}
          {!result ? (
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-4 text-gray-400 dark:text-slate-500 max-w-sm text-center'>
                <div className='p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800'>
                  <FileSearch className='w-12 h-12 text-slate-300 dark:text-slate-600' />
                </div>
                <h3 className='font-medium text-slate-700 dark:text-slate-300 text-base'>
                  Ready to analyze any document
                </h3>
                <p className='text-xs leading-relaxed'>
                  Upload a PDF — research paper, technical report, business document, or article — to get deep NLP statistics, document classification, keyword analysis, and a structured AI breakdown.
                </p>
              </div>
            </div>
          ) : (
            <div className='flex-1 overflow-y-auto custom-scrollbar pt-4 pr-1 space-y-5'>

              {/* Document Type Badge */}
              <div className={`flex items-center justify-between p-3.5 rounded-xl border ${typeColor}`}>
                <div className='flex items-center gap-2.5'>
                  <TypeIcon className='w-5 h-5 shrink-0' />
                  <div>
                    <p className='text-sm font-semibold'>{docType}</p>
                    <p className='text-[11px] opacity-80'>
                      {confidence}% detection confidence
                      {sections.length > 0 && ` • ${sections.length} structural markers found`}
                    </p>
                  </div>
                </div>
                {sections.length > 0 && (
                  <div className='hidden sm:flex flex-wrap gap-1 justify-end max-w-[55%]'>
                    {sections.slice(0, 4).map((s, i) => (
                      <span key={i} className='text-[10px] px-2 py-0.5 rounded-full bg-white/60 dark:bg-black/20 border border-current/20 font-medium'>
                        {s}
                      </span>
                    ))}
                    {sections.length > 4 && (
                      <span className='text-[10px] px-2 py-0.5 rounded-full bg-white/60 dark:bg-black/20 border border-current/20 font-medium'>
                        +{sections.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Tab Bar */}
              <div className='flex bg-slate-100 dark:bg-slate-700/60 p-0.5 rounded-xl text-xs w-full'>
                {tabs.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-medium transition cursor-pointer ${activeTab === id
                      ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                      }`}
                  >
                    <Icon className='w-3.5 h-3.5' />
                    {label}
                  </button>
                ))}
              </div>

              {/* ── Tab 1: Statistics ── */}
              {activeTab === 'stats' && (
                <div className='space-y-4'>
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                    <StatCard label='Word Count' value={stats.wordCount?.toLocaleString() ?? '—'} icon={AlignLeft} sub='Total words' />
                    <StatCard label='Sentences' value={stats.sentenceCount?.toLocaleString() ?? '—'} icon={Layers} sub='Detected sentences' />
                    <StatCard label='Paragraphs' value={stats.paragraphCount?.toLocaleString() ?? '—'} icon={Hash} sub='Detected paragraphs' />
                    <StatCard label='Avg Sent. Len' value={`${stats.avgSentenceLength ?? '—'}w`} icon={AlignLeft} sub='Words per sentence' />
                    <StatCard label='Reading Time' value={`~${stats.estimatedReadingTimeMinutes ?? '—'} min`} icon={Clock} sub='At 200 wpm' />
                    <StatCard label='Char Count' value={stats.charCount?.toLocaleString() ?? '—'} icon={FileText} sub='Total characters' />
                  </div>

                  {/* Readability Section */}
                  <div className='p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40 space-y-3'>
                    <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-300'>Readability Metrics</h3>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                      <div className='flex flex-col'>
                        <span className='text-[11px] uppercase tracking-wider text-slate-500'>Flesch Reading Ease</span>
                        <span className={`text-2xl font-bold mt-0.5 ${readabilityColor(readability.fleschReadingEase)}`}>
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

                    {/* Visual Bar */}
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

                    {/* Unreliable Readability Warning */}
                    {readability.isReliable === false && (
                      <div className='flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs leading-relaxed'>
                        <AlertTriangle className='w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400' />
                        <div>
                          <span className='font-semibold'>Readability Score May Be Inaccurate: </span>
                          <span>
                            {readability.reliabilityNote || 'These metrics are designed for continuous prose and may not accurately represent list-heavy, bulleted, or resume-style documents.'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Formula note */}
                    <p className='text-[11px] text-slate-400 dark:text-slate-500'>
                      <strong>Formula:</strong> Flesch = 206.835 − (1.015 × ASL) − (84.6 × ASW)  |  FK Grade = (0.39 × ASL) + (11.8 × ASW) − 15.59
                    </p>
                  </div>
                </div>
              )}

              {/* ── Tab 2: Keywords ── */}
              {activeTab === 'keywords' && (
                <div className='space-y-4'>
                  {topKeywords.length === 0 ? (
                    <p className='text-sm text-slate-500 italic'>No keywords extracted.</p>
                  ) : (
                    <>
                      {/* Bar chart visual */}
                      <div className='space-y-2'>
                        {topKeywords.slice(0, 10).map((kw, idx) => {
                          const maxCount = topKeywords[0]?.count || 1;
                          const pct = Math.round((kw.count / maxCount) * 100);
                          return (
                            <div key={idx} className='flex items-center gap-3'>
                              <span className='text-xs font-mono text-slate-500 dark:text-slate-400 w-4 text-right shrink-0'>
                                {idx + 1}
                              </span>
                              <span className='text-xs font-semibold text-slate-700 dark:text-slate-200 w-28 shrink-0 truncate'>
                                {kw.keyword}
                              </span>
                              <div className='flex-1 h-5 bg-slate-100 dark:bg-slate-700/60 rounded-md overflow-hidden'>
                                <div
                                  className='h-full bg-linear-to-r from-cyan-400 to-sky-500 rounded-md transition-all duration-700 flex items-center justify-end pr-2'
                                  style={{ width: `${Math.max(pct, 8)}%` }}
                                >
                                  <span className='text-[10px] text-white font-medium'>{kw.count}×</span>
                                </div>
                              </div>
                              <span className='text-[11px] text-slate-400 w-10 text-right shrink-0'>
                                {kw.densityPercent}%
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Tag cloud for remaining */}
                      {topKeywords.length > 10 && (
                        <div className='flex flex-wrap gap-1.5 pt-1'>
                          {topKeywords.slice(10).map((kw, idx) => (
                            <span
                              key={idx}
                              className='text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                            >
                              {kw.keyword} <span className='opacity-60'>{kw.count}×</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ── Tab 3: AI Analysis ── */}
              {activeTab === 'analysis' && (
                <div className='p-5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700'>
                  <div className='reset-tw text-sm text-slate-700 dark:text-slate-300'>
                    <Markdown>{result.aiFeedback}</Markdown>
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

export default DocumentAnalyzer;
