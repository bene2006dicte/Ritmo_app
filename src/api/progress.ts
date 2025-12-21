import axiosClient from "./axiosClient";
// Interface pour typer les données de progression
export interface ProgressData {
    id: number;
    objective_id: number;
    date: string; // Format YYYY-MM-DD
    status: string;
    value?: number;
}

const ProgressService = {
    // 1. Récupérer tous les objectifs de l'utilisateur
    getUserObjectives: async () => {
        const response = await axiosClient.get('/objectives');
        return response.data;
    },

    // 2. Récupérer l'historique de progression d'un objectif spécifique
    getObjectiveProgress: async (objectiveId: number): Promise<ProgressData[]> => {
        const response = await axiosClient.get(`/objectives/${objectiveId}/progress`);
        return response.data;
    },

    // 3. Enregistrer (ou basculer) une progression pour une date précise
    submitProgress: async (objectiveId: number, date: string, value: number = 1) => {
        const response = await axiosClient.post(`/objectives/${objectiveId}/progress`, {
            date: date,
            value: value
        });
        return response.data;
    }
};

export default ProgressService;