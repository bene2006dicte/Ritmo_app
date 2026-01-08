import axiosClient from './axiosClient';

 interface DashboardStats {
    activeObjectives: number;
    totalCompletedDays: number;
    maxStreak: number;
    successRate: number;
    totalObjectiveDays:number
    // data:Array<any>
}

const dashboardApi = {
    // Récupérer les statistiques du dashboard
    getStats: async (): Promise<DashboardStats> => {
        const response = await axiosClient.get('/dashboard/stats');
        return response.data;
    }
};

export { dashboardApi };
export type { DashboardStats };
