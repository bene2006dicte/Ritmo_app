import  { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Progress.css';
import axiosClient from '../../api/axiosClient';
const ProgressPage = () => {
    // 1. Liste fixe pour éviter le trait jaune de l'éditeur
    const objectives = [
        { id: 1, title: 'Sport 30min/jour' },
        { id: 2, title: 'Routine matinale' }
    ];

    const [selectedObj, setSelectedObj] = useState<number>(1);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [progressData, setProgressData] = useState<string[]>([]);

    // Formatage de la date pour l'API (YYYY-MM-DD)
    const dateStr = selectedDate.toLocaleDateString('en-CA');

    // 2. Chargement dynamique au changement d'objectif
    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await axiosClient.get(`/progress/${selectedObj}`);
                setProgressData(res.data); // Ton API doit renvoyer ["2025-12-01", "2025-12-05"]
            } catch (err) {
                console.error("Erreur de chargement", err);
            }
        };
        fetchProgress();
    }, [selectedObj]);

    // 3. Actions Valider/Annuler synchronisées
    const handleToggle = async (type: 'add' | 'remove') => {
        try {
            if (type === 'add') {
                await axiosClient.post('/progress', { objective_id: selectedObj, date: dateStr });
                if (!progressData.includes(dateStr)) setProgressData([...progressData, dateStr]);
            } else {
                await axiosClient.delete(`/progress/${selectedObj}/${dateStr}`);
                setProgressData(progressData.filter(d => d !== dateStr));
            }
        } catch (err) {
            console.error("Erreur API", err);
        }
    };

    const getTileClassName = ({ date, view }: any) => {
        if (view !== 'month') return '';
        const dStr = date.toLocaleDateString('en-CA');
        const today = new Date(); today.setHours(0,0,0,0);

        if (progressData.includes(dStr)) return 'tile-success'; // Vert
        if (dStr === dateStr) return 'tile-selected'; // Bleu
        if (date < today) return 'tile-fail'; // Rouge
        return '';
    };

    // Calcul du % pour la barre de progression
    const percent = Math.round((progressData.length / 30) * 100);

    return (
        <div className="progress-container">
            {/* BOUTONS OBJECTIFS : Cliquables et réactifs */}
            <div className="objectives-header">
                {objectives.map(obj => (
                    <button 
                        key={obj.id} 
                        className={`obj-btn ${selectedObj === obj.id ? 'active' : ''}`}
                        onClick={() => setSelectedObj(obj.id)} 
                    >
                        {obj.title} ✕
                    </button>
                ))}
            </div>

            <div className="progress-main">
                <div className="calendar-card">
                    <Calendar 
                        value={selectedDate} 
                        onClickDay={(date) => setSelectedDate(date)} 
                        tileClassName={getTileClassName} 
                    />
                </div>

                <div className="sidebar-right">
                    <div className="card-white">
                        <h3>Ajouter un progrès</h3>
                        <p>Date sélectionnée : <strong>{selectedDate.toLocaleDateString('fr-FR')}</strong></p>
                        <button className="btn-valider" onClick={() => handleToggle('add')}>Valider</button>
                        <button className="btn-annuler" onClick={() => handleToggle('remove')}>Annuler</button>
                    </div>

                    <div className="card-white">
                        <h3>Récapitulatif de l'objectif</h3>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
                        </div>
                        <p>{percent}% complété - {progressData.length}/30 jours</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressPage;