import axiosClient from "./axiosClient";

export interface GoalData {
    id?: number;
    title: string;
    description?: string;
    start_date: string;
    duration_unit: string; // 'days' ou 'months'
    duration_value: number;
}

const goalsApi = {
    // Récupérer tous les objectifs
    getAll: () => {
        return axiosClient.get("/objectives");
    },

    // Créer un nouvel objectif
    create: (data: GoalData) => {
        return axiosClient.post("/objectives", data);
    },

    // Modifier un objectif existant
    update: (id: number, data: GoalData) => {
        return axiosClient.put(`/objectives/${id}`, data);
    },

    // Supprimer un objectif
    delete: (id: number) => {
        return axiosClient.delete(`/objectives/${id}`);
    }
};

export default goalsApi;