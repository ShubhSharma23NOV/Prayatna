import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../../theme/colors';
import { calculateQuickRisk } from '../../logic/quickRisk';
import * as DocumentPicker from 'expo-document-picker';

const InputField = ({ label, value, onChange, placeholder, numeric = false }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            keyboardType={numeric ? 'numeric' : 'default'}
        />
    </View>
);

const OptionBtn = ({ label, selected, onPress }) => (
    <TouchableOpacity
        style={[styles.optionBtn, selected && styles.optionBtnSelected]}
        onPress={onPress}
    >
        <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{label}</Text>
    </TouchableOpacity>
);

const QuickScanScreen = ({ navigation }) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);

    const [form, setForm] = useState({
        zone: 'IV',
        soil: 'Soft',
        storeys: '10',
        structuralSystem: 'RCC',
        regularity: 'Regular',
        groundwater: 'Medium'
    });

    const updateForm = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    const handleAnalyze = () => {
        setIsLoading(true);
        setTimeout(() => {
            const res = calculateQuickRisk({
                ...form,
                storeys: parseInt(form.storeys) || 0
            });
            setResult(res);
            setIsLoading(false);
            setStep(2);
        }, 1500); // Fake delay for "AI Computing" effect
    };

    const reset = () => {
        setResult(null);
        setStep(1);
    };

    const renderInputForm = () => (
        <ScrollView contentContainerStyle={styles.formContent}>
            <Text style={styles.heading}>Site Parameters</Text>

            <Text style={styles.label}>Seismic Zone</Text>
            <View style={styles.optionsRow}>
                {['II', 'III', 'IV', 'V'].map(z => (
                    <OptionBtn key={z} label={z} selected={form.zone === z} onPress={() => updateForm('zone', z)} />
                ))}
            </View>

            <Text style={styles.label}>Soil Type</Text>
            <View style={styles.optionsRow}>
                {['Hard', 'Medium', 'Soft'].map(s => (
                    <OptionBtn key={s} label={s} selected={form.soil === s} onPress={() => updateForm('soil', s)} />
                ))}
            </View>

            <InputField
                label="Number of Storeys"
                value={form.storeys}
                onChange={t => updateForm('storeys', t)}
                placeholder="e.g. 10"
                numeric
            />

            <Text style={styles.label}>Structure System</Text>
            <View style={styles.optionsRow}>
                {['RCC', 'Dual', 'LoadBearing'].map(s => (
                    <OptionBtn key={s} label={s === 'LoadBearing' ? 'Load Brg' : s} selected={form.structuralSystem === s} onPress={() => updateForm('structuralSystem', s)} />
                ))}
            </View>

            <Text style={styles.label}>Plan Regularity</Text>
            <View style={styles.optionsRow}>
                {['Regular', 'Irregular'].map(r => (
                    <OptionBtn key={r} label={r} selected={form.regularity === r} onPress={() => updateForm('regularity', r)} />
                ))}
            </View>

            <TouchableOpacity style={styles.analyzeBtn} onPress={handleAnalyze}>
                <LinearGradient colors={gradients.primary} style={styles.analyzeGradient}>
                    <Text style={styles.analyzeText}>ANALYZE RISK</Text>
                </LinearGradient>
            </TouchableOpacity>
        </ScrollView>
    );

    const [projectName, setProjectName] = useState('');
    const [bimFile, setBimFile] = useState(null);

    const handleUploadBIM = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*', // Ideally .ifc
                copyToCacheDirectory: true
            });

            if (result.assets && result.assets.length > 0) {
                setBimFile(result.assets[0]);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleSave = () => {
        if (!projectName.trim()) {
            alert('Please enter a project name');
            return;
        }

        const newReport = {
            id: Date.now(), // Simple unique ID
            name: projectName,
            zone: `Zone ${form.zone}`,
            status: result.label, // 'High', 'Medium', etc.
            color: result.color,
            date: new Date().toLocaleDateString(),
            linkedModel: bimFile ? bimFile.name : null,
            linkedModelUri: bimFile ? bimFile.uri : null
        };

        // Navigate back to Dashboard with the new report
        navigation.navigate('EngineerDashboard', { newReport });
    };

    const renderResult = () => (
        <View style={styles.resultContainer}>
            <View style={[styles.gaugeContainer, { borderColor: result.color }]}>
                <Text style={[styles.scoreText, { color: result.color }]}>{result.score}</Text>
                <Text style={styles.scoreLabel}>RISK SCORE</Text>
            </View>

            <Text style={[styles.resultTitle, { color: result.color }]}>{result.label.toUpperCase()} RISK</Text>

            <View style={styles.resultCard}>
                <Text style={styles.resultDesc}>
                    Based on Zone {form.zone} and {form.soil} soil, this site requires
                    {result.score > 60 ? ' special attention to ductility and damping.' : ' standard seismic detailing.'}
                </Text>
            </View>

            <View style={styles.saveContainer}>
                <TextInput
                    style={styles.saveInput}
                    placeholder="Enter Project Name"
                    placeholderTextColor={colors.textSecondary}
                    value={projectName}
                    onChangeText={setProjectName}
                />

                <TouchableOpacity
                    style={[styles.outlineBtn, { borderColor: colors.primary, marginBottom: 10 }]}
                    onPress={handleUploadBIM}
                >
                    <Text style={{ color: colors.primary }}>
                        {bimFile ? `📄 ${bimFile.name}` : '📂 Upload BIM Model (Optional)'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>SAVE PROJECT</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.outlineBtn} onPress={() => navigation.navigate('ARScreen')}>
                <Text style={styles.outlineBtnText}>View in AR Mode</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.textBtn} onPress={reset}>
                <Text style={styles.textBtnText}>Start New Scan</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            {isLoading ? (
                <View style={styles.loader}>
                    <Text style={styles.loadingText}>Analyzing Structure...</Text>
                </View>
            ) : (
                step === 1 ? renderInputForm() : renderResult()
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, paddingTop: 70, paddingHorizontal: 20 },
    backBtn: { marginBottom: 20 },
    backText: { color: colors.textSecondary },
    heading: { color: colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 20 },

    formContent: { paddingBottom: 40 },
    inputContainer: { marginBottom: 20 },
    label: { color: colors.textSecondary, marginBottom: 10, fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
    input: {
        backgroundColor: colors.surface,
        color: colors.text,
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border
    },

    optionsRow: { flexDirection: 'row', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
    optionBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface
    },
    optionBtnSelected: {
        backgroundColor: 'rgba(56, 189, 248, 0.2)',
        borderColor: colors.primary
    },
    optionText: { color: colors.textSecondary },
    optionTextSelected: { color: colors.primary, fontWeight: 'bold' },

    analyzeBtn: { marginTop: 20, borderRadius: 12, overflow: 'hidden' },
    analyzeGradient: { padding: 18, alignItems: 'center' },
    analyzeText: { color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 2 },

    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: colors.primary, fontSize: 18, marginTop: 20 },

    resultContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    gaugeContainer: {
        width: 200, height: 200,
        borderRadius: 100,
        borderWidth: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
    },
    scoreText: { fontSize: 60, fontWeight: 'bold' },
    scoreLabel: { color: colors.textSecondary, fontSize: 12, letterSpacing: 2 },
    resultTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, letterSpacing: 3 },
    resultCard: {
        backgroundColor: colors.surface,
        padding: 20,
        borderRadius: 12,
        marginBottom: 30,
        width: '100%'
    },
    resultDesc: { color: colors.text, textAlign: 'center', lineHeight: 22 },

    saveContainer: { width: '100%', marginBottom: 20, gap: 10 },
    saveInput: {
        backgroundColor: colors.surface,
        color: colors.text,
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border
    },
    saveBtn: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center'
    },
    saveBtnText: { color: 'white', fontWeight: 'bold' },

    outlineBtn: {
        width: '100%',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.textSecondary,
        alignItems: 'center',
        marginBottom: 15
    },
    outlineBtnText: { color: colors.text },
    textBtn: { padding: 10 },
    textBtnText: { color: colors.textSecondary }
});

export default QuickScanScreen;
