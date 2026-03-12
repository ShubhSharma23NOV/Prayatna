import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';

const arHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>&lt;model-viewer&gt; example</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></script>
    <style>
      body { margin: 0; background-color: #0F172A; }
      model-viewer { width: 100vw; height: 100vh; }
    </style>
  </head>
  <body>
    <!-- Use a sample GLB model (Astronaut) as placeholder for Building -->
    <model-viewer 
      src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
      ios-src="https://modelviewer.dev/shared-assets/models/Astronaut.usdz"
      poster="https://modelviewer.dev/shared-assets/models/Astronaut.webp"
      alt="A 3D model of an astronaut"
      shadow-intensity="1"
      camera-controls
      auto-rotate
      ar
    >
    </model-viewer>
  </body>
</html>
`;

const ARScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);

    return (
        <View style={styles.container}>
            <WebView
                originWhitelist={['*']}
                source={{ html: arHtml }}
                style={{ flex: 1, backgroundColor: 'transparent' }}
                onLoadEnd={() => setLoading(false)}
                onShouldStartLoadWithRequest={(request) => {
                    // Handle AR intents (Google Scene Viewer)
                    if (request.url.startsWith('intent://')) {
                        const fallbackUrl = request.url.split('browser_fallback_url=')[1]?.split(';')[0];
                        const cleanUrl = decodeURIComponent(fallbackUrl);

                        // Try to open the intent first
                        Linking.openURL(request.url).catch(() => {
                            // If intent fails (no AR Core), open fallback
                            if (cleanUrl && cleanUrl !== 'undefined') {
                                Linking.openURL(cleanUrl);
                            }
                        });
                        return false; // Stop WebView from loading this URL
                    }
                    return true;
                }}
            />

            {loading && (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ color: colors.textSecondary, marginTop: 10 }}>Loading 3D Engine...</Text>
                </View>
            )}

            {/* Overlay Controls */}
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.btnText}>BACK</Text>
                </TouchableOpacity>

                <View style={styles.tipBox}>
                    <Text style={styles.tipText}>Tap AR icon in corner to place model</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    loader: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background
    },
    overlay: {
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backBtn: {
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border
    },
    btnText: { color: colors.text, fontWeight: 'bold' },
    tipBox: {
        backgroundColor: 'rgba(56, 189, 248, 0.2)', // Primary with opacity
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.primary
    },
    tipText: { color: colors.primary, fontSize: 12, fontWeight: 'bold' }
});

export default ARScreen;
