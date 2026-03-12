export const calculateQuickRisk = (input) => {
    // Default weights
    const ZONE_WEIGHT = { II: 1, III: 2, IV: 5, V: 8 };
    const SOIL_WEIGHT = { Hard: 1, Medium: 3, Soft: 6 };
    const SYSTEM_WEIGHT = { Dual: 0, RCC: 3, LoadBearing: 8 };

    let score = 0;

    // 1. Zone Impact (Max 6)
    score += ZONE_WEIGHT[input.zone] || 0;

    // 2. Soil Impact (Max 5)
    score += SOIL_WEIGHT[input.soil] || 0;

    // 3. System Vulnerability (Max 6)
    score += SYSTEM_WEIGHT[input.structuralSystem] || 0;

    // 4. Height Impact (Roughly 1 point per 3 storeys, max 10)
    const heightScore = Math.min(Math.floor(input.storeys / 3), 10);
    score += heightScore;

    // 5. Irregularity (Flat penalty)
    if (input.regularity === 'Irregular') score += 6;

    // 6. Site Risk (Groundwater + SPT)
    if (input.groundwater === 'High') score += 3;
    if (input.sptN && input.sptN < 15) score += 4;

    // Normalize to 0-100 scale (Assuming max score approx 30-40)
    // Max possible: 6+5+6+10+5+3+4 = 39. Let's map 40 to 100% Risk.
    const riskPercentage = Math.min(Math.round((score / 38) * 100), 100);

    let label = 'Low';
    let color = '#22C55E'; // Green

    if (riskPercentage > 25) {
        label = 'Medium';
        color = '#EAB308'; // Yellow
    }
    if (riskPercentage > 55) {
        label = 'High';
        color = '#EF4444'; // Red
    }
    if (riskPercentage > 80) {
        label = 'Critical';
        color = '#7F1D1D'; // Dark Red
    }

    return {
        score: riskPercentage, // 0-100 (Higher is riskier)
        safetyScore: 100 - riskPercentage, // 0-100 (Higher is safer)
        label,
        color,
        rawScore: score
    };
};
