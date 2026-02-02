import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  ArrowDownLeftIcon,
  ArrowLeftIcon,
  ArrowUpRightIcon,
  BriefcaseIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

type ActivityItem = {
  id?: string;
  type?: string;
  amount?: number | string;
  project?: string;
  title?: string;
  description?: string;
  date?: string;
  createdAt?: string;
  requestDate?: string;
  status?: string;
};

const Activities: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const downloadText = (filename: string, contents: string, mimeType: string) => {
    const blob = new Blob([contents], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const escapeCsv = (value: unknown) => {
    const str = value === undefined || value === null ? '' : String(value);
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setError('');
        setLoading(true);
        const data = await api.getRecentActivities();
        if (!isMounted) return;
        setActivities(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || 'Failed to load activities');
        setActivities([]);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const normalized = useMemo(() => {
    const items = activities.map((a) => {
      const dateValue = a.date || a.createdAt || a.requestDate;
      const date = dateValue && !Number.isNaN(new Date(dateValue).getTime()) ? new Date(dateValue) : null;
      const typeValue = String(a.type || '');
      const isInvestment = typeValue === 'investment' || typeValue === 'investment_received';
      const isWithdrawal = typeValue === 'withdrawal';
      const isDeposit = typeValue === 'deposit';

      const title = isDeposit ? 'Deposit' : isWithdrawal ? 'Withdrawal' : isInvestment ? 'Investment' : (typeValue ? typeValue.split('_').join(' ') : 'Activity');
      const detailBase = a.project || a.title || a.description || 'Wallet Transaction';
      const amount = Number(a.amount || 0);
      const hasAmount = Number.isFinite(amount) && amount !== 0;

      return { a, date, isDeposit, isWithdrawal, isInvestment, title, detailBase, amount, hasAmount };
    });

    items.sort((x, y) => {
      const xd = x.date ? x.date.getTime() : 0;
      const yd = y.date ? y.date.getTime() : 0;
      return yd - xd;
    });

    return items;
  }, [activities]);

  const downloadCsv = () => {
    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    const filename = `loopital_activities_${ts}.csv`;

    const header = ['Date', 'Type', 'Project', 'Amount', 'Status', 'Description'];
    const rows = normalized.map(({ a, date, title, amount, hasAmount }) => {
      const dateText = date ? date.toISOString() : (a.date || a.createdAt || a.requestDate || '');
      const project = a.project || '';
      const status = a.status || '';
      const description = a.description || a.title || '';
      const amountValue = hasAmount ? amount : '';
      return [dateText, title, project, amountValue, status, description].map(escapeCsv).join(',');
    });

    const csv = [header.map(escapeCsv).join(','), ...rows].join('\r\n');
    downloadText(filename, csv, 'text/csv;charset=utf-8');
  };

  const downloadPdf = () => {
    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const title = `Loopital Activities (${ts})`;

    const rowsHtml = normalized
      .map(({ a, date, title: typeTitle, amount, hasAmount }) => {
        const dateText = date ? date.toLocaleString() : String(a.date || a.createdAt || a.requestDate || '');
        const project = String(a.project || '');
        const status = String(a.status || '');
        const description = String(a.description || a.title || '');
        const amountText = hasAmount ? `${String(amount)}` : '';
        const cells = [dateText, typeTitle, project, amountText, status, description]
          .map((v) => `<td>${String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`)
          .join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      @page { size: A4; margin: 16mm; }
      body { font-family: Arial, Helvetica, sans-serif; color: #0f172a; }
      h1 { font-size: 16px; margin: 0 0 8px; }
      p.meta { font-size: 11px; color: #64748b; margin: 0 0 16px; }
      table { width: 100%; border-collapse: collapse; table-layout: fixed; }
      th, td { border: 1px solid #e2e8f0; padding: 8px; font-size: 10px; vertical-align: top; word-wrap: break-word; }
      th { background: #f8fafc; text-align: left; }
      tr:nth-child(even) td { background: #fcfcfd; }
    </style>
  </head>
  <body>
    <h1>${title}</h1>
    <p class="meta">Tip: In the print dialog choose “Save as PDF”.</p>
    <table>
      <thead>
        <tr>
          <th style="width: 16%;">Date</th>
          <th style="width: 12%;">Type</th>
          <th style="width: 16%;">Project</th>
          <th style="width: 10%;">Amount</th>
          <th style="width: 10%;">Status</th>
          <th style="width: 36%;">Description</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
    <script>
      window.onload = () => {
        setTimeout(() => window.print(), 100);
      };
    </script>
  </body>
</html>`;

    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-inter pb-20">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-slate-500 hover:text-[#00DC82] transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h1 className="text-sm font-bold text-[#0A192F]">Activities</h1>
            <p className="text-[11px] text-slate-500">All recent activity</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadCsv}
              disabled={loading || normalized.length === 0}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download CSV
            </button>
            <button
              onClick={downloadPdf}
              disabled={loading || normalized.length === 0}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#0A192F] text-white hover:bg-[#0A192F]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-14 text-center text-slate-500 text-sm">Loading activities...</div>
          ) : error ? (
            <div className="py-14 text-center">
              <p className="text-sm font-semibold text-slate-900">Couldn’t load activities</p>
              <p className="mt-1 text-xs text-slate-500">{error}</p>
            </div>
          ) : normalized.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-sm text-slate-400">No recent activity</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {normalized.map(({ a, date, isDeposit, isWithdrawal, isInvestment, title, detailBase, amount, hasAmount }, idx) => (
                <li key={a.id || String(idx)} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isDeposit
                          ? 'bg-emerald-100 text-emerald-600'
                          : isWithdrawal
                            ? 'bg-amber-100 text-amber-600'
                            : isInvestment
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isDeposit && <ArrowDownLeftIcon className="w-5 h-5" />}
                      {isWithdrawal && <ArrowUpRightIcon className="w-5 h-5" />}
                      {isInvestment && <BriefcaseIcon className="w-5 h-5" />}
                      {!isDeposit && !isWithdrawal && !isInvestment && <ClockIcon className="w-5 h-5" />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{title}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {detailBase}
                        {date ? ` • ${date.toLocaleDateString()}` : ''}
                        {a.status ? ` • ${String(a.status)}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm whitespace-nowrap ${isDeposit ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {hasAmount ? `${isWithdrawal ? '-' : '+'}₦${amount.toLocaleString()}` : '-'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Activities;
