import "./ProgressBar.css";

export default function ProgressBar({ progress }: any) {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
    </div>
  );
}
