import { create } from 'zustand';
import { Job } from '@/types';
import { mockJobs } from '@/mocks/jobs';

interface JobsState {
  jobs: Job[];
  savedJobs: Job[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchJobs: () => Promise<void>;
  fetchSavedJobs: () => Promise<void>;
  saveJob: (jobId: string, saved: boolean) => Promise<void>;
  searchJobs: (query: string) => Promise<void>;
  clearError: () => void;
}

export const useJobsStore = create<JobsState>((set, get) => ({
  jobs: [],
  savedJobs: [],
  isLoading: false,
  error: null,
  
  fetchJobs: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app with Supabase, you would use:
      // const { data, error } = await supabase
      //   .from('jobs')
      //   .select('*')
      //   .order('posted_at', { ascending: false });
      // if (error) throw error;
      
      set({ 
        jobs: mockJobs,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while fetching jobs',
        isLoading: false,
      });
    }
  },
  
  fetchSavedJobs: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app with Supabase, you would use:
      // const { data, error } = await supabase
      //   .from('saved_jobs')
      //   .select('job_id')
      //   .eq('user_id', userId);
      // if (error) throw error;
      // 
      // const savedJobIds = data.map(item => item.job_id);
      // 
      // const { data: jobsData, error: jobsError } = await supabase
      //   .from('jobs')
      //   .select('*')
      //   .in('id', savedJobIds);
      // if (jobsError) throw jobsError;
      
      const savedJobs = mockJobs.filter(job => job.saved);
      
      set({ 
        savedJobs,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while fetching saved jobs',
        isLoading: false,
      });
    }
  },
  
  saveJob: async (jobId: string, saved: boolean) => {
    try {
      // Update local state immediately for better UX
      const jobs = get().jobs.map(job => 
        job.id === jobId ? { ...job, saved } : job
      );
      
      set({ jobs });
      
      // Update saved jobs list
      if (saved) {
        const jobToSave = get().jobs.find(job => job.id === jobId);
        if (jobToSave) {
          set({ savedJobs: [...get().savedJobs, { ...jobToSave, saved: true }] });
        }
      } else {
        set({ savedJobs: get().savedJobs.filter(job => job.id !== jobId) });
      }
      
      // In a real app with Supabase, you would use:
      // if (saved) {
      //   await supabase.from('saved_jobs').insert({ job_id: jobId, user_id: userId });
      // } else {
      //   await supabase.from('saved_jobs').delete().match({ job_id: jobId, user_id: userId });
      // }
      
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while saving the job',
      });
      
      // Revert on error
      await get().fetchJobs();
      await get().fetchSavedJobs();
    }
  },
  
  searchJobs: async (query: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app with Supabase, you would use:
      // const { data, error } = await supabase
      //   .from('jobs')
      //   .select('*')
      //   .or(`title.ilike.%${query}%,company_name.ilike.%${query}%,description.ilike.%${query}%`)
      //   .order('posted_at', { ascending: false });
      // if (error) throw error;
      
      // Simple search implementation for mock data
      const filteredJobs = mockJobs.filter(job => {
        const searchTerm = query.toLowerCase();
        return (
          job.title.toLowerCase().includes(searchTerm) ||
          job.company_name.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm) ||
          job.location.toLowerCase().includes(searchTerm)
        );
      });
      
      set({ 
        jobs: filteredJobs,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while searching jobs',
        isLoading: false,
      });
    }
  },
  
  clearError: () => {
    set({ error: null });
  },
}));