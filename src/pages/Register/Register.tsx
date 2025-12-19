import { useState } from "react";
import { useNavigate } from "react-router";
import axiosClient from "../../api/axiosClient";
import "../auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
//   const [confirmPassword,setConfirmPassword] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError("");

    // if(password !== confirmPassword){
    //   setError("Les mots de passe ne correspondent pas.");
    //   return;
    // }

    setLoading(true);
    try {
      await axiosClient.post("/register", { name, email, password });
      navigate("/login"); // redirige vers login après succès
    } catch(err:any){
      setError("Impossible de créer le compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleRegister} className="auth-card">
        <h2>Créer un compte</h2>

        {error && <p className="auth-error">{error}</p>}

        <input
          type="text"
          placeholder="Nom complet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        {/* <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        /> */}

        <button type="submit" disabled={loading}>
          {loading ? "Création..." : "S'inscrire"}
        </button>

        <p className="auth-link">
          Déjà un compte ? <a href="/login">Se connecter</a>
        </p>
      </form>
    </div>
  );
}
