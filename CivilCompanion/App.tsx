import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthScreen from './src/screens/AuthScreen';
import ARScreen from './src/screens/common/ARScreen';
import EngineerDashboard from './src/screens/engineer/EngineerDashboard';
import QuickScanScreen from './src/screens/engineer/QuickScanScreen';
import ReportDetailScreen from './src/screens/engineer/ReportDetailScreen';
import StudentDashboard from './src/screens/student/StudentDashboard';
import QuizScreen from './src/screens/student/QuizScreen';


import LearningDetailScreen from './src/screens/student/LearningDetailScreen';
import BIMViewerScreen from './src/screens/engineer/BIMViewerScreen';

// Types
export type RootStackParamList = {
  Login: undefined;
  EngineerDashboard: undefined;
  StudentDashboard: undefined;
  ARScreen: undefined;
  QuickScan: undefined;
  Quiz: undefined;
  ReportDetail: { reportData: any };
  LearningDetail: { moduleId: string };
  BIMViewer: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={AuthScreen} />
        <Stack.Screen name="EngineerDashboard" component={EngineerDashboard} />
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
        <Stack.Screen name="QuickScan" component={QuickScanScreen} />
        <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
        <Stack.Screen name="LearningDetail" component={LearningDetailScreen} />
        <Stack.Screen name="BIMViewer" component={BIMViewerScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="ARScreen" component={ARScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
