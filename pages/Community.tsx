
import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon, 
  PlusIcon, 
  HandThumbUpIcon,
  ArrowRightIcon,
  BanknotesIcon,
  MegaphoneIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ClockIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  XMarkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { Sector, CommunityGroup, Discussion, Poll, PollOption } from '../types';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import Spinner from '../components/Spinner';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sector, setSector] = useState<Sector>(Sector.RealEstate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, sector });
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold leading-6 text-gray-900 flex justify-between items-center"
                >
                  Create New Community
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Group Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
                      placeholder="e.g. Lagos Real Estate Investors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Sector</label>
                    <select
                      value={sector}
                      onChange={(e) => setSector(e.target.value as Sector)}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
                    >
                      {Object.values(Sector).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
                      placeholder="What is this group about?"
                    />
                  </div>
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full rounded-xl border border-transparent bg-[#0A192F] px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                      Create Community
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

interface DiscussionItemProps {
  disc: Discussion;
  onLike: (id: number) => void;
  onReply: (id: number, content: string) => Promise<void>;
}

const DiscussionItem: React.FC<DiscussionItemProps> = ({ disc, onLike, onReply }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const authorName =
    disc.author?.name ||
    [disc.author?.firstName, disc.author?.lastName].filter(Boolean).join(' ') ||
    disc.author?.username ||
    'User';

  const handleSend = async () => {
    if (!replyText.trim() || isSending) return;
    setIsSending(true);
    try {
      await onReply(disc.id, replyText);
      setReplyText('');
    } catch (error) {
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
       <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-800 flex items-center justify-center font-bold text-sm border border-white shadow-sm flex-shrink-0">
             {(authorName || 'U').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
             <div className="flex justify-between items-start mb-2">
                <div>
                   <h4 className="font-bold text-[#0A192F] text-sm">{authorName}</h4>
                   <span className="text-xs text-slate-400">Investor • {new Date(disc.createdAt).toLocaleDateString()}</span>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                   <span className="sr-only">Options</span>
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                </button>
             </div>
             <p className="text-slate-600 text-sm mb-4 leading-relaxed">{disc.content}</p>
             <div className="flex gap-4 border-t border-slate-50 pt-4">
                <button 
                  onClick={() => onLike(disc.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    disc.isLiked ? 'bg-green-50 text-[#00DC82]' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                   <HandThumbUpIcon className={`w-4 h-4 ${disc.isLiked ? 'fill-current' : ''}`} /> 
                   {disc.likesCount} Likes
                </button>
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    isExpanded 
                    ? 'bg-slate-100 text-[#0A192F]' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                   <ChatBubbleLeftRightIcon className="w-4 h-4" /> {disc.repliesCount} Replies
                </button>
             </div>
             
             {isExpanded && (
               <div className="mt-4 pt-4 border-t border-slate-50 animate-fade-in">
                  <div className="space-y-4 mb-4 pl-4 border-l-2 border-slate-100">
                     {disc.comments && disc.comments.length > 0 ? (
                        disc.comments.map((comment: any) => (
                           <div key={comment.id} className="group">
                              <div className="flex justify-between items-baseline mb-1">
                                 <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-[#0A192F]">{comment.author?.name || 'User'}</span>
                                    <span className="text-[10px] text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                 </div>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none text-sm text-slate-600 inline-block max-w-full">
                                 {comment.content}
                              </div>
                           </div>
                        ))
                     ) : (
                        <p className="text-xs text-slate-400 italic py-2">No replies yet. Start the conversation!</p>
                     )}
                  </div>
                  
                  <div className="flex gap-2 items-end">
                     <div className="w-8 h-8 rounded-full bg-[#0A192F] flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0">
                        ME
                     </div>
                     <div className="flex-1 relative">
                        <textarea 
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A192F] transition-all resize-none h-[46px] pr-12 overflow-hidden"
                          onKeyDown={(e) => {
                             if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                             }
                          }}
                        />
                        <button 
                          onClick={handleSend}
                          disabled={!replyText.trim() || isSending}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#0A192F] text-white rounded-full hover:bg-slate-800 disabled:opacity-50 disabled:bg-slate-300 transition-colors"
                        >
                           <PaperAirplaneIcon className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
               </div>
             )}
          </div>
       </div>
    </div>
  );
};

const Community: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<CommunityGroup | null>(null);
  const [activeTab, setActiveTab] = useState<'discussions' | 'pooling' | 'voting' | 'portfolio'>('discussions');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingDiscussions, setLoadingDiscussions] = useState(false);
  
  const [newDiscussion, setNewDiscussion] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [isContributing, setIsContributing] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === 'discussions') {
      loadDiscussions();
    }
  }, [selectedGroup, activeTab]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [groupsData, pollsData] = await Promise.all([
        api.getGroups(),
        api.getPolls()
      ]);
      setGroups(groupsData);
      setPolls(pollsData);
    } catch (error) {
      console.error('Failed to load community data', error);
      toast.error('Failed to load community data');
    } finally {
      setLoading(false);
    }
  };

  const loadDiscussions = async () => {
    try {
      setLoadingDiscussions(true);
      const data = await api.getDiscussions(selectedGroup ? { groupId: selectedGroup.id } : undefined);
      setDiscussions(data);
    } catch (error) {
      console.error('Failed to load discussions', error);
    } finally {
      setLoadingDiscussions(false);
    }
  };

  const handleJoinGroup = async (e: React.MouseEvent, group: CommunityGroup) => {
    e.stopPropagation();
    try {
      const response = await api.joinGroup(group.id);
      
      setGroups(prev => prev.map(g => 
        g.id === group.id 
          ? { ...g, isMember: response.joined, membersCount: response.joined ? g.membersCount + 1 : g.membersCount - 1 }
          : g
      ));
      
      if (selectedGroup && selectedGroup.id === group.id) {
        setSelectedGroup(prev => prev ? { 
           ...prev, 
           isMember: response.joined, 
           membersCount: response.joined ? prev.membersCount + 1 : prev.membersCount - 1 
        } : null);
      }
      
      toast.success(response.message);
    } catch (error) {
      toast.error('Failed to update membership');
    }
  };

  const handlePostDiscussion = async () => {
    if (!newDiscussion.trim()) return;
    try {
       const newDisc = await api.createDiscussion({
         groupId: selectedGroup?.id ?? null,
         projectId: null,
         content: newDiscussion,
       });
       setDiscussions([newDisc, ...discussions]);
       setNewDiscussion('');
       toast.success('Discussion posted!');
    } catch (error) {
       toast.error('Failed to post discussion');
    }
  };

  const handlePostReply = async (discussionId: number, content: string) => {
    try {
      const response = await api.replyDiscussion(discussionId, content);
      
      setDiscussions(prev => prev.map(d => {
        if (d.id === discussionId) {
          const newComment = response.id ? response : null; 
          
          if (response.comments) {
             return response;
          }

          const updatedComments = d.comments ? [...d.comments, newComment] : [newComment];
          
          return {
            ...d,
            repliesCount: (d.repliesCount || 0) + 1,
            comments: updatedComments
          };
        }
        return d;
      }));

      toast.success('Reply posted!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to post reply');
      throw error;
    }
  };

  const handleLikeDiscussion = async (id: number) => {
    try {
      const response = await api.likeDiscussion(id);
      setDiscussions(prev => prev.map(d => 
        d.id === id 
          ? { ...d, isLiked: response.liked, likesCount: response.likes_count }
          : d
      ));
    } catch (error) {
      console.error('Failed to like', error);
    }
  };

  const handleVote = async (pollId: number, optionId: number) => {
     try {
        const updatedPoll = await api.votePoll(pollId, optionId);
        setPolls(prev => prev.map(p => p.id === pollId ? updatedPoll : p));
        toast.success('Vote recorded!');
     } catch (error) {
        toast.error('Failed to vote');
     }
  };

  const handleContribute = async (groupId: number) => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsContributing(true);
    try {
      const response = await api.contributeToGroup(groupId, parseFloat(contributionAmount));
      const pooledAmountValue = Number(response.pooled_amount);
      
      if (selectedGroup && selectedGroup.id === groupId) {
        setSelectedGroup(prev => prev ? { ...prev, pooledAmount: pooledAmountValue } : null);
      }
      
      setGroups(prev => prev.map(g => 
        g.id === groupId 
          ? { ...g, pooledAmount: pooledAmountValue }
          : g
      ));

      setContributionAmount('');
      toast.success(response.message);
    } catch (error) {
      toast.error('Failed to contribute');
    } finally {
      setIsContributing(false);
    }
  };

  const handleCreateGroup = async (data: any) => {
    try {
      toast.success('Group creation request sent!');
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error('Failed to create group');
    }
  };

  const renderGroupHeader = (group: CommunityGroup) => (
    <div className="relative h-56 rounded-3xl overflow-hidden mb-8 shadow-xl group">
      <img src={group.imageUrl || 'https://via.placeholder.com/800x400'} alt={group.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/60 to-transparent opacity-90"></div>
      <div className="absolute bottom-0 left-0 p-8 w-full flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <span className="px-3 py-1 bg-[#00DC82] text-[#0A192F] text-[10px] font-bold uppercase rounded-full mb-3 inline-block shadow-lg shadow-green-500/20">
            {group.sector}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{group.name}</h1>
          <p className="text-slate-300 max-w-2xl text-xs md:text-sm leading-relaxed line-clamp-2">{group.description}</p>
        </div>
        <div className="flex gap-4">
           <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10 min-w-[80px]">
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Members</p>
              <p className="text-lg font-bold text-white">{group.membersCount.toLocaleString()}</p>
           </div>
           <button 
             onClick={(e) => handleJoinGroup(e, group)}
             className={`px-6 py-2.5 font-bold rounded-xl transition-all shadow-lg text-sm ${
               group.isMember 
               ? 'bg-slate-700 text-white hover:bg-slate-600'
               : 'bg-white text-[#0A192F] hover:bg-slate-100'
             }`}
           >
              {group.isMember ? 'Leave' : 'Join'}
           </button>
        </div>
      </div>
      <button 
        onClick={() => setSelectedGroup(null)}
        className="absolute top-6 left-6 px-3 py-1.5 bg-black/30 text-white text-[10px] font-bold rounded-full backdrop-blur-md hover:bg-black/50 transition-colors flex items-center gap-2 border border-white/10"
      >
        <ArrowLeftIcon className="w-3 h-3" /> Back
      </button>
    </div>
  );

  const renderPoolingTab = (group: CommunityGroup) => {
     const percent = group.poolingGoal > 0 ? Math.min(100, (group.pooledAmount / group.poolingGoal) * 100) : 0;
     return (
       <div className="space-y-6 animate-fade-in">
          <div className="bg-[#0A192F] text-white rounded-2xl p-8 relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
             <div className="relative z-10 text-center">
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-2">Active Fundraise</p>
                <h2 className="text-4xl font-bold mb-6">Q3 Co-Investment Pool</h2>
                
                <div className="max-w-2xl mx-auto mb-4">
                   <div className="flex justify-between text-sm font-bold mb-2">
                      <span className="text-[#00DC82]">Raised: ₦{(group.pooledAmount/1000000).toFixed(1)}M</span>
                      <span className="text-slate-400">Goal: ₦{(group.poolingGoal/1000000).toFixed(0)}M</span>
                   </div>
                   <div className="h-4 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
                      <div className="h-full bg-gradient-to-r from-teal-500 to-[#00DC82]" style={{ width: `${percent}%` }}></div>
                   </div>
                </div>
                
                <p className="text-slate-300 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
                   Pooling funds allows our community to negotiate better equity terms and meet minimum ticket sizes for institutional-grade projects.
                </p>
                
                <div className="flex justify-center items-center gap-4 max-w-md mx-auto">
                   <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
                      <input 
                         type="number" 
                         value={contributionAmount}
                         onChange={(e) => setContributionAmount(e.target.value)}
                         placeholder="Enter amount"
                         className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00DC82] transition-all"
                      />
                   </div>
                   <button 
                      onClick={() => handleContribute(group.id)}
                      disabled={isContributing || !contributionAmount}
                      className="px-8 py-3 bg-[#00DC82] text-[#0A192F] font-bold rounded-xl hover:bg-[#00c474] transition-all shadow-lg shadow-green-500/20 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                      {isContributing ? 'Processing...' : 'Contribute'}
                   </button>
                </div>
             </div>
          </div>
       </div>
     )
  };

  const renderVotingTab = () => (
     <div className="space-y-6 animate-fade-in">
        {polls.length === 0 ? (
           <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <p className="text-slate-500">No active polls at the moment.</p>
           </div>
        ) : (
           polls.map(poll => (
              <div key={poll.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-[#0A192F]">{poll.question}</h3>
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full flex items-center gap-1">
                       <ClockIcon className="w-3.5 h-3.5" /> 
                       {new Date(poll.endDate) > new Date() ? 'Active' : 'Closed'}
                    </span>
                 </div>
                 
                 <div className="space-y-4 mb-6">
                    {poll.options.map((opt) => (
                       <div 
                         key={opt.id} 
                         onClick={() => handleVote(poll.id, opt.id)}
                         className="relative group cursor-pointer"
                       >
                          <div className="flex justify-between text-sm font-bold mb-1 relative z-10">
                             <span className="text-slate-700 group-hover:text-[#0A192F]">{opt.label}</span>
                             <span className="text-slate-500">{opt.percentage}%</span>
                          </div>
                          <div className="h-10 bg-slate-50 rounded-lg overflow-hidden relative border border-slate-100 group-hover:border-[#00DC82]/30 transition-colors">
                             <div className="absolute top-0 left-0 h-full bg-slate-200/50 group-hover:bg-[#00DC82]/10 transition-colors" style={{ width: `${opt.percentage}%` }}></div>
                             <div className="absolute inset-0 flex items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs font-bold text-[#00DC82]">Click to Vote</span>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
                 
                 <div className="flex justify-between text-xs text-slate-500 border-t border-slate-50 pt-4">
                    <span>Total Votes: {poll.totalVotes}</span>
                 </div>
              </div>
           ))
        )}
     </div>
  );

  const renderDiscussionsTab = () => (
     <div className="space-y-6 animate-fade-in">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex gap-4 items-start">
           <div className="w-10 h-10 rounded-full bg-[#0A192F] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              ME
           </div>
           <div className="flex-1 space-y-3">
             <textarea 
               value={newDiscussion}
               onChange={(e) => setNewDiscussion(e.target.value)}
               placeholder={selectedGroup ? `Start a discussion in ${selectedGroup.name}...` : "Share your thoughts or ask a question..."}
               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A192F] transition-all resize-none h-24"
             />
             <div className="flex justify-end">
                <button 
                  onClick={handlePostDiscussion}
                  disabled={!newDiscussion.trim()}
                  className="bg-[#0A192F] text-white px-6 py-2 rounded-xl font-bold text-sm disabled:opacity-50 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                >
                  Post Discussion
                </button>
             </div>
           </div>
        </div>
        
        {loadingDiscussions ? (
           <div className="py-12 flex justify-center"><Spinner /></div>
        ) : discussions.length === 0 ? (
           <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200">
              <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No discussions yet. Be the first to start one!</p>
           </div>
        ) : (
           <div className="space-y-4">
              {discussions.map(disc => (
                 <DiscussionItem 
                   key={disc.id} 
                   disc={disc} 
                   onLike={handleLikeDiscussion} 
                   onReply={handlePostReply} 
                 />
              ))}
           </div>
        )}
     </div>
  );

  if (loading) {
     return (
        <div className="min-h-screen flex items-center justify-center">
           <Spinner size="lg" />
        </div>
     );
  }

  if (selectedGroup) {
     return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-12 px-4 sm:px-6">
           {renderGroupHeader(selectedGroup)}
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                 <div className="bg-white border border-slate-100 rounded-2xl p-2 flex overflow-x-auto no-scrollbar shadow-sm">
                    {[
                       { id: 'discussions', label: 'Discussions', icon: MegaphoneIcon },
                       { id: 'pooling', label: 'Pooled Funds', icon: BanknotesIcon },
                       { id: 'voting', label: 'Governance', icon: CheckCircleIcon },
                       { id: 'portfolio', label: 'Portfolio', icon: ArrowTrendingUpIcon },
                    ].map(tab => (
                       <button 
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex-1 justify-center ${
                             activeTab === tab.id 
                             ? 'bg-[#0A192F] text-white shadow-md' 
                             : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                       >
                          <tab.icon className="w-4 h-4" /> {tab.label}
                       </button>
                    ))}
                 </div>

                 <div className="min-h-[400px]">
                    {activeTab === 'discussions' && renderDiscussionsTab()}
                    {activeTab === 'pooling' && renderPoolingTab(selectedGroup)}
                    {activeTab === 'voting' && renderVotingTab()}
                    {activeTab === 'portfolio' && (
                       <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 border-dashed">
                          <ArrowTrendingUpIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-[#0A192F]">Portfolio Hidden</h3>
                          <p className="text-slate-500 text-sm mt-2">Join the group to view active investments and returns.</p>
                       </div>
                    )}
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-[#0A192F] mb-4">About Community</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6">
                       {selectedGroup.description}
                    </p>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Sector</span>
                          <span className="font-bold text-[#0A192F]">{selectedGroup.sector}</span>
                       </div>
                       <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Established</span>
                          <span className="font-bold text-[#0A192F]">Aug 2024</span>
                       </div>
                       <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Location</span>
                          <span className="font-bold text-[#0A192F]">Lagos, NG</span>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-[#0A192F] mb-4">Community Admins</h3>
                    <div className="space-y-4">
                       {[1, 2].map(i => (
                          <div key={i} className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                                AD
                             </div>
                             <div>
                                <p className="text-sm font-bold text-[#0A192F]">Admin User {i}</p>
                                <p className="text-xs text-slate-400">Moderator</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <h3 className="font-bold text-[#0A192F] mb-2 text-sm">Community Guidelines</h3>
                    <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4">
                       <li>Be respectful to all members</li>
                       <li>Keep discussions relevant to investing</li>
                       <li>No self-promotion or spam</li>
                       <li>Report suspicious activity</li>
                    </ul>
                 </div>
              </div>
           </div>
        </div>
     );
  }

  return (
    <div className="animate-fade-in space-y-8 max-w-7xl mx-auto pb-12 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0A192F]">Investor Communities</h1>
          <p className="text-slate-500 mt-2 max-w-xl text-sm leading-relaxed">
            Join forces with like-minded investors. Pool funds, vote on deals, and share due diligence to maximize returns.
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0A192F] text-white rounded-xl hover:bg-slate-800 transition-colors shadow-lg font-bold text-sm">
          <PlusIcon className="w-5 h-5" />
          <span>Create New Group</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups.map(group => (
          <div 
             key={group.id} 
             onClick={() => setSelectedGroup(group)}
             className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
          >
            <div className="h-40 relative overflow-hidden">
               <img src={group.imageUrl || 'https://via.placeholder.com/400x200'} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-[#0A192F] text-[10px] font-bold uppercase rounded-lg shadow-sm">
                     {group.sector}
                  </span>
               </div>
            </div>
            
            <div className="p-6 flex-grow flex flex-col">
               <h3 className="text-xl font-bold text-[#0A192F] mb-2 group-hover:text-teal-600 transition-colors">{group.name}</h3>
               <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-grow">{group.description}</p>
               
               <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-3 rounded-xl text-center">
                     <p className="text-lg font-bold text-[#0A192F]">{group.membersCount}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase">Members</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl text-center">
                     <p className="text-lg font-bold text-[#00DC82]">Active</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase">Status</p>
                  </div>
               </div>

               <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex -space-x-2">
                     {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                     ))}
                     <div className="w-8 h-8 rounded-full bg-[#0A192F] text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">
                        +
                     </div>
                  </div>
                  <span className="text-sm font-bold text-[#0A192F] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                     Enter <ChevronRightIcon className="w-4 h-4" />
                  </span>
               </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#0A192F] rounded-3xl p-8 md:p-12 relative overflow-hidden text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00DC82]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
         
         <div className="relative z-10 flex-1">
            <h2 className="text-3xl font-bold mb-4">Why join a Community?</h2>
            <ul className="space-y-4">
               {[
                  "Pool capital to meet high minimum investment thresholds.",
                  "Vote on investment decisions as a collective DAO.",
                  "Share due diligence and risk analysis with experts.",
                  "Negotiate better terms and lower fees for the group."
               ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                     <CheckCircleIcon className="w-6 h-6 text-[#00DC82] flex-shrink-0" />
                     <span className="text-slate-300 font-medium">{item}</span>
                  </li>
               ))}
            </ul>
         </div>
         
         <div className="relative z-10 w-full md:w-auto bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl max-w-sm">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-full bg-[#00DC82] flex items-center justify-center text-[#0A192F] font-bold">
                  <BanknotesIcon className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">Total Pooled</p>
                  <p className="text-2xl font-bold text-white">₦450M+</p>
               </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
               Our communities have successfully funded 12 projects this quarter with an average ROI of 18%.
            </p>
         </div>
      </div>
      
      <CreateGroupModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSubmit={handleCreateGroup} 
      />
    </div>
  );
};

export default Community;
