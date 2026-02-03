
export const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL && import.meta.env.VITE_BACKEND_URL.includes('http') 
  ? import.meta.env.VITE_BACKEND_URL 
  : 'https://loopital.onrender.com').replace(/\/+$/, '');
export const API_URL = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.includes('http')
  ? import.meta.env.VITE_API_URL 
  : `${BACKEND_URL}/api`).replace(/\/+$/, '');

const toCamelCase = (str: string) => {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
};

const keysToCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => keysToCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const newKey = toCamelCase(key);
      result[newKey] = keysToCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

const keysToSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => keysToSnakeCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const newKey = toSnakeCase(key);
      result[newKey] = keysToSnakeCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

const getHeaders = () => {
  const token = localStorage.getItem('loopital_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Token ${token}` } : {})
  };
};

export const api = {
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      const data = await response.json();
      localStorage.setItem('loopital_token', data.token);
      return keysToCamelCase(data.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (email: string, password: string, firstName: string, lastName: string, role: string, companyName: string) => {
    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keysToSnakeCase({ email, password, firstName, lastName, role, companyName })),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
      const data = await response.json();
      localStorage.setItem('loopital_token', data.token);
      return keysToCamelCase(data.user);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await fetch(`${API_URL}/logout/`, {
        method: 'POST',
        headers: getHeaders(),
      });
      localStorage.removeItem('loopital_token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  getUser: async () => {
    try {
      // Use query param for cache busting (sufficient and avoids CORS preflight issues with custom headers)
      const response = await fetch(`${API_URL}/users/me/?t=${new Date().getTime()}`, { 
        headers: getHeaders()
      });
      if (!response.ok) {
        const error: any = new Error('Failed to fetch user');
        error.status = response.status;
        throw error;
      }
      const data = await response.json();
      return keysToCamelCase(data);
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  getProjects: async () => {
    try {
      const response = await fetch(`${API_URL}/projects/`, { headers: getHeaders() });
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      const camelData = keysToCamelCase(data);
      return Array.isArray(camelData) ? camelData : (camelData.results || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  getInvestments: async () => {
    try {
      const response = await fetch(`${API_URL}/investments/`, { headers: getHeaders() });
      if (!response.ok) throw new Error('Failed to fetch investments');
      const data = await response.json();
      const camelData = keysToCamelCase(data);
      return Array.isArray(camelData) ? camelData : (camelData.results || []);
    } catch (error) {
      console.error('Error fetching investments:', error);
      return [];
    }
  },

  getTransactions: async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/`, { headers: getHeaders() });
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      const camelData = keysToCamelCase(data);
      return Array.isArray(camelData) ? camelData : (camelData.results || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  },

  getPortfolioPerformance: async (range: string = '6M') => {
    try {
      const response = await fetch(`${API_URL}/users/portfolio-performance/?range=${range}`, { headers: getHeaders() });
      if (!response.ok) throw new Error('Failed to fetch portfolio performance');
      return await response.json();
    } catch (error) {
      console.error('Error fetching portfolio performance:', error);
      return { labels: [], data: [] };
    }
  },




  createProject: async (projectData: any) => {
    try {
      // Check if projectData is FormData (for file uploads)
      let body: any;
      let headers: any = getHeaders();

      if (projectData instanceof FormData) {
        // Remove Content-Type header to let browser set it with boundary for FormData
        delete headers['Content-Type'];
        body = projectData;
      } else {
        body = JSON.stringify(keysToSnakeCase(projectData));
      }

      const response = await fetch(`${API_URL}/projects/`, {
        method: 'POST',
        headers: headers,
        body: body,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData) || 'Failed to create project');
      }
      const data = await response.json();
      return keysToCamelCase(data);
    } catch (error) {
      console.error('Create project error:', error);
      throw error;
    }
  },

  getMyListings: async () => {
    try {
      const response = await fetch(`${API_URL}/projects/my-listings/`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch my listings');
      return keysToCamelCase(await response.json());
    } catch (error) {
      console.error('Fetch my listings error:', error);
      throw error;
    }
  },

  getRecentActivities: async () => {
    try {
      const response = await fetch(`${API_URL}/projects/recent-activities/`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch recent activities');
      return keysToCamelCase(await response.json());
    } catch (error) {
      console.error('Fetch recent activities error:', error);
      throw error;
    }
  },

  getFundingStats: async () => {
    try {
      const response = await fetch(`${API_URL}/projects/funding-stats/`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch funding stats');
      return keysToCamelCase(await response.json());
    } catch (error) {
      console.error('Fetch funding stats error:', error);
      throw error;
    }
  },

  getNotifications: async () => {
    try {
      const response = await fetch(`${API_URL}/notifications/`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return keysToCamelCase(await response.json());
    } catch (error) {
      console.error('Fetch notifications error:', error);
      throw error; // Or return empty array
    }
  },

  markNotificationsRead: async (notificationIds?: number[]) => {
    try {
      const response = await fetch(`${API_URL}/notifications/mark-read/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(keysToSnakeCase({ notificationIds })),
      });
      if (!response.ok) throw new Error('Failed to mark notifications read');
      return await response.json();
    } catch (error) {
      console.error('Mark notifications read error:', error);
      throw error;
    }
  },

  getProject: async (id: string) => {
    try {
      const headers: any = getHeaders();
      const response = await fetch(`${API_URL}/projects/${id}/`, {
        headers: headers,
      });
      if (!response.ok) throw new Error('Failed to fetch project');
      return keysToCamelCase(await response.json());
    } catch (error) {
      console.error('Fetch project error:', error);
      throw error;
    }
  },

  uploadProjectImage: async (projectId: string | number, formData: FormData) => {
    try {
      const headers: any = getHeaders();
      delete headers['Content-Type']; // Let browser set boundary
      
      const response = await fetch(`${API_URL}/projects/${projectId}/upload-image/`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload image');
      return await response.json();
    } catch (error) {
      console.error('Upload image error:', error);
      throw error;
    }
  },

  addProjectMilestone: async (projectId: string | number, formData: FormData) => {
    try {
      const headers: any = getHeaders();
      delete headers['Content-Type'];
      
      const response = await fetch(`${API_URL}/projects/${projectId}/add-milestone/`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to add milestone');
      return await response.json();
    } catch (error) {
      console.error('Add milestone error:', error);
      throw error;
    }
  },

  investInProject: async (projectId: number | string, amount: number) => {
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}/invest/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(keysToSnakeCase({ amount })),
      });
      if (!response.ok) {
        const errorData = await response.json();
        // Handle specific error messages if possible, or stringify the whole object
        const errorMessage = errorData.error || errorData.detail || JSON.stringify(errorData);
        throw new Error(errorMessage || 'Failed to invest in project');
      }
      const data = await response.json();
      return keysToCamelCase(data);
    } catch (error) {
      console.error('Error investing in project:', error);
      throw error;
    }
  },

  createInvestment: async (investmentData: any) => {
    try {
      const response = await fetch(`${API_URL}/investments/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(keysToSnakeCase(investmentData)),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Create investment failed:', errorData);
        throw new Error(JSON.stringify(errorData) || 'Failed to create investment');
      }
      const data = await response.json();
      return keysToCamelCase(data);
    } catch (error) {
      console.error('Error creating investment:', error);
      throw error;
    }
  },

  createTransaction: async (transactionData: any) => {
    try {
      const response = await fetch(`${API_URL}/transactions/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(keysToSnakeCase(transactionData)),
      });
      if (!response.ok) throw new Error('Failed to create transaction');
      const data = await response.json();
      return keysToCamelCase(data);
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  requestProjectWithdrawal: async (projectUuid: string, amount: number, reason: string, phase: number) => {
    try {
      const response = await fetch(`${API_URL}/project-withdrawals/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(keysToSnakeCase({ project: projectUuid, amount, reason, phase })),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData) || 'Failed to request withdrawal');
      }
      return await response.json();
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
      throw error;
    }
  },

  verifyDeposit: async (reference: string) => {
    try {
      const response = await fetch(`${API_URL}/deposit/verify/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ reference }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        // Handle DRF 'detail' or custom 'error'/'details'
        const backendError = errorData.detail || errorData.error;
        const backendDetails = errorData.details;
        
        let errorMessage = backendError || 'Deposit verification failed';
        if (backendDetails) {
            errorMessage += `: ${typeof backendDetails === 'object' ? JSON.stringify(backendDetails) : backendDetails}`;
        }
        
        console.error('Verify Deposit Failed:', { status: response.status, data: errorData });
        throw new Error(errorMessage);
      }
      const data = await response.json();
      return keysToCamelCase(data);
    } catch (error) {
      console.error('Verify deposit error:', error);
      throw error;
    }
  },

  linkBank: async (bankName: string, accountNumber: string, accountName: string, bankCode?: string) => {
    try {
      const response = await fetch(`${API_URL}/users/link-bank/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(keysToSnakeCase({ bankName, bankCode, accountNumber, accountName })),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData) || 'Failed to link bank account');
      }
      return await response.json();
    } catch (error) {
      console.error('Link bank error:', error);
      throw error;
    }
  },

  getBanks: async () => {
    try {
      const response = await fetch(`${API_URL}/users/get-banks/`, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch banks');
      return await response.json();
    } catch (error) {
      console.error('Get banks error:', error);
      throw error;
    }
  },

  resolveAccount: async (accountNumber: string, bankCode: string) => {
    try {
      const response = await fetch(`${API_URL}/users/resolve-account/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(keysToSnakeCase({ accountNumber, bankCode })),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to resolve account');
      }
      return await response.json();
    } catch (error) {
      console.error('Resolve account error:', error);
      throw error;
    }
  },

  verifyKyc: async () => {
    try {
      const response = await fetch(`${API_URL}/users/verify-kyc/`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'KYC verification failed');
      }
      return await response.json();
    } catch (error) {
      console.error('KYC verification error:', error);
      throw error;
    }
  },

  withdraw: async (amount: number) => {
    try {
      const response = await fetch(`${API_URL}/withdraw/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Withdrawal failed');
      }
      const data = await response.json();
      return keysToCamelCase(data);
    } catch (error) {
      console.error('Withdraw error:', error);
      throw error;
    }
  },

  // Admin Methods
  approveProject: async (projectId: number) => {
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}/approve/`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to approve project');
      return await response.json();
    } catch (error) {
      console.error('Approve project error:', error);
      throw error;
    }
  },

  rejectProject: async (projectId: number) => {
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}/reject/`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to reject project');
      return await response.json();
    } catch (error) {
      console.error('Reject project error:', error);
      throw error;
    }
  },

  getWithdrawalRequests: async () => {
    try {
      const response = await fetch(`${API_URL}/project-withdrawals/`, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch withdrawal requests');
      const data = await response.json();
      return keysToCamelCase(data);
    } catch (error) {
      console.error('Get withdrawal requests error:', error);
      throw error;
    }
  },

  getProjectWithdrawals: async () => {
    try {
      const response = await fetch(`${API_URL}/project-withdrawals/`, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData?.detail || errorData?.error || 'Failed to fetch project withdrawals';
        throw new Error(message);
      }
      const data = await response.json();
      const camelData = keysToCamelCase(data);
      return Array.isArray(camelData) ? camelData : (camelData.results || []);
    } catch (error) {
      console.error('Error fetching project withdrawals:', error);
      return [];
    }
  },

  approveWithdrawalRequest: async (requestId: number) => {
    try {
      const response = await fetch(`${API_URL}/project-withdrawals/${requestId}/approve/`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to approve request');
      return await response.json();
    } catch (error) {
      console.error('Error approving request:', error);
      throw error;
    }
  },

  distributeReturns: async (projectId: number | string, percentage: number) => {
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}/distribute-returns/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ percentage }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData) || 'Failed to distribute returns');
      }
      return await response.json();
    } catch (error) {
      console.error('Error distributing returns:', error);
      throw error;
    }
  },

  // Community Methods
  getDiscussions: async (params?: { projectId?: string | number; groupId?: string | number }) => {
    try {
      const query = new URLSearchParams();
      if (params?.projectId !== undefined && params?.projectId !== null) {
        query.set('project', String(params.projectId));
      }
      if (params?.groupId !== undefined && params?.groupId !== null) {
        query.set('group', String(params.groupId));
      }
      const url = query.toString() ? `${API_URL}/discussions/?${query.toString()}` : `${API_URL}/discussions/`;
      const response = await fetch(url, { headers: getHeaders() });
      if (!response.ok) throw new Error('Failed to fetch discussions');
      const data = await response.json();
      const camelData = keysToCamelCase(data);
      return Array.isArray(camelData) ? camelData : (camelData.results || []);
    } catch (error) {
      console.error('Error fetching discussions:', error);
      return [];
    }
  },

  createDiscussion: async (params: { projectId?: string | number | null; groupId?: string | number | null; content: string }) => {
    try {
      const response = await fetch(`${API_URL}/discussions/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(keysToSnakeCase({ project: params.projectId ?? null, group: params.groupId ?? null, content: params.content })),
      });
      if (!response.ok) throw new Error('Failed to create discussion');
      const data = await response.json();
      return keysToCamelCase(data);
    } catch (error) {
      console.error('Error creating discussion:', error);
      throw error;
    }
  },

  likeDiscussion: async (discussionId: number) => {
    try {
      const response = await fetch(`${API_URL}/discussions/${discussionId}/like/`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to like discussion');
      return await response.json();
    } catch (error) {
      console.error('Error liking discussion:', error);
      throw error;
    }
  },

  replyDiscussion: async (discussionId: number, content: string) => {
    try {
      const response = await fetch(`${API_URL}/discussions/${discussionId}/reply/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error('Failed to reply to discussion');
      const data = await response.json();
      return keysToCamelCase(data);
    } catch (error) {
      console.error('Error replying to discussion:', error);
      throw error;
    }
  },

  getGroups: async () => {
    try {
      const response = await fetch(`${API_URL}/groups/`, { headers: getHeaders() });
      if (!response.ok) throw new Error('Failed to fetch community groups');
      const data = await response.json();
      const camelData = keysToCamelCase(data);
      return Array.isArray(camelData) ? camelData : (camelData.results || []);
    } catch (error) {
      console.error('Error fetching community groups:', error);
      return [];
    }
  },

  joinGroup: async (groupId: number) => {
    try {
      const response = await fetch(`${API_URL}/groups/${groupId}/join/`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to join/leave group');
      return await response.json();
    } catch (error) {
      console.error('Error joining/leaving group:', error);
      throw error;
    }
  },

  contributeToGroup: async (groupId: number, amount: number) => {
    try {
      const response = await fetch(`${API_URL}/groups/${groupId}/contribute/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) throw new Error('Failed to contribute to group');
      return await response.json();
    } catch (error) {
      console.error('Error contributing to group:', error);
      throw error;
    }
  },

  getPolls: async () => {
    try {
      const response = await fetch(`${API_URL}/polls/`, { headers: getHeaders() });
      if (!response.ok) throw new Error('Failed to fetch polls');
      const data = await response.json();
      const camelData = keysToCamelCase(data);
      return Array.isArray(camelData) ? camelData : (camelData.results || []);
    } catch (error) {
      console.error('Error fetching polls:', error);
      return [];
    }
  },

  votePoll: async (pollId: number, optionId: number) => {
    try {
      const response = await fetch(`${API_URL}/polls/${pollId}/vote/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(keysToSnakeCase({ optionId })),
      });
      if (!response.ok) throw new Error('Failed to vote');
      const data = await response.json();
      return keysToCamelCase(data);
    } catch (error) {
      console.error('Error voting:', error);
      throw error;
    }
  },
};
