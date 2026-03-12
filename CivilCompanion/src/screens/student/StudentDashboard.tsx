import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../../theme/colors';

import { Modal } from 'react-native';

const StudentDashboard = ({ navigation, route }) => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [level, setLevel] = React.useState(1);

    // Handle Level Up
    React.useEffect(() => {
        if (route.params?.levelPassed) {
            const { levelPassed } = route.params;
            if (levelPassed === level) {
                setLevel(l => l + 1);
                // Optional: celebration logic or alert here
            }
            navigation.setParams({ levelPassed: null });
        }
    }, [route.params?.levelPassed]);

    const handleLogout = () => {
        setModalVisible(false);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <View style={styles.container}>

            {/* Profile Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={[styles.modalAvatar, { backgroundColor: colors.secondary }]} />
                            <Text style={styles.modalName}>Future Engineer</Text>
                            <Text style={styles.modalRole}>Civil Engineering Student</Text>
                        </View>

                        <View style={styles.modalInfo}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>ID:</Text>
                                <Text style={styles.infoValue}>STU-2024</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Current Level:</Text>
                                <Text style={[styles.infoValue, { color: colors.secondary }]}>Level {level}</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                            <Text style={styles.logoutText}>LOG OUT</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.subtitle}>Welcome, Future Engineeer</Text>
                    <Text style={styles.title}>Learn & Explore</Text>
                </View>
                <TouchableOpacity style={styles.badge} onPress={() => setModalVisible(true)}>
                    <Text style={styles.badgeText}>LVL {level}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Daily Challenge */}
                <TouchableOpacity
                    style={styles.challengeCard}
                    onPress={() => navigation.navigate('Quiz', { level })}
                >
                    <LinearGradient colors={gradients.secondary} style={styles.challengeGradient}>
                        <Text style={styles.challengeLabel}>CURRENT LEVEL: {level}</Text>
                        <Text style={styles.challengeTitle}>
                            {level === 1 ? 'Fundamentals of IS Codes' :
                                level === 2 ? 'Seismic Waves & Soil' :
                                    'Advanced Structural Dynamics'}
                        </Text>
                        <Text style={styles.challengeBtn}>START QUIZ →</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Learning Modules */}
                <Text style={styles.sectionTitle}>LEARNING PATH</Text>

                <View style={styles.moduleRow}>
                    <TouchableOpacity
                        style={styles.moduleCard}
                        onPress={() => navigation.navigate('LearningDetail', { moduleId: 'seismic-zones' })}
                    >
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(56, 189, 248, 0.2)' }]}>
                            <Text style={styles.icon}>🗺️</Text>
                        </View>
                        <Text style={styles.moduleTitle}>Seismic Zones</Text>
                        <Text style={styles.moduleDesc}>IS 1893 Part 1</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.moduleCard}
                        onPress={() => navigation.navigate('LearningDetail', { moduleId: 'ductility' })}
                    >
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(234, 179, 8, 0.2)' }]}>
                            <Text style={styles.icon}>🏗️</Text>
                        </View>
                        <Text style={styles.moduleTitle}>Ductility</Text>
                        <Text style={styles.moduleDesc}>IS 13920</Text>
                    </TouchableOpacity>
                </View>

                {/* AR Lab */}
                <Text style={styles.sectionTitle}>VIRTUAL LAB</Text>
                <TouchableOpacity
                    style={styles.labCard}
                    onPress={() => navigation.navigate('BIMViewer', { title: 'AR Structural Anatomy' })}
                >
                    <LinearGradient colors={['#1E293B', '#334155']} style={styles.labGradient}>
                        <Text style={styles.labTitle}>AR Structural Anatomy</Text>
                        <Text style={styles.labDesc}>Visualize beams, columns, and load paths in 3D.</Text>
                        <TouchableOpacity style={styles.labBtn}>
                            <Text style={styles.labBtnText}>ENTER LAB</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 70
    },
    subtitle: { color: colors.secondary, fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
    title: { color: colors.text, fontSize: 26, fontWeight: 'bold' },
    badge: {
        backgroundColor: 'rgba(168, 85, 247, 0.2)',
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.secondary
    },
    badgeText: { color: colors.secondary, fontWeight: 'bold' },

    scrollContent: { padding: 20 },

    challengeCard: { height: 160, borderRadius: 20, overflow: 'hidden', marginBottom: 30 },
    challengeGradient: { flex: 1, padding: 20, justifyContent: 'center' },
    challengeLabel: { color: 'rgba(255,255,255,0.8)', fontWeight: 'bold', fontSize: 12, marginBottom: 5 },
    challengeTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
    challengeBtn: { color: 'white', fontWeight: 'bold' },

    sectionTitle: { color: colors.textSecondary, fontWeight: 'bold', marginBottom: 15, letterSpacing: 1 },

    moduleRow: { flexDirection: 'row', gap: 15, marginBottom: 30 },
    moduleCard: {
        flex: 1,
        backgroundColor: colors.surface,
        padding: 15,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border
    },
    iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    icon: { fontSize: 20 },
    moduleTitle: { color: colors.text, fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
    moduleDesc: { color: colors.textSecondary, fontSize: 12 },

    labCard: { height: 180, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
    labGradient: { flex: 1, padding: 20, justifyContent: 'flex-end' },
    labTitle: { color: colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
    labDesc: { color: colors.textSecondary, fontSize: 14, marginBottom: 15 },
    labBtn: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignSelf: 'flex-start' },
    labBtnText: { color: colors.background, fontWeight: 'bold' },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: colors.surface,
        width: '100%',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border
    },
    modalHeader: { alignItems: 'center', marginBottom: 20 },
    modalAvatar: {
        width: 80, height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary,
        marginBottom: 10
    },
    modalName: { color: colors.text, fontSize: 22, fontWeight: 'bold' },
    modalRole: { color: colors.textSecondary, fontSize: 14 },

    modalInfo: { backgroundColor: colors.background, borderRadius: 12, padding: 15, marginBottom: 20 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    infoLabel: { color: colors.textSecondary },
    infoValue: { color: colors.text, fontWeight: 'bold' },

    logoutBtn: {
        backgroundColor: colors.error,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 10
    },
    logoutText: { color: 'white', fontWeight: 'bold', letterSpacing: 1 },
    closeBtn: { padding: 15, alignItems: 'center' },
    closeText: { color: colors.textSecondary }
});

export default StudentDashboard;
