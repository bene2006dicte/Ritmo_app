import { useEffect, useState } from "react";
import ProgressCalendar from "../../components/Calendar/ProgressCalendar";
import ProgressService from "../../api/progress";
import type { ProgressData, Objective } from "../../api/progress";
import "./Progress.css";

export default function ProgressPage() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [progressSummary, setProgressSummary] = useState<{ completed: number; total: number }>({
    completed: 0,
    total: 0,
  });
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les objectifs
  useEffect(() => {
    ProgressService.getUserObjectives().then((res) => setObjectives(res));
  }, []);

  // Charger les progressions lorsque l'objectif change
  useEffect(() => {
    if (!selectedObjective) return;
    loadProgress(selectedObjective.id);
  }, [selectedObjective]);

  // Fonction pour charger l'historique d'un objectif et mettre à jour le récap
  const loadProgress = async (objectiveId: number) => {
    setIsLoading(true);
    try {
      const data = await ProgressService.getObjectiveProgress(objectiveId);
      setProgressData(data);

      const totalDays = selectedObjective
        ? selectedObjective.duration_unit === "days"
          ? selectedObjective.duration_value
          : selectedObjective.duration_value * 30
        : 0;

      const completed = data.filter((p) => p.completed).length;
      setProgressSummary({ completed, total: totalDays });
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter une progression pour la date sélectionnée
  const handleAddProgress = async () => {
    if (!selectedObjective || !selectedDate) return;

    try {
      await ProgressService.submitProgress(selectedObjective, selectedDate, true);
      await loadProgress(selectedObjective.id);
      setSelectedDate(null);
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  // Calculer la date de fin pour l'affichage
  const getEndDate = (obj: Objective | null) => {
    if (!obj || !obj.start_date) return undefined;
    const start = new Date(obj.start_date);
    const end = new Date(start);

    if (obj.duration_unit === 'months') {
      end.setMonth(end.getMonth() + obj.duration_value);
      end.setDate(end.getDate() - 1);
    } else {
      end.setDate(end.getDate() + obj.duration_value - 1);
    }
    return end.toISOString().split('T')[0]; // Format YYYY-MM-DD
  };

  return (
    <div className="progress-page">
      <div className="progress-top">
        <select
          className="objective-select"
          value={selectedObjective?.id || ""}
          onChange={(e) => {
            const obj = objectives.find((o) => o.id === Number(e.target.value));
            setSelectedObjective(obj || null);
          }}
        >
          <option value="">Choisir un objectif</option>
          {objectives.map((obj) => (
            <option key={obj.id} value={obj.id}>
              {obj.title}
            </option>
          ))}
        </select>
      </div>

      <div className="progress-content">
        <div className="calendar-container">
          <ProgressCalendar
            objectiveId={selectedObjective?.id || null}
            progressData={progressData}
            onSelectDate={(date) => setSelectedDate(date)}
            startDate={selectedObjective?.start_date}
            endDate={getEndDate(selectedObjective || null)}
            isLoading={isLoading}
          />
        </div>

        <div className="progress-sidebar">
          <div className="add-progress">
            <h3>Ajouter un progrès</h3>
            <input
              type="text" 
              value={selectedDate ? selectedDate.toLocaleDateString() : ""}
              readOnly 
            />
            <div className="buttons">
              <button className="btn-validate" onClick={handleAddProgress}>
                Valider
              </button>
              <button className="btn-cancel" onClick={() => setSelectedDate(null)}>
                Annuler
              </button>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>

          <div className="progress-summary">
            <h3>Récapitulatif de l'objectif</h3>
            {selectedObjective && (
              <>
                <p>{selectedObjective.title}</p>
                <p>
                  {progressSummary.completed}/{progressSummary.total} jours complétés
                </p>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${progressSummary.total === 0
                        ? 0
                        : (progressSummary.completed / progressSummary.total) * 100
                        }%`,
                    }}
                  ></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
