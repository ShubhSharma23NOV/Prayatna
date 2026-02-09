/**
 * Engineering Rule Engine
 * Deterministic frontend-only logic for structural and seismic analysis simulations.
 */

export const runModule1PBD = (input) => {
    const { zone, storeys, structuralSystem } = input;
    let riskScore = 0;

    // Base risk from zone
    if (zone === 'zone-v') riskScore += 50;
    else if (zone === 'zone-iv') riskScore += 30;
    else if (zone === 'zone-iii') riskScore += 10;

    // Complexity from height
    if (storeys > 30) riskScore += 25;
    else if (storeys > 15) riskScore += 15;

    // System factors
    if (structuralSystem === 'smrf' && storeys > 20) riskScore += 10;

    return {
        riskStatus: riskScore > 60 ? 'High Risk' : riskScore > 30 ? 'Medium Risk' : 'Low Risk',
        confidenceScore: Math.min(98, 100 - (riskScore / 5)).toFixed(1),
        recommendations: [
            riskScore > 50 ? "Perform non-linear time history analysis." : "Linear static analysis sufficient.",
            storeys > 15 ? "Check for P-Delta effects." : "P-Delta effects negligible.",
            "Verify joint shear in moment frames."
        ]
    };
};

export const runModule2TallBuilding = (input) => {
    const { storeys, structuralSystem } = input;
    const isTall = storeys > 15;

    return {
        status: isTall ? 'Active' : 'Not Required',
        slendernessRatio: (storeys * 0.15).toFixed(2), // Rough proxy
        sensitivity: isTall ? 'High' : 'Low',
        suggestions: isTall
            ? ["Integrate core-outrigger system.", "Check wind-induced vibrations."]
            : ["No specialized tall building provisions required."]
    };
};

export const runModule3Walls = (input) => {
    const { structuralSystem, storeys, regularity } = input;
    const needsWalls = structuralSystem === 'wall' || storeys > 10;

    return {
        densityRequirement: needsWalls ? '0.015 Ac' : '0.008 Ac',
        placementStatus: regularity ? 'Symmetric' : 'Eccentric',
        suggestion: needsWalls
            ? "Ensure wall-centroid aligns with mass-centroid."
            : "Frame action sufficient for lateral loads."
    };
};

export const runModule4SSI = (input) => {
    const { soil, groundwater } = input;

    return {
        foundationType: soil === 'soft' ? 'Piled Raft' : 'Isolated/Raft',
        ssiEffect: soil === 'soft' ? 'Significant' : 'Minor',
        liquefactionRisk: (soil === 'soft' && groundwater === 'shallow') ? 'High' : 'Low',
        reason: soil === 'soft' ? "Soft strata increases spectral acceleration." : "Firm strata offers stable subgrade."
    };
};

export const runModule5GroundMotion = (input) => {
    const { zone } = input;
    const pgaMap = { 'zone-v': 0.36, 'zone-iv': 0.24, 'zone-iii': 0.16, 'zone-ii': 0.10 };

    return {
        expectedPGA: `${pgaMap[zone] || 0.1}g`,
        spectrumType: 'Type II (Medium)',
        damping: '5%',
        note: `Analysis based on IS 1893:2016 for ${zone.toUpperCase()}.`
    };
};
