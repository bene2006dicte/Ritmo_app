import "./Input.css";

export default function Input({ type = "text", placeholder, value, onChange }: any) {
  return (
    <input
      className="ritmo-input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
