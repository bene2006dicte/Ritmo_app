import React, { useState, useEffect } from 'react';
import { Target, Plus, X, Calendar, Edit2, Trash2, LayoutGrid, Clock, Flame } from 'lucide-react';
import goalsApi from '../../api/goals'; // Import de la connexion API
import './Goals.css';

interface GoalType {
    id: number | null;
    title: string;
    category: string;
    start_date: string;
    duration_unit: string;
    duration_value: number;
    current?: number;
    total?: number;
    unit?: string;
    streak?: number;
}

const Goals = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [goalsList, setGoalsList] = useState<GoalType[]>([]); // Liste dynamique via API
    
    const [formData, setFormData] = useState<GoalType>({
        id: null,
        title: '',
        category: '',
        start_date: new Date().toISOString().split('T')[0],
        duration_unit: 'days',
        duration_value: 1
    });

    // --- LOGIQUE API ---

    // 1. Charger les objectifs au montage du composant
    const fetchGoals = async () => {
        try {
            const response = await goalsApi.getAll();
            setGoalsList(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des objectifs:", error);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    /// 2. Enregistrer (Créer ou Modifier)
const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérification de sécurité avant l'envoi
    if (!formData.category) {
        alert("Veuillez choisir une catégorie");
        return;
    }

    try {
        const apiData = {
            title: formData.title,
            category: formData.category, // Doit correspondre exactement au 'category' du contrôleur
            start_date: formData.start_date,
            duration_unit: formData.duration_unit,
            duration_value: formData.duration_value
        };

        if (isEditing && formData.id) {
            await goalsApi.update(formData.id, apiData);
        } else {
            await goalsApi.create(apiData);
        }
        
        fetchGoals(); 
        setIsModalOpen(false);
    } catch (error) {
        // Pour voir l'erreur SQL précise directement dans l'alerte si besoin
        console.error("Erreur détaillée:", error.response?.data);
        alert("Erreur lors de l'enregistrement : " + (error.response?.data?.error || "Serveur injoignable"));
    }
};    // 3. Supprimer
    const handleDelete = async (id: number) => {
        if (window.confirm("Voulez-vous vraiment supprimer cet objectif ?")) {
            try {
                await goalsApi.delete(id);
                fetchGoals(); // Rafraîchir la liste
            } catch (error) {
                console.error("Erreur lors de la suppression:", error);
            }
        }
    };

    // --- LOGIQUE MODALE ---

    const openCreateModal = () => {
        setIsEditing(false);
        setFormData({ 
            id: null, 
            title: '', 
            category: '', 
            start_date: new Date().toISOString().split('T')[0], 
            duration_unit: 'days', 
            duration_value: 30 
        });
        setIsModalOpen(true);
    };

    const openEditModal = (goal: GoalType) => {
        setIsEditing(true);
        setFormData({ 
            id: goal.id,
            title: goal.title,
            category: goal.category,
            start_date: goal.start_date || new Date().toISOString().split('T')[0], 
            duration_unit: goal.duration_unit || 'days',
            duration_value: goal.duration_value || 0
        });
        setIsModalOpen(true);
    };

    return (
        <div className="goals-page">
            <header className="goals-header">
                <h1>Gestion des objectifs</h1>
                <p>Créez, modifiez et suivez tous vos objectifs en temps réel</p>
            </header>

            <div className="goals-card">
                <div className="card-header">
                    <div className="title-group">
                        <Target size={22} color="#6366f1" />
                        <h2>Mes objectifs</h2>
                    </div>
                    <button className="add-goal-btn" onClick={openCreateModal}>
                        <Plus size={20} /> Ajouter un objectif
                    </button>
                </div>

                <table className="goals-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Catégorie</th>
                            <th>Progression</th>
                            <th>Série</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {goalsList.map((goal) => (
                            <tr key={goal.id}>
                                <td>
                                    <div className="goal-name-cell">
                                        <span className="goal-title">{goal.title}</span>
                                        <span className="goal-duration">{goal.duration_value} {goal.duration_unit === 'days' ? 'jours' : 'mois'}</span>
                                    </div>
                                </td>
                                <td>{goal.category}</td>
                                <td>
                                    <div className="progress-wrapper">
                                        <div className="progress-bg">
                                            <div className="progress-bar" style={{width: `${((goal.current || 0) / (goal.duration_value || 1)) * 100}%`}}></div>
                                        </div>
                                        <span className="progress-text">{goal.current || 0}/{goal.duration_value} {goal.duration_unit === 'days' ? 'jours' : 'mois'}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="streak-container">
                                        <Flame size={18} fill="#f59e0b" color="#f59e0b" />
                                        <span>{goal.streak || 0} jours</span>
                                    </div>
                                </td>
                                <td><span className="status-tag active">Actif</span></td>
                                <td>
                                    <div className="action-icons">
                                        <button className="btn-action edit" onClick={() => openEditModal(goal)}><Edit2 size={16} /></button>
                                        <button className="btn-action delete" onClick={() => goal.id && handleDelete(goal.id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal-container overlay-style">
                        <div className="modal-top">
                            <h2>{isEditing ? 'Modifier l\'objectif' : 'Créer un objectif'}</h2>
                            <button className="close-x-transparent" onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form className="goal-form-grid" onSubmit={handleSave}>
                            <div className="input-group full">
                                <label><Target size={18} color="#6366f1" /> Nom de l'objectif</label>
                                <input required type="text" placeholder="Ex: Se réveiller à 6h" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                            </div>

                            <div className="input-group full">
                                <label><LayoutGrid size={18} color="#6366f1" /> Catégorie</label>
                                <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                    <option value="">Sélectionner une catégorie</option>
                                    <option value="Routine matinale">Routine matinale</option>
                                    <option value="Santé et fitness">Santé et fitness</option>
                                    <option value="Apprentissage">Apprentissage</option>
                                    <option value="Productivité">Productivité</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label><Calendar size={18} color="#6366f1" /> Date de début</label>
                                <input required type="date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} />
                            </div>

                            <div className="input-group">
                                <label><Clock size={18} color="#6366f1" /> Unité</label>
                                <div className="type-toggle">
                                    <button type="button" className={formData.duration_unit === 'days' ? 'active' : ''} onClick={() => setFormData({...formData, duration_unit: 'days'})}>Jours</button>
                                    <button type="button" className={formData.duration_unit === 'months' ? 'active' : ''} onClick={() => setFormData({...formData, duration_unit: 'months'})}>Mois</button>
                                </div>
                            </div>

                            <div className="input-group full">
                                <label>Durée de l'objectif ({formData.duration_unit === 'days' ? 'en jours' : 'en mois'})</label>
                                <input 
                                    required
                                    type="number" 
                                    min="1"
                                    value={formData.duration_value} 
                                    onChange={(e) => setFormData({...formData, duration_value: parseInt(e.target.value) || 0})} 
                                />
                            </div>

                            <div className="modal-footer full">
                                <button type="button" className="cancel-btn-custom" onClick={() => setIsModalOpen(false)}>Annuler</button>
                                <button type="submit" className="save-btn-custom">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Goals;