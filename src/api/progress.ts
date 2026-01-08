import axiosClient from "./axiosClient";

// Types
export interface ProgressData {
  id: number;
  objective_id: number;
  date: string; // Format YYYY-MM-DD
  completed: boolean;
}

export interface Objective {
  id: number;
  title: string;
  duration_value: number;
  duration_unit: "days" | "months";
}

// Service API pour les progressions
const ProgressService = {
  // Récupérer tous les objectifs de l'utilisateur
  getUserObjectives: async (): Promise<Objective[]> => {
    const response = await axiosClient.get("/objectives");
    return response.data;
  },

  // Récupérer l'historique de progression d'un objectif spécifique
  getObjectiveProgress: async (objectiveId: number): Promise<ProgressData[]> => {
    const response = await axiosClient.get(`/objectives/${objectiveId}/progress`);
    return response.data;
  },

  // Ajouter ou basculer une progression pour une date précise
  submitProgress: async (
    objectiveId: number,
    date: string,
    completed: boolean = true
  ): Promise<ProgressData> => {
    const response = await axiosClient.post(`/objectives/${objectiveId}/progress`, {
      date,
      completed,
    });
    return response.data;
  },
};

export default ProgressService;
