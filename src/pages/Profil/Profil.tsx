import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { Import } from "lucide-react";
import "./Profil.css";

const Profil = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Charger les infos actuelles
  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setName(data.name);
      setEmail(data.email);
    });
  }, []);

  // Sauvegarder les modifications
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosClient.put("/user/update", {
        name,
        email,
        password,
      });
      alert("Profil mis à jour !");
      setPassword(""); // vider le champ après update
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour");
    }
  };

  // Déconnexion
  const handleLogout = async () => {
    try {
      await axiosClient.post("/logout");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="profil-container">
      <h2>Mon profil</h2>
      <form onSubmit={handleUpdate} className="profil-form">
        <div className="form-group">
          <label>Nom complet</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-save">Enregistrer</button>
      </form>

      <button onClick={handleLogout} className="btn-logout">
        Déconnexion
      </button>
    </div>
  );
};

export default Profil;
