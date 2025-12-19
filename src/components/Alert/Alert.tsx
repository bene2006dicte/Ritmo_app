import "./Alert.css";

export default function Alert({ message, type = "error" }: any) {
  return (
    <div className={`ritmo-alert ${type}`}>
      {message}
    </div>
  );
}
