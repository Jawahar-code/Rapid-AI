import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  Copy,
  Download,
  Check,
  Crown,
  CheckCircle2,
  XCircle,
  PlusCircle,
  FileText,
  Info,
  TrendingUp,
  Percent
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Protect from '../components/Protect';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ResumeJobMatch = () => {
  const { plan, fetchUsageAndPlan } = useOutletContext();
  const [resumeFile, setResumeFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('skills'); // 'skills' | 'report'
  const [copied, setCopied] = useState(false);

  const { getToken } = useAuth();
  const navigate = useNavigate();

  const handleCopy = () => {
    if (!result?.content) return;
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result?.content) return;
    const element = document.createElement('a');
    const file = new Blob([result.content], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `rapidai_job_match_${jobTitle ? jobTitle.replace(/\s+/g, '_') : 'report'}_${Date.now()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!resumeFile || !(resumeFile instanceof File)) {
      return toast.error('Please upload your resume in PDF format!');
    }

    if (resumeFile.type !== 'application/pdf') {
      return toast.error('Only PDF files are supported for resume upload.');
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      return toast.error('Please paste a job description with at least 20 characters.');
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);
      formData.append('jobTitle', jobTitle || 'Target Role');

      const { data } = await axios.post('/api/ai/resume-job-match', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        setResult(data);
        toast.success('Resume–Job Match completed!');
        if (fetchUsageAndPlan) fetchUsageAndPlan();
      } else {
        toast.error(data.message || 'Analysis failed. Please try again.');
      }
    } catch (error) {
      console.error('Job Match Error:', error);
      toast.error(error.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30';
    if (score >= 45) return 'text-amber-600 dark:text-amber-400 border-amber-500 bg-amber-50 dark:bg-amber-950/30';
    return 'text-rose-600 dark:text-rose-400 border-rose-500 bg-rose-50 dark:bg-rose-950/30';
  };

  return (
    <Protect
      condition={plan === 'premium'}
      fallback={
        <div className='flex-1 h-full flex items-center justify-center p-6'>
          <div className='max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl text-center'>
            <div className='w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary'>
              <Crown className='w-10 h-10 fill-current' />
            </div>
            <h2 className='text-2xl font-bold text-slate-800 dark:text-white mb-3'>Premium Intelligence Tool</h2>
            <p className='text-slate-500 dark:text-slate-400 mb-8'>
              Resume–Job Matching & Skill-Gap Analysis is a premium feature. Upgrade your plan to get transparent mathematical skill-matching, TF-IDF cosine alignment, and AI career guidance.
            </p>
            <button
              onClick={() => navigate('/ai/settings')}
              className='w-full py-3 bg-linear-to-r from-primary to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all cursor-pointer'
            >
              Upgrade to Premium
            </button>
          </div>
        </div>
      }
    >
      <div className='h-full p-6 flex items-start flex-col lg:flex-row gap-6 text-slate-700 dark:text-slate-200 transition-colors overflow-hidden'>
        {/* Left Column: Input Form */}
        <form
          onSubmit={onSubmitHandler}
          className='w-full lg:w-[45%] p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm shrink-0 flex flex-col max-h-full overflow-y-auto custom-scrollbar'
        >
          <div className='flex items-center gap-3 mb-5'>
            <div className='p-2 rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 text-white'>
              <Briefcase className='w-5 h-5' />
            </div>
            <div>
              <h1 className='text-xl font-semibold text-slate-800 dark:text-white'>Resume–Job Matching</h1>
              <p className='text-xs text-slate-500 dark:text-slate-400'>Transparent Skill-Gap Analysis & AI Coaching</p>
            </div>
          </div>

          {/* Resume PDF Input */}
          <div className='mb-4'>
            <label className='text-sm font-medium dark:text-slate-300 block mb-1.5'>
              Upload Resume (PDF)
            </label>
            <input
              type='file'
              accept='application/pdf'
              onChange={(e) => setResumeFile(e.target.files[0])}
              className='w-full p-2 outline-none text-xs rounded-md border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 bg-transparent file:font-medium file:border-0 file:bg-primary file:text-white file:px-3 file:py-1 file:rounded file:cursor-pointer hover:file:bg-indigo-600 transition-all'
              required
            />
            <p className='text-[11px] text-gray-400 dark:text-slate-500 mt-1'>
              Max 5MB • Text-searchable PDF format
            </p>
          </div>

          {/* Job Title Input */}
          <div className='mb-4'>
            <label className='text-sm font-medium dark:text-slate-300 block mb-1.5'>
              Target Job Title (Optional)
            </label>
            <input
              type='text'
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder='e.g., Senior Full Stack Developer'
              className='w-full p-2.5 px-3 outline-none text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-primary/20 transition-all dark:text-white'
            />
          </div>

          {/* Job Description Textarea */}
          <div className='mb-5 flex-1 flex flex-col'>
            <div className='flex justify-between items-center mb-1.5'>
              <label className='text-sm font-medium dark:text-slate-300'>
                Job Description Requirements
              </label>
              <span className='text-[11px] text-slate-400'>
                {jobDescription.length} chars
              </span>
            </div>
            <textarea
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder='Paste the target job description or job posting text here (responsibilities, required tech stack, qualifications)...'
              required
              className='w-full p-3 outline-none text-xs sm:text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-primary/20 transition-all dark:text-white resize-none'
            />
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={loading}
            className='w-full flex justify-center items-center gap-2 bg-linear-to-r from-primary to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30 text-white px-4 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-all disabled:opacity-70 mt-auto'
          >
            {loading ? (
              <>
                <span className='w-4 h-4 rounded-full border-2 border-t-white border-r-transparent animate-spin' />
                <span>Analyzing Match & Skills...</span>
              </>
            ) : (
              <>
                <Sparkles className='w-4 h-4' />
                <span>Run Resume-Job Match</span>
              </>
            )}
          </button>
        </form>

        {/* Right Column: Analysis Results */}
        <div className='flex-1 w-full p-6 bg-white dark:bg-slate-800 rounded-xl flex flex-col border border-gray-200 dark:border-slate-700 shadow-sm h-full overflow-hidden'>
          {/* Header Bar */}
          <div className='flex items-center justify-between shrink-0 pb-3 border-b border-gray-100 dark:border-slate-700'>
            <div className='flex items-center gap-2'>
              <TrendingUp className='w-5 h-5 text-primary' />
              <h2 className='text-lg font-semibold dark:text-white'>Match & Gap Report</h2>
            </div>

            {result && (
              <div className='flex items-center gap-2'>
                {/* Tab Switcher */}
                <div className='flex bg-slate-100 dark:bg-slate-700/60 p-0.5 rounded-lg text-xs mr-2'>
                  <button
                    onClick={() => setActiveTab('skills')}
                    className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                      activeTab === 'skills'
                        ? 'bg-white dark:bg-slate-800 text-primary dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Skills Breakdown
                  </button>
                  <button
                    onClick={() => setActiveTab('report')}
                    className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                      activeTab === 'report'
                        ? 'bg-white dark:bg-slate-800 text-primary dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    AI Action Plan
                  </button>
                </div>

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

          {/* Body Content */}
          {!result ? (
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-4 text-gray-400 dark:text-slate-500 max-w-sm text-center'>
                <div className='p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800'>
                  <Briefcase className='w-12 h-12 text-slate-300 dark:text-slate-600' />
                </div>
                <h3 className='font-medium text-slate-700 dark:text-slate-300 text-base'>
                  Ready to evaluate candidate fit
                </h3>
                <p className='text-xs leading-relaxed'>
                  Upload your resume PDF and paste the target job description to compute transparent skill-gap scores, TF-IDF cosine alignment, and AI recommendations.
                </p>
              </div>
            </div>
          ) : (
            <div className='flex-1 overflow-y-auto custom-scrollbar pt-4 pr-1 space-y-6'>
              {/* Top Score Cards */}
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                {/* Overall Score */}
                <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${getScoreColor(result.analysis.overallScore)}`}>
                  <span className='text-xs font-semibold uppercase tracking-wider opacity-80'>Overall Match</span>
                  <div className='text-3xl font-bold mt-1 flex items-center gap-0.5'>
                    <span>{result.analysis.overallScore}</span>
                    <Percent className='w-5 h-5' />
                  </div>
                  <span className='text-[11px] mt-1 opacity-75'>70% Skills + 30% Context</span>
                </div>

                {/* Direct Skill Match */}
                <div className='p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-center'>
                  <span className='text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                    Technical Skill Match
                  </span>
                  <div className='text-3xl font-bold mt-1 text-slate-800 dark:text-white flex items-center gap-0.5'>
                    <span>{result.analysis.directSkillMatchPercent}</span>
                    <Percent className='w-5 h-5 text-slate-400' />
                  </div>
                  <span className='text-[11px] text-slate-500 dark:text-slate-400 mt-1'>
                    {result.analysis.matchingSkills.length} of {result.analysis.stats.totalRequiredSkills} required skills
                  </span>
                </div>

                {/* TF-IDF Cosine Similarity */}
                <div className='p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-center'>
                  <span className='text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                    Contextual TF-IDF
                  </span>
                  <div className='text-3xl font-bold mt-1 text-slate-800 dark:text-white flex items-center gap-0.5'>
                    <span>{result.analysis.cosineSimilarity}</span>
                    <Percent className='w-5 h-5 text-slate-400' />
                  </div>
                  <span className='text-[11px] text-slate-500 dark:text-slate-400 mt-1'>
                    Vocabulary Cosine Angle
                  </span>
                </div>
              </div>

              {/* Explanatory Formula Banner */}
              <div className='flex items-center gap-2 p-2.5 px-3.5 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-lg text-xs text-indigo-800 dark:text-indigo-300'>
                <Info className='w-4 h-4 shrink-0 text-primary' />
                <span>
                  <strong>Scoring Model:</strong> {result.analysis.scoringFormula}
                </span>
              </div>

              {/* Tab 1: Skills Breakdown */}
              {activeTab === 'skills' && (
                <div className='space-y-5'>
                  {/* Matching Skills */}
                  <div className='p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20'>
                    <div className='flex items-center justify-between mb-3'>
                      <div className='flex items-center gap-2'>
                        <CheckCircle2 className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
                        <h3 className='text-sm font-semibold text-emerald-800 dark:text-emerald-300'>
                          Matching Skills ({result.analysis.matchingSkills.length})
                        </h3>
                      </div>
                      <span className='text-[11px] text-emerald-600 dark:text-emerald-400 font-medium'>
                        Found in both Resume and JD
                      </span>
                    </div>

                    {result.analysis.matchingSkills.length === 0 ? (
                      <p className='text-xs text-slate-500 italic'>No exact technical skill overlaps detected.</p>
                    ) : (
                      <div className='flex flex-wrap gap-1.5'>
                        {result.analysis.matchingSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className='inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                          >
                            <Check className='w-3 h-3 text-emerald-600' />
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Missing Skills */}
                  <div className='p-4 rounded-xl border border-rose-200 dark:border-rose-800/60 bg-rose-50/30 dark:bg-rose-950/20'>
                    <div className='flex items-center justify-between mb-3'>
                      <div className='flex items-center gap-2'>
                        <XCircle className='w-4 h-4 text-rose-600 dark:text-rose-400' />
                        <h3 className='text-sm font-semibold text-rose-800 dark:text-rose-300'>
                          Missing Required Skills ({result.analysis.missingSkills.length})
                        </h3>
                      </div>
                      <span className='text-[11px] text-rose-600 dark:text-rose-400 font-medium'>
                        Priority gaps to bridge
                      </span>
                    </div>

                    {result.analysis.missingSkills.length === 0 ? (
                      <p className='text-xs text-emerald-600 dark:text-emerald-400 font-medium'>
                        🎉 Outstanding! You possess all technical skills mentioned in the job description!
                      </p>
                    ) : (
                      <div className='flex flex-wrap gap-1.5'>
                        {result.analysis.missingSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className='inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md font-medium bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                          >
                            <XCircle className='w-3 h-3 text-rose-500' />
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Additional Resume Skills */}
                  <div className='p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30'>
                    <div className='flex items-center justify-between mb-3'>
                      <div className='flex items-center gap-2'>
                        <PlusCircle className='w-4 h-4 text-blue-500' />
                        <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-300'>
                          Additional Resume Skills ({result.analysis.additionalSkills.length})
                        </h3>
                      </div>
                      <span className='text-[11px] text-slate-500'>
                        Bonus competencies on resume
                      </span>
                    </div>

                    {result.analysis.additionalSkills.length === 0 ? (
                      <p className='text-xs text-slate-500 italic'>No extra skills identified.</p>
                    ) : (
                      <div className='flex flex-wrap gap-1.5'>
                        {result.analysis.additionalSkills.slice(0, 20).map((skill, idx) => (
                          <span
                            key={idx}
                            className='inline-flex items-center text-xs px-2.5 py-1 rounded-md font-medium bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40'
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Full AI Report & Action Plan */}
              {activeTab === 'report' && (
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

export default ResumeJobMatch;
