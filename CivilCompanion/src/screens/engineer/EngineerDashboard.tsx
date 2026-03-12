import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../../theme/colors';

import { Modal } from 'react-native';

const EngineerDashboard = ({ navigation, route }) => {
    // Initial Mock Data
    const [reports, setReports] = React.useState([
        { id: 1, name: 'Project Alpha', zone: 'Zone V', status: 'Critical', color: '#EF4444' },
        { id: 2, name: 'Skyline Towers', zone: 'Zone IV', status: 'High Risk', color: '#F59E0B' },
        { id: 3, name: 'Metro Station', zone: 'Zone III', status: 'Medium Risk', color: '#10B981' },
        { id: 4, name: 'City Library', zone: 'Zone II', status: 'Low Risk', color: '#3B82F6' },
    ]);

    const [modalVisible, setModalVisible] = React.useState(false);

    // Handle new report or deleted report
    React.useEffect(() => {
        if (route.params?.newReport) {
            const { newReport } = route.params;
            setReports(prev => {
                const exists = prev.find(r => r.id === newReport.id);
                if (exists) return prev;
                return [newReport, ...prev];
            });
            navigation.setParams({ newReport: null });
        }

        if (route.params?.deletedReportId) {
            const { deletedReportId } = route.params;
            setReports(prev => prev.filter(r => r.id !== deletedReportId));
            navigation.setParams({ deletedReportId: null });
        }
    }, [route.params?.newReport, route.params?.deletedReportId]);

    const handleLogout = () => {
        setModalVisible(false);
        // Reset navigation to Auth screen
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

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
                            <View style={styles.modalAvatar} />
                            <Text style={styles.modalName}>Engr. Architect</Text>
                            <Text style={styles.modalRole}>Senior Structural Engineer</Text>
                        </View>

                        <View style={styles.modalInfo}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>ID:</Text>
                                <Text style={styles.infoValue}>ENG-8821</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Department:</Text>
                                <Text style={styles.infoValue}>Seismic Safety</Text>
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
                    <Text style={styles.welcome}>Welcome back,</Text>
                    <Text style={styles.name}>Engr. Architect</Text>
                </View>
                <TouchableOpacity style={styles.profileBtn} onPress={() => setModalVisible(true)}>
                    <View style={styles.avatar} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Quick Actions Grid */}
                <Text style={styles.sectionTitle}>TOOLS</Text>
                <View style={styles.grid}>
                    <TouchableOpacity
                        style={[styles.card, styles.actionCard]}
                        onPress={() => navigation.navigate('QuickScan')}
                    >
                        <LinearGradient colors={gradients.primary} style={styles.cardGradient}>
                            <Text style={styles.actionIcon}>⚡</Text>
                            <Text style={styles.actionTitle}>Quick Scan</Text>
                            <Text style={styles.actionDesc}>Instant Safety Score</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.card, styles.actionCard]}
                        onPress={() => navigation.navigate('BIMViewer')}
                    >
                        <LinearGradient colors={['#7E22CE', '#A855F7']} style={styles.cardGradient}>
                            <Text style={styles.actionIcon}>📱</Text>
                            <Text style={styles.actionTitle}>Site AR & BIM</Text>
                            <Text style={styles.actionDesc}>IFC Model & Site Viz</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Recent Projects */}
                <Text style={styles.sectionTitle}>RECENT REPORTS</Text>
                <View style={styles.reportList}>
                    {reports.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.reportItem}
                            onPress={() => navigation.navigate('ReportDetail', { reportData: item })}
                        >
                            <View style={[styles.reportIcon, { backgroundColor: `${item.color}20` }]}>
                                <Text style={{ fontSize: 20 }}>📄</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.reportTitle}>{item.name}</Text>
                                <Text style={styles.reportMeta}>{item.zone}  •  {item.date || new Date().toLocaleDateString()}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end', gap: 5 }}>
                                <Text style={[styles.reportStatus, { color: item.color }]}>{item.status}</Text>

                                <TouchableOpacity
                                    style={{ backgroundColor: colors.surfaceLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}
                                    onPress={() => navigation.navigate('BIMViewer', {
                                        linkedModel: item.linkedModel || `${item.name}.ifc`,
                                        linkedModelUri: item.linkedModelUri
                                    })}
                                >
                                    <Text style={{ fontSize: 10, color: colors.text, fontWeight: 'bold' }}>🧊 Model</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}
                    {reports.length === 0 && (
                        <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 20 }}>No reports found.</Text>
                    )}
                </View>

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
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingTop: 70
    },
    welcome: { color: colors.textSecondary, fontSize: 14 },
    name: { color: colors.text, fontSize: 20, fontWeight: 'bold' },
    profileBtn: { padding: 5 },
    avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary },

    scrollContent: { padding: 20 },

    sectionTitle: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 15,
        marginTop: 10
    },
    grid: { flexDirection: 'row', gap: 15, marginBottom: 30 },
    card: { flex: 1, height: 140, borderRadius: 16, overflow: 'hidden' },
    actionCard: {},
    cardGradient: { flex: 1, padding: 15, justifyContent: 'flex-end' },
    actionIcon: { fontSize: 32, marginBottom: 'auto' },
    actionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    actionDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },

    reportList: { gap: 10 },
    reportItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border
    },
    reportIcon: {
        width: 40, height: 40,
        backgroundColor: colors.surfaceLight,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    reportTitle: { color: colors.text, fontWeight: 'bold', fontSize: 16 },
    reportMeta: { color: colors.textSecondary, fontSize: 12 },
    reportStatus: { color: colors.error, fontWeight: 'bold', fontSize: 12 },

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

export default EngineerDashboard;
