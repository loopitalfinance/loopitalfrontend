import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import axios from 'axios';

interface InvestmentFormProps {
  project: Project;
  onSuccess: () => void;
  onCancel: () => void;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({ project, onSuccess, onCancel }) => {
  const [amount, setAmount] = useState<number>(project.minInvestment);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch Wallet Balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/wallet/balance/', {
          headers: { Authorization: `Token ${token}` }
        });
        setWalletBalance(Number(response.data.balance));
      } catch (err) {
        console.error("Failed to fetch balance", err);
      }
    };
    fetchBalance();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Client-side validation
    if (walletBalance !== null && amount > walletBalance) {
      setError("Insufficient funds. Please deposit more.");
      setLoading(false);
      return;
    }
    
    if (amount < project.minInvestment) {
      setError(`Minimum investment is ₦${project.minInvestment.toLocaleString()}`);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // Using the new dedicated endpoint
      await axios.post(`http://127.0.0.1:8000/api/projects/${project.id}/invest/`, {
        amount: amount
      }, {
        headers: { Authorization: `Token ${token}` }
      });

      setSuccess("Investment successful! Funds are held in escrow.");
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.detail || "Investment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold mb-4 text-slate-900">Invest in {project.title}</h2>
      
      {walletBalance !== null && (
        <div className="mb-4 p-3 bg-slate-50 rounded-md flex justify-between items-center">
          <span className="text-slate-600 text-sm">Wallet Balance:</span>
          <span className="font-bold text-slate-900">₦{walletBalance.toLocaleString()}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Investment Amount (₦)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min={project.minInvestment}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#64ffda] focus:outline-none"
            required
          />
          <p className="text-xs text-slate-500 mt-1">
            Min: ₦{project.minInvestment.toLocaleString()}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200">
            {success}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-[#64ffda] text-[#0A192F] font-bold rounded hover:bg-[#4cdbb9] transition-colors disabled:opacity-50 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-[#0A192F] border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'Confirm Investment'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvestmentForm;
