import { useNavigate } from "react-router";
import "./PrivacyPolicy.css";

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    return (
        <div className="privacy-container">
            <div className="privacy-card">
                <button className="back-button" onClick={() => navigate("/register")}>
                    ← Retour
                </button>
                <h1>Politique de Confidentialité</h1>
                <p className="last-updated">Dernière mise à jour : 26 janvier 2026</p>

                <section>
                    <h2>1. Introduction</h2>
                    <p>
                        Bienvenue sur Ritmo. Nous attachons une grande importance à la protection de vos données personnelles et au respect de votre vie privée. Cette politique de confidentialité vous explique comment nous collectons, utilisons et protégeons vos informations.
                    </p>
                </section>

                <section>
                    <h2>2. Données collectées</h2>
                    <p>
                        Nous collectons les données suivantes lors de votre inscription :
                    </p>
                    <ul>
                        <li>Nom complet</li>
                        <li>Adresse e-mail</li>
                        <li>Données de progression et objectifs</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Utilisation des données</h2>
                    <p>
                        Vos données sont utilisées exclusivement pour :
                    </p>
                    <ul>
                        <li>Gérer votre compte utilisateur</li>
                        <li>Suivre vos objectifs et votre progression</li>
                        <li>Améliorer nos services</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Protection des données</h2>
                    <p>
                        Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.
                    </p>
                </section>

                <section>
                    <h2>5. Vos droits</h2>
                    <p>
                        Conformément à la réglementation en vigueur (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Vous pouvez exercer ces droits en nous contactant via votre profil.
                    </p>
                </section>

                <section>
                    <h2>6. Contact</h2>
                    <p>
                        Pour toute question concernant cette politique, vous pouvez nous contacter à support@ritmo.app.
                    </p>
                </section>
            </div>
        </div>
    );
}
