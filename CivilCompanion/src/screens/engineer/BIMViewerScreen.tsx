import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../../theme/colors';
import { BIM_HTML } from './BIMViewerHtml';

const BIMViewerScreen = ({ navigation, route }) => {
    const webViewRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState('No Model Uploaded');
    const [sliceValue, setSliceValue] = useState(1.0); // 0 to 1
    const [activeTab, setActiveTab] = useState('controls'); // controls, layers, info
    const [arMode, setArMode] = useState(false);

    // Check for linked models
    // Check for linked models
    React.useEffect(() => {
        const loadLinkedModel = async () => {
            if (route.params?.linkedModel && route.params?.linkedModelUri) {
                setFileName(route.params.linkedModel);
                setLoading(true);

                try {
                    // Read file as Base64
                    const base64 = await FileSystem.readAsStringAsync(route.params.linkedModelUri, {
                        encoding: 'base64'
                    });

                    setTimeout(() => {
                        // Inject into WebView
                        sendCommand('LOAD_MODEL', base64);
                        setLoading(false);
                        Alert.alert("Linked Model", `Loaded: ${route.params.linkedModel}`);
                    }, 1500); // Wait for WebView init
                } catch (e) {
                    console.error("Failed to load model", e);
                    setLoading(false);
                    Alert.alert("Error", "Could not load linked model file.");
                }
            } else if (route.params?.linkedModel) {
                // Fallback for legacy items (just name)
                setFileName(route.params.linkedModel);
            }
        };

        loadLinkedModel();
    }, [route.params?.linkedModel]);

    const handleUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*', // Ideally .ifc
                copyToCacheDirectory: true
            });

            if (result.assets && result.assets.length > 0) {
                const file = result.assets[0];
                setFileName(file.name);
                setLoading(true);

                try {
                    // Check file info
                    console.log('Reading file:', file.uri);

                    const base64 = await FileSystem.readAsStringAsync(file.uri, {
                        encoding: FileSystem.EncodingType.Base64
                    });

                    console.log('File read success. Base64 length:', base64.length);

                    // Simulate processing time
                    setTimeout(async () => {
                        // sendCommand('LOAD_MODEL', base64);
                        await sendFileInChunks(base64);
                        setLoading(false);
                    }, 500);
                } catch (e) {
                    console.error("FileSystem Read Error:", e);
                    setLoading(false);
                    Alert.alert("Error", "Failed to read the file. Please try again.");
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    const sendCommand = (type, value) => {
        const payload = JSON.stringify({ type, value });
        webViewRef.current?.postMessage(payload);
    };

    const sendFileInChunks = async (base64Data) => {
        const CHUNK_SIZE = 500 * 1024; // 500KB chunks
        const totalChunks = Math.ceil(base64Data.length / CHUNK_SIZE);

        for (let i = 0; i < totalChunks; i++) {
            const chunk = base64Data.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
            sendCommand('CHUNK', {
                data: chunk,
                index: i,
                total: totalChunks
            });
            // Small delay to prevent overwhelming the bridge
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    };

    const handleSlice = (val) => {
        let newVal = sliceValue + val;
        if (newVal > 1) newVal = 1;
        if (newVal < 0) newVal = 0;
        setSliceValue(newVal);
        sendCommand('SLICE', newVal);
    };

    const toggleAR = () => {
        const newState = !arMode;
        setArMode(newState);
        sendCommand('TOGGLE_AR', newState);
    };

    return (
        <View style={styles.container}>
            {/* Top Bar with Civil UI */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {arMode ? 'Site AR Mode 📱' : (route.params?.title || 'BIM Structural Analyzer')}
                </Text>
                <TouchableOpacity onPress={handleUpload} style={styles.uploadBtn}>
                    <Text style={styles.uploadText}>📂 Import IFC</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.body}>
                {/* Left Panel: Quick Controls */}
                <View style={styles.leftPanel}>
                    <ControlIcon icon="🔄" label="Reset" onPress={() => sendCommand('RESET_VIEW')} />
                    <ControlIcon icon="📏" label="Measure" />
                    <ControlIcon
                        icon={arMode ? "🧊" : "📱"}
                        label={arMode ? "3D View" : "AR View"}
                        onPress={toggleAR}
                        active={arMode}
                    />
                    <ControlIcon icon="📐" label="Section" onPress={() => setActiveTab('controls')} />
                    <ControlIcon icon="🏗️" label="Layers" onPress={() => setActiveTab('layers')} />
                </View>

                {/* Main Viewport */}
                <View style={styles.viewport}>
                    <WebView
                        ref={webViewRef}
                        originWhitelist={['*']}
                        source={{ html: BIM_HTML }}
                        style={{ flex: 1, backgroundColor: '#0f172a' }}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        allowFileAccess={true}
                        allowUniversalAccessFromFileURLs={true}
                        mixedContentMode="always"
                    />

                    {/* Overlay: Current file info */}
                    <View style={styles.fileInfo}>
                        <Text style={styles.fileName}>{fileName}</Text>
                        {loading && <Text style={styles.loadingText}>Loading Model... 🏗️</Text>}
                    </View>
                </View>

                {/* Right Panel: Contextual Tools */}
                <View style={styles.rightPanel}>
                    {activeTab === 'controls' && (
                        <View>
                            <Text style={styles.panelTitle}>SECTION CUT</Text>
                            <Text style={styles.panelLabel}>Top-Down Slice</Text>
                            <View style={styles.sliderContainer}>
                                <TouchableOpacity onPress={() => handleSlice(-0.1)} style={styles.sliderBtn}><Text style={styles.btnTxt}>▼</Text></TouchableOpacity>
                                <Text style={styles.sliderVal}>{Math.round(sliceValue * 100)}%</Text>
                                <TouchableOpacity onPress={() => handleSlice(0.1)} style={styles.sliderBtn}><Text style={styles.btnTxt}>▲</Text></TouchableOpacity>
                            </View>

                            <Text style={[styles.panelTitle, { marginTop: 20 }]}>VISUALIZATION</Text>
                            <TouchableOpacity style={styles.toggleBtn}>
                                <Text style={styles.toggleText}>Risk Zones: ON</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.toggleBtn}>
                                <Text style={styles.toggleText}>Foundations: AUTO</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {activeTab === 'layers' && (
                        <View>
                            <Text style={styles.panelTitle}>ELEMENT LAYERS</Text>
                            {['Columns', 'Beams', 'Slabs', 'Walls', 'Stairs'].map(layer => (
                                <View key={layer} style={styles.layerRow}>
                                    <Text style={styles.layerName}>{layer}</Text>
                                    <TouchableOpacity style={styles.checkBtn}>
                                        <Text style={{ color: colors.primary }}>👁️</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

const ControlIcon = ({ icon, label, onPress = () => { }, active = false }) => (
    <TouchableOpacity
        style={[styles.controlIcon, active && { backgroundColor: `${colors.primary}40`, borderRadius: 8, padding: 5 }]}
        onPress={onPress}
    >
        <Text style={{ fontSize: 24, marginBottom: 5 }}>{icon}</Text>
        <Text style={{ color: 'white', fontSize: 10 }}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 70, paddingBottom: 15, paddingHorizontal: 20,
        backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border
    },
    backBtn: { padding: 5 },
    backText: { color: colors.textSecondary },
    headerTitle: { color: colors.text, fontWeight: 'bold', fontSize: 16 },
    uploadBtn: { backgroundColor: colors.primary, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
    uploadText: { color: 'white', fontWeight: 'bold', fontSize: 12 },

    body: { flex: 1, flexDirection: 'row' },

    leftPanel: { width: 60, backgroundColor: colors.surface, paddingVertical: 20, alignItems: 'center', gap: 20 },
    controlIcon: { alignItems: 'center', opacity: 0.8 },

    viewport: { flex: 1, position: 'relative' },
    fileInfo: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 6 },
    fileName: { color: 'white', fontSize: 12 },
    loadingText: { color: colors.primary, fontSize: 12, fontWeight: 'bold', marginTop: 5 },

    rightPanel: { width: 140, backgroundColor: colors.surface, padding: 15, borderLeftWidth: 1, borderLeftColor: colors.border },
    panelTitle: { color: colors.textSecondary, fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginBottom: 10 },
    panelLabel: { color: 'white', fontSize: 12, marginBottom: 5 },

    sliderContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.background, borderRadius: 8, padding: 5 },
    sliderBtn: { padding: 5 },
    btnTxt: { color: colors.primary, fontWeight: 'bold' },
    sliderVal: { color: 'white', fontWeight: 'bold' },

    toggleBtn: { backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: 10, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: colors.primary },
    toggleText: { color: colors.primary, fontSize: 11, fontWeight: 'bold', textAlign: 'center' },

    layerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
    layerName: { color: 'white', fontSize: 12 },
    checkBtn: { padding: 2 }
});

export default BIMViewerScreen;
