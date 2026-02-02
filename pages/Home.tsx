
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  ArrowRightIcon, 
  ChevronDownIcon, 
  ChevronUpIcon, 
  BoltIcon, 
  UserGroupIcon, 
  BanknotesIcon, 
  BuildingOfficeIcon, 
  CheckCircleIcon,
  GlobeAltIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

interface Props {
  onGetStarted: (role?: 'Investor' | 'ProjectOwner') => void;
}

// -- Components --

const LiveTicker = () => {
  const activities = [
    "🚀 Emmanuel O. just invested ₦500k in AgriTech Syndicate",
    "🌱 GreenHorizon Farm just paid out ₦12M in dividends",
    "👤 Sarah J. joined the Real Estate Community",
    "⚡ SolarGrid Project is 85% funded",
    "🛡️ NeoLogistics Fleet verified by Admin",
  ];

  return (
    <div className="bg-white border-y border-slate-100 overflow-hidden py-3 relative z-20">
       <style>{`
         @keyframes scroll {
           0% { transform: translateX(0); }
           100% { transform: translateX(-50%); }
         }
         .animate-scroll {
           display: flex;
           animation: scroll 40s linear infinite;
           width: max-content;
         }
       `}</style>
       <div className="animate-scroll">
          <div className="flex gap-12 px-6">
             {[...activities, ...activities, ...activities].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-500 whitespace-nowrap">
                   <span className="w-1.5 h-1.5 rounded-full bg-[#00DC82]"></span>
                   {item}
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 text-left group"
      >
        <span className={`font-bold transition-colors ${isOpen ? 'text-[#00DC82]' : 'text-[#0A192F] group-hover:text-slate-600'}`}>
          {question}
        </span>
        {isOpen ? <ChevronUpIcon className="w-4 h-4 text-[#00DC82]" /> : <ChevronDownIcon className="w-4 h-4 text-slate-400" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100 pb-5' : 'max-h-0 opacity-0'}`}>
        <p className="text-slate-500 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const Home: React.FC<Props> = ({ onGetStarted }) => {
  const navigate = useNavigate();
  const [activeWorkflow, setActiveWorkflow] = useState<'investor' | 'business'>('investor');

  return (
    <div className="bg-slate-50 font-inter overflow-x-hidden">
      <Navbar
        user={null}
        currentView="home"
        onChangeView={(view) => {
          if (view === 'home') navigate('/');
          if (view === 'auth') navigate('/auth/login');
        }}
      />
      
      {/* --- MODERN FINTECH HERO SECTION --- */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 overflow-hidden bg-white">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-[50%] h-[80%] bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-[100px] pointer-events-none opacity-50"></div>

         <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 mb-20">
            {/* Text Content */}
            <div className="lg:pr-10 animate-fade-in-up">
                
                <h1 className="text-5xl lg:text-7xl font-bold text-[#0A192F] leading-[1.05] mb-6 tracking-tight">
                   Invest in the <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00DC82] to-teal-600">Real Economy.</span>
                </h1>

                <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-lg">
                   Loopital is the modern standard for alternative investments. Access vetting-backed deals in agriculture, real estate, and tech with one account.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                   <button 
                     onClick={() => onGetStarted('Investor')}
                     className="px-8 py-4 bg-[#0A192F] text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
                   >
                      Start Investing
                   </button>
                   <button 
                     onClick={() => {
                        const el = document.getElementById('how-it-works');
                        el?.scrollIntoView({ behavior: 'smooth' });
                     }}
                     className="px-8 py-4 bg-white text-[#0A192F] border border-slate-200 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                   >
                      How it works <ChevronDownIcon className="w-4 h-4"/>
                   </button>
                </div>

                <div className="mt-12 flex items-center gap-8">
                   <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                         <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                           <img src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} alt="" />
                         </div>
                      ))}
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-[#0A192F] text-white flex items-center justify-center text-xs font-bold">2k+</div>
                   </div>
                   <div>
                      <div className="flex items-center gap-1">
                         {[1,2,3,4,5].map(i => <StarIcon key={i} className="w-4 h-4 text-amber-400" />)}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1">Trusted by 15,000+ investors</p>
                   </div>
                </div>
            </div>

            {/* Right Visual: Smartphone Mockup */}
            <div className="relative hidden lg:flex justify-center perspective-[1500px]">
                {/* Phone Frame */}
                <div className="relative border-slate-900 bg-slate-900 border-[12px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-0 transition-all duration-700 select-none">
                    {/* Buttons/Notch details */}
                    <div className="w-[120px] h-[18px] bg-slate-900 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20"></div>
                    <div className="h-[46px] w-[3px] bg-slate-800 absolute -left-[15px] top-[124px] rounded-l-lg"></div>
                    <div className="h-[64px] w-[3px] bg-slate-800 absolute -right-[15px] top-[142px] rounded-r-lg"></div>
                    
                    {/* Screen Content */}
                    <div className="rounded-[2rem] overflow-hidden w-full h-full bg-[#f8fafc] relative flex flex-col">
                        
                        {/* Status Bar Fake */}
                        <div className="h-6 w-full bg-[#0A192F] flex justify-between items-center px-6 pt-1">
                           <span className="text-[10px] text-white font-bold">9:41</span>
                           <div className="flex gap-1">
                              <div className="w-3 h-3 bg-white rounded-sm"></div>
                              <div className="w-3 h-3 bg-white rounded-sm"></div>
                           </div>
                        </div>

                        {/* App Header (Dash) */}
                        <div className="bg-[#0A192F] text-white p-6 pt-8 pb-10 rounded-b-3xl relative z-10 shadow-lg">
                           <div className="flex justify-between items-center mb-6">
                              <div className="flex items-center gap-2">
                                 <div className="w-8 h-8 bg-slate-700/50 rounded-full border border-white/10"></div>
                                 <div className="w-20 h-2.5 bg-slate-700/50 rounded-full"></div>
                              </div>
                              <div className="w-8 h-8 bg-slate-700/50 rounded-full border border-white/10 flex items-center justify-center">
                                 <div className="w-3 h-3 text-[#00DC82]">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path></svg>
                                 </div>
                              </div>
                           </div>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Balance</p>
                           <h3 className="text-3xl font-bold tracking-tight">₦15.4M</h3>
                           <div className="mt-6 flex gap-3">
                              <div className="flex-1 h-9 bg-[#00DC82] rounded-xl flex items-center justify-center text-[10px] font-bold text-[#0A192F]">Top Up</div>
                              <div className="flex-1 h-9 bg-white/10 rounded-xl flex items-center justify-center text-[10px] font-bold">Withdraw</div>
                           </div>
                        </div>

                        {/* App Body */}
                        <div className="flex-1 p-4 space-y-4 overflow-hidden relative">
                           {/* Chart Card */}
                           <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                              <div className="flex justify-between mb-4">
                                 <div className="w-24 h-2.5 bg-slate-100 rounded-full"></div>
                                 <div className="w-8 h-2.5 bg-green-100 rounded-full"></div>
                              </div>
                              <div className="flex items-end gap-1.5 h-16">
                                 {[40, 60, 45, 80, 55, 95, 75].map((h, i) => (
                                    <div key={i} className={`flex-1 rounded-t-sm ${i===5 ? 'bg-[#00DC82]' : 'bg-slate-100'}`} style={{height: `${h}%`}}></div>
                                 ))}
                              </div>
                           </div>

                           {/* List */}
                           <div className="space-y-3">
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Your Portfolio</div>
                              {[1, 2].map(i => (
                                 <div key={i} className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm">
                                    <div className={`w-10 h-10 rounded-xl ${i===1 ? 'bg-green-100' : 'bg-blue-100'}`}></div>
                                    <div className="flex-1">
                                       <div className="w-24 h-2.5 bg-slate-100 rounded-full mb-1.5"></div>
                                       <div className="w-12 h-2 bg-slate-50 rounded-full"></div>
                                    </div>
                                    <div className="w-14 h-3 bg-slate-100 rounded-full"></div>
                                 </div>
                              ))}
                           </div>
                           
                           {/* Fade out bottom */}
                           <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#f8fafc] to-transparent pointer-events-none"></div>
                        </div>

                        {/* Fake Bottom Nav */}
                        <div className="h-16 bg-white border-t border-slate-100 px-6 flex justify-between items-center z-20">
                           <div className="w-5 h-5 bg-[#0A192F] rounded-full"></div>
                           <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
                           <div className="w-10 h-10 bg-[#00DC82] rounded-full -mt-6 border-4 border-[#f8fafc] shadow-lg"></div>
                           <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
                           <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
         
         {/* PARTNERS SECTION */}
         <div className="mt-16 pt-12 border-t border-slate-100 max-w-7xl mx-auto px-6">
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">Strategic Partners & Payment Processors</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Paystack */}
               <div className="flex items-center gap-1 group cursor-pointer">
                  <div className="h-6 w-6 rounded bg-[#0A192F] flex items-center justify-center">
                     <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-xl font-bold text-[#0A192F] tracking-tight ml-1 group-hover:text-[#00C3AA] transition-colors">paystack</span>
               </div>
               
               {/* Korapay */}
               <div className="flex items-center gap-1 group cursor-pointer">
                  <span className="text-xl font-bold text-[#0A192F] tracking-tight group-hover:text-[#5600E3] transition-colors"><span className="text-[#00DC82]">kora</span>pay</span>
               </div>
               
               {/* Symbolpay */}
               <div className="flex items-center gap-2 group cursor-pointer">
                   <div className="w-6 h-6 border-2 border-[#0A192F] rounded-full flex items-center justify-center group-hover:border-blue-600 transition-colors">
                      <div className="w-2 h-2 bg-[#0A192F] rounded-full group-hover:bg-blue-600 transition-colors"></div>
                   </div>
                   <span className="text-xl font-bold text-[#0A192F] tracking-tight group-hover:text-blue-600 transition-colors">symbolpay</span>
               </div>
            </div>
         </div>
      </section>

      <LiveTicker />

      {/* --- MARKETPLACE PREVIEW --- */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
               <h2 className="text-3xl font-bold text-[#0A192F] mb-3">Curated Opportunities</h2>
               <p className="text-slate-500 max-w-xl text-lg">
                  We verify 100+ data points before listing any project. Invest with confidence.
               </p>
            </div>
            <button 
              onClick={() => onGetStarted('Investor')}
              className="flex items-center gap-2 text-[#00DC82] font-bold hover:gap-3 transition-all px-6 py-3 bg-white border border-slate-100 rounded-lg shadow-sm hover:shadow-md"
            >
               View All Projects <ArrowRightIcon className="w-4 h-4" />
            </button>
         </div>

         <div className="grid md:grid-cols-3 gap-8">
            {[
               { title: "GreenHorizon Vertical Farm", sector: "Agriculture", roi: 18, risk: "Low", raised: 64, img: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=800" },
               { title: "NeoLogistics EV Fleet", sector: "Logistics", roi: 24, risk: "Medium", raised: 85, img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800" },
               { title: "SolarGrid Micro-Utility", sector: "Energy", roi: 21, risk: "Low", raised: 42, img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800" }
            ].map((p, i) => (
               <div key={i} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="h-48 relative">
                     <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold text-[#0A192F] uppercase">
                           {p.sector}
                        </span>
                     </div>
                     <div className="absolute bottom-4 right-4 bg-[#0A192F] text-[#00DC82] px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <BoltIcon className="w-3 h-3" /> AI Risk: {p.risk}
                     </div>
                  </div>
                  <div className="p-6">
                     <h3 className="font-bold text-[#0A192F] text-lg mb-4 line-clamp-1">{p.title}</h3>
                     
                     <div className="flex justify-between items-center mb-6 text-sm">
                        <div>
                           <p className="text-slate-400 text-xs uppercase font-bold">Target ROI</p>
                           <p className="font-bold text-[#0A192F]">{p.roi}%</p>
                        </div>
                        <div className="text-right">
                           <p className="text-slate-400 text-xs uppercase font-bold">Raised</p>
                           <p className="font-bold text-[#0A192F]">{p.raised}%</p>
                        </div>
                     </div>
                     
                     <div className="w-full bg-slate-100 rounded-full h-1.5 mb-6">
                        <div className="bg-[#00DC82] h-1.5 rounded-full" style={{ width: `${p.raised}%` }}></div>
                     </div>

                     <button onClick={() => onGetStarted('Investor')} className="w-full py-3 border border-slate-200 text-[#0A192F] font-bold rounded-xl hover:bg-[#0A192F] hover:text-white transition-colors text-sm">
                        View Details
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* --- HOW IT WORKS (Tabs) --- */}
      <div id="how-it-works" className="bg-white py-24 border-t border-slate-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-[#0A192F] mb-4">How Loopital Works</h2>
               <div className="flex justify-center">
                  <div className="bg-slate-50 p-1 rounded-xl shadow-inner inline-flex">
                     <button 
                       onClick={() => setActiveWorkflow('investor')}
                       className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeWorkflow === 'investor' ? 'bg-white text-[#0A192F] shadow-sm' : 'text-slate-500 hover:text-[#0A192F]'}`}
                     >
                        For Investors
                     </button>
                     <button 
                       onClick={() => setActiveWorkflow('business')}
                       className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeWorkflow === 'business' ? 'bg-white text-[#0A192F] shadow-sm' : 'text-slate-500 hover:text-[#0A192F]'}`}
                     >
                        For Business
                     </button>
                  </div>
               </div>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
               {activeWorkflow === 'investor' ? (
                  <>
                     {[
                        { icon: UserGroupIcon, title: "1. Create Account", desc: "Sign up and complete KYC verification in 2 minutes." },
                        { icon: GlobeAltIcon, title: "2. Browse Deals", desc: "Filter vetted projects by sector, risk, and ROI." },
                        { icon: BanknotesIcon, title: "3. Invest Securely", desc: "Fund your wallet and back projects via Escrow." },
                        { icon: CheckCircleIcon, title: "4. Earn & Track", desc: "Receive dividends and track portfolio growth in real-time." },
                     ].map((step, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center relative group hover:border-[#00DC82]/30 transition-colors">
                           <div className="w-16 h-16 bg-[#00DC82]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#00DC82] transition-colors duration-300">
                              <step.icon className="w-8 h-8 text-[#00DC82] group-hover:text-[#0A192F] transition-colors" />
                           </div>
                           <h3 className="font-bold text-[#0A192F] mb-3">{step.title}</h3>
                           <p className="text-sm text-slate-500">{step.desc}</p>
                           {i < 3 && <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-slate-200"></div>}
                        </div>
                     ))}
                  </>
               ) : (
                  <>
                     {[
                        { icon: BuildingOfficeIcon, title: "1. Submit Proposal", desc: "Detail your project, financials, and funding goals." },
                        { icon: BoltIcon, title: "2. AI & Admin Vetting", desc: "Our system analyzes risk and admins verify assets." },
                        { icon: GlobeAltIcon, title: "3. Go Live", desc: "Your project is listed on the marketplace for investors." },
                        { icon: BanknotesIcon, title: "4. Receive Capital", desc: "Funds are released in tranches as you hit milestones." },
                     ].map((step, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center relative group hover:border-indigo-200 transition-colors">
                           <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                              <step.icon className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
                           </div>
                           <h3 className="font-bold text-[#0A192F] mb-3">{step.title}</h3>
                           <p className="text-sm text-slate-500">{step.desc}</p>
                           {i < 3 && <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-slate-200"></div>}
                        </div>
                     ))}
                  </>
               )}
            </div>
         </div>
      </div>

      {/* --- FAQ SECTION --- */}
      <div className="bg-slate-50 py-24">
         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-[#0A192F] mb-4">Frequently Asked Questions</h2>
               <p className="text-slate-500">Everything you need to know about investing on Loopital.</p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-2">
               <FaqItem 
                  question="How is my investment secured?" 
                  answer="We use a licensed third-party escrow service. Funds are only released to project owners when specific, verified milestones are met. Additionally, all assets are legally backed with collateral where applicable." 
               />
               <FaqItem 
                  question="What is the minimum amount I can invest?" 
                  answer="You can start investing with as little as ₦50,000. However, by joining a Community Pool, you can contribute smaller amounts to collectively back larger projects." 
               />
               <FaqItem 
                  question="Can I withdraw my funds before the project maturity?" 
                  answer="Yes, through our Secondary Marketplace. You can list your stake for sale to other investors on the platform, providing liquidity when you need it." 
               />
               <FaqItem 
                  question="How does the AI Risk Score work?" 
                  answer="We use Google's Gemini AI to analyze thousands of data points including financial history, market trends, and sector risks to generate an unbiased risk score from 1-10 for every project." 
               />
            </div>
         </div>
      </div>

      {/* --- CTA --- */}
      <div className="bg-white py-24">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-block p-4 rounded-full bg-slate-50 mb-6">
               <SparklesIcon className="w-8 h-8 text-[#00DC82]" />
            </div>
            <h2 className="text-4xl font-bold text-[#0A192F] mb-6">Ready to build wealth?</h2>
            <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto">
               Join thousands of smart investors building a diversified portfolio of high-yield real-world assets today.
            </p>
            <button 
               onClick={() => onGetStarted('Investor')}
               className="px-10 py-4 bg-[#0A192F] text-white font-bold rounded-full text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 hover:-translate-y-1"
            >
               Create Free Account
            </button>
            <p className="text-xs text-slate-400 mt-6">No credit card required for sign up.</p>
         </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0A192F] text-slate-300 pt-20 pb-10 border-t border-white/5">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-12 mb-16">
               <div className="col-span-1 md:col-span-1">
                  <div className="flex items-center gap-1 mb-6">
                     <span className="text-2xl font-bold text-white tracking-tight">loopital</span>
                     <span className="w-2 h-2 rounded-full bg-[#00DC82] mt-2"></span>
                  </div>
                  <p className="text-sm leading-relaxed mb-6">
                     The future of alternative investment in Africa. Secure, transparent, and powered by technology.
                  </p>
               </div>
               
               <div>
                  <h4 className="font-bold text-white mb-6">Platform</h4>
                  <ul className="space-y-4 text-sm">
                     <li className="hover:text-[#00DC82] cursor-pointer transition-colors">Marketplace</li>
                     <li className="hover:text-[#00DC82] cursor-pointer transition-colors">Communities</li>
                     <li className="hover:text-[#00DC82] cursor-pointer transition-colors">AI Risk Analysis</li>
                     <li className="hover:text-[#00DC82] cursor-pointer transition-colors">Pricing</li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-white mb-6">Company</h4>
                  <ul className="space-y-4 text-sm">
                     <li className="hover:text-[#00DC82] cursor-pointer transition-colors">About Us</li>
                     <li className="hover:text-[#00DC82] cursor-pointer transition-colors">Careers</li>
                     <li className="hover:text-[#00DC82] cursor-pointer transition-colors">Blog</li>
                     <li className="hover:text-[#00DC82] cursor-pointer transition-colors">Contact</li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-white mb-6">Stay Updated</h4>
                  <p className="text-sm mb-4">Get the latest investment opportunities in your inbox.</p>
                  <div className="flex gap-2">
                     <input type="email" placeholder="Email address" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00DC82] w-full" />
                     <button className="bg-[#00DC82] text-[#0A192F] px-4 py-2 rounded-lg font-bold hover:bg-[#00c474] transition-colors">
                        Go
                     </button>
                  </div>
               </div>
            </div>
            
            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
               <p>&copy; 2024 Loopital Inc. All rights reserved.</p>
               <div className="flex gap-6">
                  <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                  <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Home;
