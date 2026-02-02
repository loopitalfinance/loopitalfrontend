import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  BuildingOfficeIcon, 
  BanknotesIcon, 
  DocumentCheckIcon,
  PhotoIcon, 
  CheckCircleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  CloudArrowUpIcon,
  ArrowLeftIcon,
  ChartPieIcon,
  RocketLaunchIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { api } from '../services/api';
import { Project } from '../types';
import { useApp } from '../context/AppContext';

const steps = [
  { id: 1, name: 'Type', icon: RocketLaunchIcon, desc: 'Debt vs Equity' },
  { id: 2, name: 'Identity', icon: BuildingOfficeIcon, desc: 'Basic info' },
  { id: 3, name: 'Financials', icon: BanknotesIcon, desc: 'Funding goals' },
  { id: 4, name: 'Details', icon: ChartPieIcon, desc: 'Deep dive' },
  { id: 5, name: 'Legal', icon: DocumentCheckIcon, desc: 'Compliance' },
];

const SECTORS = [
  'Technology', 'Agriculture', 'Real Estate', 'Healthcare', 'Energy', 'Education', 'Finance', 'Logistics', 'Manufacturing'
];

export interface CreateProjectProps {
  onBack?: () => void;
  onSuccess?: (project?: Project) => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({ onBack, onSuccess }) => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    // Basics
    category: 'Project', // 'Project' (Debt) or 'Startup' (Equity)
    title: '',
    sector: '',
    description: '',
    location: '', 
    
    // Identity / KYC
    ownerName: '',
    phoneNumber: '',
    residentialAddress: '',
    businessName: '',
    cacNumber: '',
    directorDetails: '',

    // Financials
    targetAmount: '',
    minInvestment: '',
    riskLevel: 'Medium',
    
    // Debt Specific
    roi: '',
    durationMonths: '',
    repaymentSchedule: '',
    
    // Equity Specific
    valuation: '',
    equityPercentage: '',
    shareType: 'Common',
    
    // Deep Dive
    fullDetails: '', // Pitch
    useOfFunds: '',
    riskMitigationPlan: '',
    
