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
  start_date?: string; // utile pour les validations
}

// Fonction utilitaire pour normaliser une date en YYYY-MM-DD
const normalizeDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
};

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
    objective: Objective,
    date: Date | string,
    completed: boolean = true
  ): Promise<ProgressData> => {
    const isoDate = normalizeDate(date);
    const today = normalizeDate(new Date());
    const startDate = objective.start_date ? normalizeDate(objective.start_date) : "";

    // Vérifications côté front avant l'appel API
    if (startDate && isoDate < startDate) {
      throw new Error("Impossible de valider avant le début de l'objectif");
    }
    if (isoDate > today) {
      throw new Error("Impossible de valider une date future");
    }

    try {
      const response = await axiosClient.post(`/objectives/${objective.id}/progress`, {
        date: isoDate,
        completed,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error("Progression déjà enregistrée pour ce jour");
      }
      throw new Error(error.response?.data?.message || "Erreur lors de l'enregistrement");
    }
  },
};

export default ProgressService;
