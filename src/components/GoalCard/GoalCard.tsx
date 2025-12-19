import "./GoalCard.css";

export default function GoalCard({ icon, title, stat, progress }: any) {
  return (
    <div className="goal-card">
      <div className="goal-card-icon" style={{ backgroundColor: icon.color }}>
        {icon.emoji}
      </div>
      <div className="goal-card-content">
        <h3 className="goal-card-title">{title}</h3>
        <p className="goal-card-stat">{stat}</p>
        <div className="goal-card-progress">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
}