    // Equity Deep Dive
    problemStatement: '',
    productDescription: '',
    targetMarket: '',
    businessModel: '',
    exitStrategy: '',
  });

  // File State
  const [files, setFiles] = useState<{
    image: File | null;
    cac: File | null;
    businessPlan: File | null;
    financials: File | null;
    proofOfCommitment: File | null;
    govtId: File | null;
    certIncorporation: File | null;
  }>({
    image: null,
    cac: null,
    businessPlan: null,
    financials: null,
    proofOfCommitment: null,
    govtId: null,
    certIncorporation: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name: keyof typeof files) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [name]: e.target.files![0] }));
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return true; 
      case 2: // Identity
        const basicIdentity = formData.title && formData.sector && formData.description && formData.location && files.image;
        if (formData.category === 'Project') {
           // Debt: Owner Name, Govt ID, Phone, Address
           return basicIdentity && formData.ownerName && formData.phoneNumber && formData.residentialAddress && files.govtId;
        } else {
           // Equity: Founder Name, Govt ID, Phone, Address, Company Name, CAC Number, Cert Incorporation
           return basicIdentity && formData.ownerName && formData.phoneNumber && formData.residentialAddress && formData.businessName && formData.cacNumber && files.govtId && files.certIncorporation;
        }
      case 3: // Financials
        const basicFinancials = formData.targetAmount && formData.minInvestment;
        if (formData.category === 'Project') {
          return basicFinancials && formData.roi && formData.durationMonths;
        } else {
          return basicFinancials && formData.valuation && formData.equityPercentage;
        }
      case 4: // Deep Dive
        if (formData.category === 'Project') {
          return formData.fullDetails && formData.repaymentSchedule;
        } else {
          return formData.problemStatement && formData.businessModel && formData.exitStrategy;
        }
      case 5: // Compliance
        return !!files.cac; 
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const submitData = new FormData();
      // Text Fields
      Object.entries(formData).forEach(([key, value]) => {
        let backendKey = key;
        
        // Map camelCase to snake_case for backend
        if (key === 'fullDetails') backendKey = 'full_details';
        if (key === 'targetAmount') backendKey = 'target_amount';
        if (key === 'minInvestment') backendKey = 'min_investment';
        if (key === 'durationMonths') backendKey = 'duration_months';
        if (key === 'riskLevel') backendKey = 'risk_level';
        if (key === 'repaymentSchedule') backendKey = 'repayment_schedule';
        if (key === 'equityPercentage') backendKey = 'equity_percentage';
        if (key === 'shareType') backendKey = 'share_type';
        if (key === 'exitStrategy') backendKey = 'exit_strategy';
        if (key === 'problemStatement') backendKey = 'problem_statement';
        if (key === 'productDescription') backendKey = 'product_description';
        if (key === 'targetMarket') backendKey = 'target_market';
        if (key === 'businessModel') backendKey = 'business_model';
        if (key === 'useOfFunds') backendKey = 'use_of_funds';
        if (key === 'riskMitigationPlan') backendKey = 'risk_mitigation_plan';
        
        // Map New Identity Fields
        if (key === 'ownerName') backendKey = 'full_legal_name';
        if (key === 'phoneNumber') backendKey = 'phone_number';
        if (key === 'residentialAddress') backendKey = 'residential_address';
        if (key === 'businessName') backendKey = 'company_name';
        if (key === 'cacNumber') backendKey = 'cac_registration_number';
        if (key === 'directorDetails') {
           backendKey = 'directors_details';
           if (value) submitData.append(backendKey, JSON.stringify({ description: value }));
           return; 
        }

        if (key === 'useOfFunds') {
           backendKey = 'use_of_funds';
           if (value) submitData.append(backendKey, JSON.stringify({ description: value }));
           return;
        }
        
        if (key === 'riskMitigationPlan') {
          backendKey = 'risk_mitigation_plan';
           if (value) submitData.append(backendKey, JSON.stringify({ description: value }));
           return;
        }

        submitData.append(backendKey, value);
      });

      // Files
      if (files.image) submitData.append('image', files.image);
      if (files.cac) submitData.append('cac_document', files.cac);
      if (files.businessPlan) submitData.append('business_plan', files.businessPlan);
      if (files.financials) submitData.append('financial_statements', files.financials);
      if (files.proofOfCommitment) submitData.append('proof_of_commitment', files.proofOfCommitment);
      if (files.govtId) submitData.append('govt_id', files.govtId);
      if (files.certIncorporation) submitData.append('cert_incorporation', files.certIncorporation);

      await api.createProject(submitData);
      
      toast.success('Project submitted successfully!');
      if (onSuccess) onSuccess();
      else navigate('/creator/dashboard'); // Redirect to new creator dashboard

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create project');
      toast.error(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
      window.scrollTo(0, 0);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Type
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setFormData(prev => ({ ...prev, category: 'Project' }))}
              className={`p-8 rounded-2xl border-2 transition-all text-left group ${
                formData.category === 'Project'
                  ? 'border-[#00DC82] bg-[#f0fdf4]'
                  : 'border-slate-200 hover:border-[#00DC82] hover:bg-[#f0fdf4]'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                formData.category === 'Project' ? 'bg-[#00DC82] text-white shadow-lg shadow-[#00DC82]/20' : 'bg-white border border-slate-200 text-slate-400'
              }`}>
                <BanknotesIcon className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${formData.category === 'Project' ? 'text-[#059669]' : 'text-slate-900'}`}>Debt Financing</h3>
              <p className="text-slate-500 text-sm">Raise funds by issuing debt. Repay investors with interest over a fixed period.</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-xs font-medium text-slate-600">
                   <CheckCircleIcon className="w-4 h-4 text-[#00DC82]" /> Fixed Repayments
                </li>
                <li className="flex items-center gap-2 text-xs font-medium text-slate-600">
                   <CheckCircleIcon className="w-4 h-4 text-[#00DC82]" /> Keep Ownership
                </li>
              </ul>
            </button>

            <button
              onClick={() => setFormData(prev => ({ ...prev, category: 'Startup' }))}
              className={`p-8 rounded-2xl border-2 transition-all text-left group ${
                formData.category === 'Startup'
                  ? 'border-[#15803d] bg-[#f0fdf4]'
                  : 'border-slate-200 hover:border-[#15803d] hover:bg-[#f0fdf4]'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                formData.category === 'Startup' ? 'bg-[#00DC82] text-white shadow-lg shadow-[#00DC82]/20' : 'bg-white border border-slate-200 text-slate-400'
              }`}>
                <RocketLaunchIcon className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${formData.category === 'Startup' ? 'text-[#059669]' : 'text-slate-900'}`}>Equity Funding</h3>
              <p className="text-slate-500 text-sm">Raise capital by selling shares. Investors become part-owners of your company.</p>
               <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-xs font-medium text-slate-600">
                   <CheckCircleIcon className="w-4 h-4 text-[#00DC82]" /> No Monthly Repayments
                </li>
                <li className="flex items-center gap-2 text-xs font-medium text-slate-600">
                   <CheckCircleIcon className="w-4 h-4 text-[#00DC82]" /> Strategic Partners
                </li>
              </ul>
            </button>
          </div>
        );

      case 2: // Identity
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="md:col-span-2">
                 <label className="block text-sm font-bold text-slate-900 mb-2">Project Title</label>
                 <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-colors"
                    placeholder="e.g. Green Energy Expansion"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-bold text-slate-900 mb-2">Sector</label>
                 <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-colors"
                 >
                    <option value="">Select Sector</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
               </div>

               <div>
                 <label className="block text-sm font-bold text-slate-900 mb-2">Location</label>
                 <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-colors"
                    placeholder="City, Country"
                 />
               </div>

               <div className="md:col-span-2">
                 <label className="block text-sm font-bold text-slate-900 mb-2">Short Description</label>
                 <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/20 focus:border-[#00DC82] transition-colors"
                    placeholder="Brief overview of your project..."
                 />
               </div>

               {/* Dynamic Identity Fields */}
               <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-2">
                  <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                     <ShieldCheckIcon className="w-5 h-5 text-[#00DC82]" /> 
                     {formData.category === 'Project' ? 'Personal Verification' : 'Company Verification'}
                  </h4>
               </div>

               <div>
                 <label className="block text-sm font-bold text-slate-900 mb-2">
                    {formData.category === 'Project' ? 'Full Legal Name' : 'Authorized Rep Name'}
                 </label>
                 <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/20 focus:border-[#00DC82] transition-colors"
                 />
               </div>

               <div>
                 <label className="block text-sm font-bold text-slate-900 mb-2">Phone Number</label>
                 <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/20 focus:border-[#00DC82] transition-colors"
                 />
               </div>

               <div className="md:col-span-2">
                 <label className="block text-sm font-bold text-slate-900 mb-2">Residential Address</label>
                 <input
                    type="text"
                    name="residentialAddress"
                    value={formData.residentialAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/20 focus:border-[#00DC82] transition-colors"
                 />
               </div>

               {formData.category === 'Startup' && (
                  <>
                     <div>
                       <label className="block text-sm font-bold text-slate-900 mb-2">Company Name</label>
                       <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-colors"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-slate-900 mb-2">CAC Registration Number</label>
                       <input
                          type="text"
                          name="cacNumber"
                          value={formData.cacNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-colors"
                       />
                     </div>
                  </>
               )}

               {/* File Uploads for Identity */}
               <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-900 mb-2">Cover Image</label>
                  <input type="file" onChange={handleFileChange('image')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f0fdf4] file:text-[#00DC82] hover:file:bg-[#dcfce7]"/>
               </div>
               
               <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Government ID</label>
                  <input type="file" onChange={handleFileChange('govtId')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f0fdf4] file:text-[#00DC82] hover:file:bg-[#dcfce7]"/>
               </div>

               {formData.category === 'Startup' && (
                   <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Certificate of Incorporation</label>
                      <input type="file" onChange={handleFileChange('certIncorporation')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f0fdf4] file:text-[#15803d] hover:file:bg-[#dcfce7]"/>
                   </div>
               )}
            </div>
          </div>
        );

      case 3: // Financials
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="block text-sm font-bold text-slate-900 mb-2">Target Amount (NGN)</label>
               <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/20 focus:border-[#00DC82] transition-colors"
               />
             </div>
             <div>
               <label className="block text-sm font-bold text-slate-900 mb-2">Minimum Investment (NGN)</label>
               <input
                  type="number"
                  name="minInvestment"
                  value={formData.minInvestment}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/20 focus:border-[#00DC82] transition-colors"
               />
             </div>

             {formData.category === 'Project' ? (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">ROI (%)</label>
                    <input
                        type="number"
                        name="roi"
                        value={formData.roi}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Duration (Months)</label>
                    <input
                        type="number"
                        name="durationMonths"
                        value={formData.durationMonths}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/20 focus:border-[#00DC82] transition-colors"
                    />
                  </div>
                </>
             ) : (
                <>
                   <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Company Valuation (NGN)</label>
                    <input
                        type="number"
                        name="valuation"
                        value={formData.valuation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/20 focus:border-[#00DC82] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Equity Offered (%)</label>
                    <input
                        type="number"
                        name="equityPercentage"
                        value={formData.equityPercentage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/20 focus:border-[#00DC82] transition-colors"
                    />
                  </div>
                </>
             )}
          </div>
        );

      case 4: // Details
        return (
          <div className="space-y-6">
             {formData.category === 'Project' ? (
                <>
                   <div>
                     <label className="block text-sm font-bold text-slate-900 mb-2">Full Project Details</label>
                     <textarea
                        name="fullDetails"
                        value={formData.fullDetails}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/20 focus:border-[#00DC82] transition-colors"
                        placeholder="Explain the project in detail..."
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-900 mb-2">Repayment Schedule Plan</label>
                     <textarea
                        name="repaymentSchedule"
                        value={formData.repaymentSchedule}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/20 focus:border-[#00DC82] transition-colors"
                        placeholder="How will you repay investors?"
                     />
                   </div>
                </>
             ) : (
                <>
                   <div>
                     <label className="block text-sm font-bold text-slate-900 mb-2">Problem Statement</label>
                     <textarea
                        name="problemStatement"
                        value={formData.problemStatement}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/20 focus:border-[#00DC82] transition-colors"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-900 mb-2">Business Model</label>
                     <textarea
                        name="businessModel"
                        value={formData.businessModel}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/20 focus:border-[#00DC82] transition-colors"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-900 mb-2">Exit Strategy</label>
                     <textarea
                        name="exitStrategy"
                        value={formData.exitStrategy}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/20 focus:border-[#00DC82] transition-colors"
                     />
                   </div>
                </>
             )}
          </div>
        );

      case 5: // Legal
        return (
          <div className="space-y-6">
             <div className="bg-[#f0fdf4] p-4 rounded-xl flex gap-3 text-[#15803d] text-sm mb-6">
                <DocumentCheckIcon className="w-5 h-5 flex-shrink-0" />
                <p>Please upload all required legal documents. Our compliance team will review these before your project goes live.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">CAC Document (Required)</label>
                  <input type="file" onChange={handleFileChange('cac')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f0fdf4] file:text-[#00DC82] hover:file:bg-[#dcfce7]"/>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Business Plan</label>
                  <input type="file" onChange={handleFileChange('businessPlan')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f0fdf4] file:text-[#00DC82] hover:file:bg-[#dcfce7]"/>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Financial Statements</label>
                  <input type="file" onChange={handleFileChange('financials')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f0fdf4] file:text-[#15803d] hover:file:bg-[#dcfce7]"/>
                </div>
             </div>
          </div>
        );
      
      default: return null;
    }
  };

  if (user?.role !== 'ProjectOwner') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-inter pb-20">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBack || (() => navigate(-1))}
            className="p-2 -ml-2 text-slate-500 hover:text-[#00DC82] transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h1 className="text-sm font-bold text-[#0A192F]">Create Project</h1>
            <p className="text-[11px] text-slate-500">Step {currentStep} of {steps.length}</p>
          </div>
          <div className="w-9"></div>
        </div>

        <div className="max-w-3xl mx-auto px-4 pb-4">
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-[#00DC82] rounded-full transition-all"
              style={{ width: `${Math.round((currentStep / steps.length) * 100)}%` }}
            />
          </div>

          <div className="mt-3 grid grid-cols-5 gap-2">
            {steps.map((step) => {
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    if (step.id <= currentStep) setCurrentStep(step.id);
                  }}
                  className={`rounded-xl border px-2 py-2 text-center transition-all ${
                    isActive
                      ? 'bg-[#0A192F] border-[#0A192F]'
                      : isCompleted
                        ? 'bg-white border-slate-200 hover:bg-slate-50'
                        : 'bg-white border-slate-100 cursor-default'
                  }`}
                >
                  <div
                    className={`mx-auto h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : isCompleted
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-50 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircleIcon className="h-4 w-4 text-emerald-600" /> : step.id}
                  </div>
                  <div className={`mt-1 text-[10px] font-bold truncate ${isActive ? 'text-white' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                    {step.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 animate-fade-in">
          <div className="mb-6">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {steps[currentStep - 1].name}
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-display font-bold text-[#0A192F] tracking-tight">
              {steps[currentStep - 1].desc}
            </h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          {renderStepContent()}

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                currentStep === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:text-[#0A192F] hover:bg-slate-50'
              }`}
            >
              Back
            </button>

            {currentStep === steps.length ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 bg-[#00DC82] text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-[#059669] transition-all disabled:opacity-70 flex items-center gap-2"
              >
                {loading ? <CloudArrowUpIcon className="w-5 h-5 animate-bounce" /> : <>Submit Project <CheckCircleIcon className="w-5 h-5" /></>}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-6 py-2.5 bg-[#0A192F] text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                Next Step <ChevronRightIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
