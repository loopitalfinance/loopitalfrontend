
export enum Sector {
  RealEstate = 'Real Estate',
  Agriculture = 'Agriculture',
  Tech = 'Technology',
  Energy = 'Energy',
  Logistics = 'Logistics',
}

export interface ProjectImage {
  id: number;
  image: string;
  caption: string;
  createdAt: string;
}

export interface ProjectMilestone {
  id: number;
  project: number;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'completed';
  proofDocument?: string;
  createdAt: string;
}

export interface VerificationDetails {
  verifiedBy: string;
  lastInspectionDate: string;
  statusBadge: string;
}

export interface ProjectMedia {
  heroImage: string;
  gallery: string[];
  businessPlanPdf?: string;
}

export interface FinancialMetrics {
  targetFunding: number;
  currentFunding: number;
  fundingPercentage: number;
  minInvestment: number;
  expectedRoi: string;
  tenureMonths: number;
  payoutFrequency: string;
  totalInvestors: number;
  valuation?: number;
}

export interface ProjectOwnerDetails {
  companyName: string;
  ownerId: string;
  rating: number;
  projectsCompleted: number;
  identityStatus: string;
}

export interface FundingPhase {
  phaseNumber: number;
  title: string;
  fundingRequired: number;
  status: string;
}

export interface RiskAssessment {
  level: string;
  notes: string;
}

export interface Project {
  id: string;
  uuid?: string;
  title: string;
  description: string;
  fullDetails: string;
  sector: string;
  targetAmount: number;
  raisedAmount: number;
  minInvestment: number;
  roi: number;
  durationMonths: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  image?: string;
  owner: string;
  ownerId?: string | number;
  status: 'pending' | 'active' | 'funded' | 'completed' | 'rejected';
  category?: string;
  amountReleased?: number;
  availableBalance?: number;
  currentPhase?: number;
  totalPhases?: number;
  images?: ProjectImage[];
  milestones?: ProjectMilestone[];
  updates?: any[];

  
  // Enhanced Fields for Redesign
  location?: string;
  isVerified?: boolean;
  verificationDetails?: VerificationDetails;
  media?: ProjectMedia;
  financialMetrics?: FinancialMetrics;
  ownerDetails?: ProjectOwnerDetails;
  fundingRoadmap?: FundingPhase[];
  riskAssessment?: RiskAssessment;

  // Debt Specific
  repaymentSchedule?: string;
  bondTerms?: string;

  // Equity Specific
  valuation?: number;
  equityPercentage?: number;
  shareType?: string;
  dividendPolicy?: string;
  exitStrategy?: string;
  tractionData?: any;
  problemStatement?: string;
  productDescription?: string;
  targetMarket?: string;
  businessModel?: string;

  // Common New
  startDate?: string;
  endDate?: string;
  completionDate?: string;
  useOfFunds?: any;
  riskMitigationPlan?: string;
  proofOfCommitment?: string;
}

export interface Payout {
  id: number;
  amount: number | string;
  dueDate: string;
  status: 'pending' | 'processed' | 'failed';
  processedAt?: string;
}

export interface Investment {
  id: string;
  amount: number;
  date: string;
  project: string | number | Project;
  status: 'active' | 'completed' | 'cancelled';
  roi?: number;
  returns?: number;
  payouts?: Payout[];
  currentValue?: number;
  user?: string | number;
  projectTitle?: string;
  investorName?: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'investment';
  amount: number;
  date: string;
  description: string;
  status: 'success' | 'pending' | 'failed';
}

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  role: 'Investor' | 'ProjectOwner' | 'Admin';
  walletBalance: number;
  companyName?: string; // For Project Owners
  isVerified?: boolean;
  profilePicture?: string;
  bankAccount?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
  
  // Enhanced KYC Fields
  fullLegalName?: string;
  residentialAddress?: string;
  cacRegistrationNumber?: string;
  governmentId?: string; // URL
  proofOfAddress?: string; // URL
  incorporationCertificate?: string; // URL
  directorsDetails?: any[];
}

export interface AIAnalysisResult {
  riskScore: number;
  summary: string;
  pros: string[];
  cons: string[];
}

export interface Notification {
  id: string;
  type: 'payment' | 'project_update' | 'security' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface Comment {
  id: number;
  discussion: number;
  author: User; // Or a simplified user object
  content: string;
  createdAt: string;
}

export interface Discussion {
  id: number;
  author: User;
  project?: number;
  group?: number;
  content: string;
  createdAt: string;
  likesCount: number;
  repliesCount: number;
  isLiked: boolean;
  comments: Comment[];
}

export interface CommunityGroup {
  id: number;
  name: string;
  description: string;
  sector: Sector;
  imageUrl: string;
  pooledAmount: number;
  poolingGoal: number;
  createdAt: string;
  membersCount: number;
  isMember: boolean;
}

export interface PollOption {
  id: number;
  poll: number;
  label: string;
  votesCount: number;
  percentage: number;
}

export interface Poll {
  id: number;
  question: string;
  createdAt: string;
  endDate: string;
  isActive: boolean;
  options: PollOption[];
  totalVotes: number;
}

export interface ProjectWithdrawalRequest {
  id: number;
  project: number;
  projectTitle: string;
  amount: number;
  phase: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  requestDate: string;
}
