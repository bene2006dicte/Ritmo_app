export const calculateStreak = (dates: string[]): number => {
    if (!dates || dates.length === 0) return 0;

    // Trier les dates (les plus récentes d'abord)
    const sortedDates = [...dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // Normaliser aujourd'hui (sans l'heure)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Vérifier si la dernière date est aujourd'hui ou hier pour continuer la série
    const lastDate = new Date(sortedDates[0]);
    lastDate.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Si la dernière validation date d'il y a plus d'un jour (hier), la série est brisée
    // Note: diffDays = 0 (aujourd'hui), 1 (hier)
    if (diffDays > 1) return 0;

    let streak = 1;
    let currentDate = lastDate;

    for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i]);
        prevDate.setHours(0, 0, 0, 0);

        const diffPrevious = Math.abs(currentDate.getTime() - prevDate.getTime());
        const dayDifference = Math.ceil(diffPrevious / (1000 * 60 * 60 * 24));

        if (dayDifference === 1) {
            streak++;
            currentDate = prevDate;
        } else if (dayDifference === 0) {
            // Même jour (doublon possible), on ignore
            continue;
        } else {
            // Rupture de séquence
            break;
        }
    }

    return streak;
};
