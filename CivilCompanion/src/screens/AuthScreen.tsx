import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, Image } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient'; // OLD
import { LinearGradient } from 'expo-linear-gradient'; // NEW
import { colors, gradients } from '../theme/colors';

const AuthScreen = ({ navigation }) => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'Engineer' | 'Student'>('Engineer');

    const handleLogin = () => {
        if (role === 'Engineer') {
            if (userId === 'ENG001' && password === 'admin123') {
                navigation.replace('EngineerDashboard');
            } else {
                Alert.alert('Login Failed', 'Invalid Engineer Credentials');
            }
        } else {
            if (userId === 'STU001' && password === 'learn123') {
                navigation.replace('StudentDashboard');
            } else {
                Alert.alert('Login Failed', 'Invalid Student Credentials');
            }
        }
    };

    return (
        <LinearGradient colors={gradients.surface} style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    <View style={styles.header}>
                        <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
                        <Text style={styles.title}>StructIQ</Text>
                        <Text style={styles.subtitle}>Secure Access Portal</Text>
                    </View>

                    <View style={styles.card}>
                        {/* Role Switcher */}
                        <View style={styles.tabContainer}>
                            <TouchableOpacity
                                style={[styles.tab, role === 'Engineer' && styles.activeTab]}
                                onPress={() => setRole('Engineer')}
                            >
                                <Text style={[styles.tabText, role === 'Engineer' && styles.activeTabText]}>ENGINEER</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tab, role === 'Student' && styles.activeTab]}
                                onPress={() => setRole('Student')}
                            >
                                <Text style={[styles.tabText, role === 'Student' && styles.activeTabText]}>STUDENT</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Inputs */}
                        <View style={styles.form}>
                            <Text style={styles.label}>USER ID</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={role === 'Engineer' ? "Ex: ENG001" : "Ex: STU001"}
                                placeholderTextColor={colors.textSecondary}
                                value={userId}
                                onChangeText={setUserId}
                                autoCapitalize="characters"
                            />

                            <Text style={styles.label}>PASSWORD</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor={colors.textSecondary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />

                            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                                <LinearGradient
                                    colors={role === 'Engineer' ? gradients.primary : gradients.secondary}
                                    style={styles.btnGradient}
                                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                >
                                    <Text style={styles.loginBtnText}>LOGIN DASHBOARD</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.hintBox}>
                            <Text style={styles.hintText}>Demo Credentials:</Text>
                            <Text style={styles.hintText}>{role === 'Engineer' ? 'ENG001 / admin123' : 'STU001 / learn123'}</Text>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
    header: { alignItems: 'center', marginBottom: 40 },
    logoImage: { width: 100, height: 100, marginBottom: 10, resizeMode: 'contain' },
    title: { fontSize: 32, fontWeight: 'bold', color: colors.text, letterSpacing: 2 },
    subtitle: { color: colors.textSecondary, letterSpacing: 1 },

    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
        padding: 20
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 25,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        borderRadius: 10,
        padding: 4
    },
    tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
    activeTab: { backgroundColor: 'rgba(255,255,255,0.1)' },
    tabText: { color: colors.textSecondary, fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
    activeTabText: { color: colors.text },

    form: { gap: 15 },
    label: { color: colors.textSecondary, fontSize: 11, fontWeight: 'bold', letterSpacing: 1, marginLeft: 4 },
    input: {
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 15,
        color: colors.text,
        fontSize: 16
    },
    loginBtn: { marginTop: 10, borderRadius: 12, overflow: 'hidden' },
    btnGradient: { padding: 18, alignItems: 'center' },
    loginBtnText: { color: 'white', fontWeight: 'bold', letterSpacing: 1, fontSize: 14 },

    hintBox: { marginTop: 20, alignItems: 'center', opacity: 0.6 },
    hintText: { color: colors.textSecondary, fontSize: 11 }
});

export default AuthScreen;
