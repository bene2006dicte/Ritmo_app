import { useEffect, useState } from "react";
import ProgressCalendar from "../../components/Calendar/ProgressCalendar";
import ProgressService from "../../api/progress"; // <-- juste l'objet, pas les types
import type { ProgressData, Objective } from "../../api/progress"; // <-- type-only import
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

  // Récupérer les objectifs
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
    const data = await ProgressService.getObjectiveProgress(objectiveId);
    setProgressData(data);

    // Durée totale de l'objectif (en jours)
    const totalDays = selectedObjective
      ? selectedObjective.duration_unit === "days"
        ? selectedObjective.duration_value
        : selectedObjective.duration_value * 30
      : 0;

    const completed = data.filter((p) => p.completed).length;
    setProgressSummary({ completed, total: totalDays });
  };

  // Ajouter une progression pour la date sélectionnée
  const handleAddProgress = async () => {
    if (!selectedObjective || !selectedDate) return;

    const formattedDate = selectedDate.toISOString().split("T")[0];
    await ProgressService.submitProgress(selectedObjective.id, formattedDate, true);

    // Recharger les progressions et le récap
    loadProgress(selectedObjective.id);
    setSelectedDate(null);
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
            <button className="btn-validate" onClick={handleAddProgress}>
              Valider
            </button>
            <button
              className="btn-cancel"
              onClick={() => setSelectedDate(null)}
            >
              Annuler
            </button>
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
                      width: `${
                        progressSummary.total === 0
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
