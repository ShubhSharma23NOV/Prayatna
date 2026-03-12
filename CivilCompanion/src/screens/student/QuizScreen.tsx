import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../../theme/colors';

const QUESTIONS_BY_LEVEL = {
    1: [
        {
            id: 1,
            question: "Which IS Code covers Ductile Detailing of RCC Structures?",
            options: ["IS 456", "IS 1893", "IS 13920", "IS 875"],
            answer: "IS 13920",
            expl: "IS 13920:2016 specifically governs ductile detailing to ensure seismic safety."
        },
        {
            id: 2,
            question: "In Seismic Zone V, what is the Zone Factor (Z)?",
            options: ["0.10", "0.16", "0.24", "0.36"],
            answer: "0.36",
            expl: "Zone V is the highest risk zone with Z = 0.36."
        },
        {
            id: 3,
            question: "Soft Storey irregularity specifically occurs when?",
            options: ["Stiffness < 70% of above", "Mass > 150% of below", "Plan is L-shaped", "Soil is soft"],
            answer: "Stiffness < 70% of above",
            expl: "A soft storey has significantly less lateral stiffness than the storey above it."
        }
    ],
    2: [
        {
            id: 4,
            question: "What is the maximum spacing of stirrups in a confinement zone?",
            options: ["100 mm", "150 mm", "200 mm", "300 mm"],
            answer: "100 mm",
            expl: "Confinement zones require closer spacing (max 100mm) to ensure ductility."
        },
        {
            id: 5,
            question: "Which wave causes the most damage during an earthquake?",
            options: ["P-Wave", "S-Wave", "Love Wave", "Surface Wave"],
            answer: "Surface Wave",
            expl: "Surface waves (Love and Rayleigh) carry the most energy and cause the most destruction."
        },
        {
            id: 6,
            question: "Liquefaction is most likely to occur in?",
            options: ["Clay", "Gravel", "Loose Saturated Sand", "Bedrock"],
            answer: "Loose Saturated Sand",
            expl: "Loose, saturated sandy soils lose strength and behave like a liquid during shaking."
        }
    ],
    3: [
        {
            id: 7,
            question: "The Response Reduction Factor (R) for SMRF is?",
            options: ["3.0", "4.0", "5.0", "2.5"],
            answer: "5.0",
            expl: "Special Moment Resisting Frames (SMRF) are designed for high ductility, hence R=5."
        },
        {
            id: 8,
            question: "Base Isolation is primarily used to?",
            options: ["Increase Stiffness", "Decouple structure from ground", "Reduce Weight", "Increase Damping"],
            answer: "Decouple structure from ground",
            expl: "Base isolators separate the building from ground motion, reducing seismic forces."
        },
        {
            id: 9,
            question: "Weak Beam - Strong Column concept ensures?",
            options: ["Shear Failure", "Column Hinging", "Beam Hinging First", "Foundation Failure"],
            answer: "Beam Hinging First",
            expl: "It ensures plastic hinges form in beams first, preventing catastrophic column collapse."
        }
    ]
};

const QuizScreen = ({ navigation, route }) => {
    const { level = 1 } = route.params || {};
    const questions = QUESTIONS_BY_LEVEL[level] || QUESTIONS_BY_LEVEL[1];

    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOpt, setSelectedOpt] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const handleAnswer = (opt) => {
        setSelectedOpt(opt);
        setIsAnswered(true);
        if (opt === questions[currentQ].answer) {
            setScore(s => s + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQ < questions.length - 1) {
            setCurrentQ(c => c + 1);
            setSelectedOpt(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
        }
    };

    const handleExit = () => {
        if (score === questions.length) {
            // Pass back success if perfect score
            navigation.navigate('StudentDashboard', { levelPassed: level });
        } else {
            navigation.goBack();
        }
    };

    const restart = () => {
        setCurrentQ(0);
        setScore(0);
        setShowResult(false);
        setSelectedOpt(null);
        setIsAnswered(false);
    };

    if (showResult) {
        return (
            <View style={styles.container}>
                <View style={styles.resultCard}>
                    <Text style={styles.resultTitle}>QUIZ COMPLETED</Text>
                    <Text style={styles.scoreText}>{score} / {questions.length}</Text>
                    <Text style={styles.resultDesc}>
                        {score === questions.length ? "Perfect Score! Level Up!" : "Keep learning to unlock the next level."}
                    </Text>
                    <TouchableOpacity style={styles.btn} onPress={score === questions.length ? handleExit : restart}>
                        <Text style={styles.btnText}>{score === questions.length ? "CONTINUE" : "TRY AGAIN"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, { marginTop: 10, backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border }]} onPress={() => navigation.goBack()}>
                        <Text style={[styles.btnText, { color: colors.textSecondary }]}>EXIT</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const q = questions[currentQ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.progress}>Question {currentQ + 1} / {questions.length}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.question}>{q.question}</Text>

                <View style={styles.opts}>
                    {q.options.map(opt => {
                        let bg = colors.surface;
                        if (isAnswered) {
                            if (opt === q.answer) bg = 'rgba(34, 197, 94, 0.2)'; // Green
                            else if (opt === selectedOpt) bg = 'rgba(239, 68, 68, 0.2)'; // Red
                        }

                        return (
                            <TouchableOpacity
                                key={opt}
                                style={[styles.optBtn, { backgroundColor: bg }]}
                                onPress={() => !isAnswered && handleAnswer(opt)}
                                disabled={isAnswered}
                            >
                                <Text style={styles.optText}>{opt}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {isAnswered && (
                    <View style={styles.explBox}>
                        <Text style={styles.explTitle}>{selectedOpt === q.answer ? 'Correct!' : 'Incorrect'}</Text>
                        <Text style={styles.explText}>{q.expl}</Text>
                        <TouchableOpacity style={styles.nextBtn} onPress={nextQuestion}>
                            <LinearGradient colors={gradients.primary} style={styles.nextGradient}>
                                <Text style={styles.nextText}>{currentQ === questions.length - 1 ? 'FINISH' : 'NEXT →'}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    progress: { color: colors.textSecondary, fontWeight: 'bold' },
    closeText: { color: colors.textSecondary, fontSize: 20 },

    content: { flex: 1 },
    question: { color: colors.text, fontSize: 22, fontWeight: 'bold', marginBottom: 30, lineHeight: 32 },

    opts: { gap: 15 },
    optBtn: {
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border
    },
    optText: { color: colors.text, fontSize: 16 },

    explBox: { marginTop: 30, backgroundColor: colors.surface, padding: 20, borderRadius: 12 },
    explTitle: { color: colors.text, fontWeight: 'bold', fontSize: 18, marginBottom: 5 },
    explText: { color: colors.textSecondary, marginBottom: 20 },

    nextBtn: { borderRadius: 8, overflow: 'hidden' },
    nextGradient: { padding: 15, alignItems: 'center' },
    nextText: { color: 'white', fontWeight: 'bold' },

    resultCard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.surface,
        margin: 20,
        borderRadius: 20,
        padding: 30
    },
    resultTitle: { color: colors.textSecondary, letterSpacing: 2, marginBottom: 20 },
    scoreText: { color: colors.primary, fontSize: 60, fontWeight: 'bold', marginBottom: 10 },
    resultDesc: { color: colors.text, textAlign: 'center', marginBottom: 40 },
    btn: { backgroundColor: colors.primary, paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30 },
    btnText: { color: 'white', fontWeight: 'bold' }
});

export default QuizScreen;
