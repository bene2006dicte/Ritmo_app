import React from 'react';
import { Flame, Trophy, Target, Calendar } from 'lucide-react'; // Import des icônes
import './StatCard.css';
import ProgressBar from '../ProgressBar/ProgressBar'; // On n'oublie pas ta ProgressBar

interface StatCardProps {
    title: string;
    value: string;
    trend: string;
    variant: 'orange' | 'green' | 'purple' | 'blue';
    showProgress?: boolean; // Pour afficher la barre sur la carte Réussite
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, variant, showProgress }) => {
    
    // On remplace le switch SVG par les composants Lucide
    const renderIcon = () => {
        // strokeWidth à 2.5 pour que ce soit bien visible mais élégant
        const iconProps = { size: 24, strokeWidth: 2.5 }; 
        
        switch(variant) {
            case 'orange': return <Flame {...iconProps} />;
            case 'green':  return <Trophy {...iconProps} />;
            case 'purple': return <Target {...iconProps} />;
            case 'blue':   return <Calendar {...iconProps} />;
        }
    };

    return (
        <div className="stat-card-pro">
            <div className={`icon-wrapper ${variant}`}>
                {renderIcon()}
            </div>
            <div className="stat-content">
                <h2 className="stat-value">{value}</h2>
                <p className="stat-label">{title}</p>
                
                {/* Intégration de la ProgressBar sans casser ton design */}
                {showProgress && (
                    <div style={{ margin: '10px 0' }}>
                        <ProgressBar progress={87} />
                    </div>
                )}

                <div className="stat-trend">
                    <span className="arrow">↑</span> {trend}
                </div>
            </div>
        </div>
    );
};

export default StatCard;