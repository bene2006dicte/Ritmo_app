import { useEffect, useState } from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { TrendingUp, Target } from 'lucide-react';
import ProgressService from '../../api/progress';
import type { Objective, ProgressData } from '../../api/progress';
import './Statistics.css';

interface ChartData {
    date: string;
    count: number;
}

const Statistics = () => {
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [loading, setLoading] = useState(true);
    const [allData, setAllData] = useState<Record<number, ChartData[]>>({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const fetchedObjectives = await ProgressService.getUserObjectives();
                setObjectives(fetchedObjectives);

                const dataMap: Record<number, ChartData[]> = {};

                // Pour chaque objectif, on récupère sa progression
                for (const obj of fetchedObjectives) {
                    const progress = await ProgressService.getObjectiveProgress(obj.id);

                    // Trier les progrès par date
                    const sortedProgress = progress
                        .filter(p => p.completed)
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                    // Transformer en données cumulées pour le graphique
                    let cumulativeCount = 0;
                    const chartData = sortedProgress.map(p => {
                        cumulativeCount += 1;
                        return {
                            date: new Date(p.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
                            count: cumulativeCount
                        };
                    });

                    dataMap[obj.id] = chartData;
                }

                setAllData(dataMap);
            } catch (error) {
                console.error("Erreur lors du chargement des statistiques:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="statistics-page">
                <div className="loading-container">Chargement des statistiques...</div>
            </div>
        );
    }

    return (
        <div className="statistics-page">
            <header className="statistics-header">
                <h1>Analyses & Statistiques</h1>
                <p>Visualisez votre progression et la constance de vos efforts</p>
            </header>

            {objectives.length === 0 ? (
                <div className="no-data-message">
                    <Target size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                    <p>Vous n'avez pas encore d'objectifs pour afficher des statistiques.</p>
                </div>
            ) : (
                <div className="charts-grid">
                    {objectives.map((obj) => (
                        <div key={obj.id} className="chart-card">
                            <h3>
                                <TrendingUp size={20} color="#6366f1" />
                                {obj.title}
                            </h3>
                            <div style={{ width: '100%', height: 300 }}>
                                {allData[obj.id] && allData[obj.id].length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={allData[obj.id]}>
                                            <defs>
                                                <linearGradient id={`colorCount-${obj.id}`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="date"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#64748b', fontSize: 12 }}
                                                dy={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#64748b', fontSize: 12 }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '12px',
                                                    border: 'none',
                                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="count"
                                                name="Validations cumulées"
                                                stroke="#6366f1"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill={`url(#colorCount-${obj.id})`}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                        Aucune donnée de progression pour cet objectif
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Statistics;
