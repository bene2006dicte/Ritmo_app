import "./Button.css";

export default function Button({ children, onClick, type = "button" }: any) {
  return (
    <button className="ritmo-button" onClick={onClick} type={type}>
      {children}
    </button>
  );
}
