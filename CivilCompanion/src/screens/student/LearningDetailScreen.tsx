import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../../theme/colors';

const LEARNING_CONTENT = {
    'seismic-zones': {
        title: 'Seismic Zones of India',
        subtitle: 'IS 1893 (Part 1): 2016',
        icon: '🗺️',
        color: '#38BDF8',
        sections: [
            {
                heading: 'Overview',
                text: 'India is divided into 4 seismic zones (II, III, IV, and V) based on the peak ground acceleration that a structure can expect during an earthquake. Zone V is the most seismically active, while Zone II is the least.'
            },
            {
                heading: 'Zone Factors (Z)',
                text: '• Zone V: Z = 0.36 (High Risk)\n• Zone IV: Z = 0.24 (Severe Intensity)\n• Zone III: Z = 0.16 (Moderate Intensity)\n• Zone II: Z = 0.10 (Low Intensity)'
            },
            {
                heading: 'Design Philosophy',
                text: 'Structures in higher zones must be designed for higher lateral forces. The design base shear is directly proportional to the Zone Factor (Z).'
            }
        ]
    },
    'ductility': {
        title: 'Ductile Detailing',
        subtitle: 'IS 13920: 2016',
        icon: '🏗️',
        color: '#EAB308',
        sections: [
            {
                heading: 'What is Ductility?',
                text: 'Ductility is the ability of a structure to undergo large deformations beyond its yield point without collapsing. This is crucial for earthquake resistance.'
            },
            {
                heading: 'Key Provisions',
                text: '1. Strong Column - Weak Beam: Columns should be stronger than beams to prevent storey mechanisms.\n2. Closely Spaced Stirrups: In potential plastic hinge regions (near joints), stirrups must be closely spaced (e.g., 100mm) to confine concrete.'
            },
            {
                heading: 'Why it Matters',
                text: 'A ductile building absorbs energy through damage (cracking, yielding) but remains standing, saving lives during a major earthquake.'
            }
        ]
    }
};

const LearningDetailScreen = ({ navigation, route }) => {
    const { moduleId } = route.params;
    const content = LEARNING_CONTENT[moduleId];

    if (!content) return null;

    return (
        <View style={styles.container}>
            <LinearGradient colors={[colors.surface, colors.background]} style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <View style={[styles.iconBox, { backgroundColor: `${content.color}20` }]}>
                    <Text style={styles.icon}>{content.icon}</Text>
                </View>
                <Text style={styles.title}>{content.title}</Text>
                <Text style={styles.subtitle}>{content.subtitle}</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                {content.sections.map((section, index) => (
                    <View key={index} style={styles.section}>
                        <Text style={[styles.heading, { color: content.color }]}>{section.heading}</Text>
                        <Text style={styles.text}>{section.text}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { padding: 20, paddingTop: 50, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
    backBtn: { alignSelf: 'flex-start', marginBottom: 10 },
    backText: { color: colors.textSecondary, fontSize: 16 },
    iconBox: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    icon: { fontSize: 30 },
    title: { color: colors.text, fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
    subtitle: { color: colors.textSecondary, fontSize: 14 },

    content: { padding: 20 },
    section: { marginBottom: 25, backgroundColor: colors.surface, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
    heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    text: { color: colors.textSecondary, lineHeight: 24, fontSize: 14 }
});

export default LearningDetailScreen;
