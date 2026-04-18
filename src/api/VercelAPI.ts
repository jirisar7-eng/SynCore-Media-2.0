/* ID-START: SY-VERCEL-2.7-DIAGNOSTIC */
import axios from 'axios';

export const VercelAPI = {
  getDeployments: async () => {
    const token = import.meta.env.VITE_VERCEL_TOKEN;
    const projectId = import.meta.env.VITE_VERCEL_PROJECT_ID;
    const teamId = import.meta.env.VITE_VERCEL_TEAM_ID;

    if (!token) throw new Error("CRITICAL: VITE_VERCEL_TOKEN is undefined in environment.");
    if (!projectId) throw new Error("CRITICAL: VITE_VERCEL_PROJECT_ID is undefined in environment.");

    try {
      console.log(`[VERCEL DEBUG] Attempting fetch for Project: ${projectId}${teamId ? ` (Team: ${teamId})` : ''}`);
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
      const status = error.response?.status;
      const details = error.response?.data?.error || error.message;
      
      console.group(`[VERCEL ERROR] ${status || 'Network Error'}`);
      console.error("Path: /v6/deployments");
      console.error("Project ID:", projectId);
      console.error("Team ID:", teamId || "Not Provided");
      console.error("Response Details:", details);
      if (status === 401) console.error("HINT: Your Vercel Token is invalid or expired.");
      if (status === 403) console.error("HINT: Access Forbidden. This usually means the Project ID belongs to a Team, and you MUST provide VITE_VERCEL_TEAM_ID.");
      if (status === 404) console.error("HINT: Project ID not found. Verify it starts with 'prj_'.");
      console.groupEnd();

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
/* ID-END: SY-VERCEL-2.7-DIAGNOSTIC */
