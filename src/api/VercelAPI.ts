/* ID-START: SY-VERCEL-2.6-EMERGENCY */
import axios from 'axios';

export const VercelAPI = {
  getDeployments: async () => {
    const token = import.meta.env.VITE_VERCEL_TOKEN;
    const projectId = import.meta.env.VITE_VERCEL_PROJECT_ID;
    const teamId = import.meta.env.VITE_VERCEL_TEAM_ID;

    if (!token) throw new Error("CRITICAL: VITE_VERCEL_TOKEN is undefined.");
    if (!projectId) throw new Error("CRITICAL: VITE_VERCEL_PROJECT_ID is undefined.");

    try {
      const response = await axios.get('https://api.vercel.com/v6/deployments', {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        params: { 
          projectId,
          ...(teamId ? { teamId } : {})
        }
      });
      return response.data.deployments || [];
    } catch (error: any) {
      // Enhanced diagnostic logging for emergency repair
      const details = error.response?.data?.error || error.message;
      console.error(`[VERCEL REPAIR] Auth failure with Project: ${projectId}. Details:`, details);
      throw error;
    }
  },

  getBuildLogs: async (deploymentId: string) => {
    return [
      { type: 'info', message: 'Build started...' },
      { type: 'info', message: 'Cloning repository...' },
      { type: 'success', message: 'Build completed successfully.' }
    ];
  }
};
/* ID-END: SY-VERCEL-2.6-EMERGENCY */
