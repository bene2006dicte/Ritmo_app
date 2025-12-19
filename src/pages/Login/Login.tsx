import { useState } from "react";
import { useNavigate } from "react-router";
import axiosClient from "../../api/axiosClient";
import "../auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axiosClient.post("/login", { email, password });

      localStorage.setItem("token", data.token); // stocke le token
      navigate("/dashboard"); // redirige vers dashboard

    } catch (err: any) {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-card">
        <h2>Connexion</h2>

        {error && <p className="auth-error">{error}</p>}

        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <p className="auth-link">
          Pas encore de compte ? <a href="/register">Créer un compte</a>
        </p>
      </form>
    </div>
  );
}
