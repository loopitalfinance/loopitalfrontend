import React, { useState } from 'react';
import { analyzeProjectRisk } from '../services/geminiService';
import { Project, AIAnalysisResult } from '../types';
import {
  SparklesIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface Props {
  project: Project;
}

const RiskAnalyzer: React.FC<Props> = ({ project }) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await analyzeProjectRisk(project.fullDetails);
      setAnalysis(result);
    } catch (err) {
      setError('Analysis failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score <= 3)
      return 'text-[#00DC82] border-[#00DC82]/20 bg-[#00DC82]/5';
    if (score <= 6)
      return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
    return 'text-red-500 border-red-500/20 bg-red-500/5';
  };

  return (
    <div className="relative mt-8 overflow-hidden rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
      {/* Decorative gradient */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-50 to-transparent opacity-60" />

      {/* Header */}
      <div className="relative z-10 mb-8 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-[#0A192F]">
            <SparklesIcon className="h-5 w-5 text-[#00DC82]" />
            AI Risk Analysis
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Powered by Gemini 2.5 Flash
          </p>
        </div>

        {!analysis && !loading && (
          <button
            onClick={handleAnalyze}
            className="flex items-center gap-2 rounded-xl bg-[#0A192F] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-slate-900/10 transition-colors hover:bg-slate-800"
          >
            Generate Report
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <ArrowPathIcon className="mb-4 h-8 w-8 animate-spin text-[#00DC82]" />
          <p className="animate-pulse text-sm font-medium text-slate-500">
            Analyzing project details…
          </p>
        </div>
      )}

      {/* Result */}
      {analysis && !loading && (
        <div className="relative z-10 animate-fade-in">
          <div className="flex flex-col items-start gap-8 md:flex-row">
            {/* Score Card */}
            <div
              className={`flex w-full flex-shrink-0 flex-col items-center justify-center rounded-2xl border p-6 md:w-32 ${getScoreColor(
                analysis.riskScore
              )}`}
            >
              <span className="text-4xl font-bold">
                {analysis.riskScore}
              </span>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-wider opacity-80">
                Risk Score
              </span>
            </div>

            {/* Details */}
            <div className="w-full flex-grow space-y-6">
              <p className="border-l-2 border-[#00DC82] pl-4 text-sm italic leading-relaxed text-slate-600">
                “{analysis.summary}”
              </p>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Strengths */}
                <div>
                  <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <CheckCircleIcon className="h-4 w-4 text-[#00DC82]" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {analysis.pros.map((pro, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-slate-700"
                      >
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-slate-300" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risks */}
                <div>
                  <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <ExclamationTriangleIcon className="h-4 w-4 text-amber-500" />
                    Risks
                  </h4>
                  <ul className="space-y-2">
                    {analysis.cons.map((con, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-slate-700"
                      >
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-slate-300" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-4 rounded-lg border border-red-100 bg-red-50 py-3 text-center text-sm font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default RiskAnalyzer;