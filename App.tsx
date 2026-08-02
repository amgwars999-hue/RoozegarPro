import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider, useTheme } from '@/theme/ThemeContext';
import CalendarScreen from '@/screens/CalendarScreen';
import DayDetailScreen from '@/screens/DayDetailScreen';
import SettingsScreen from '@/screens/SettingsScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  const { theme } = useTheme();
  
  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: theme.background },
            transitionSpec: {
              open: { animation: 'timing', config: { duration: 300 } },
              close: { animation: 'timing', config: { duration: 300 } },
            },
          }}
        >
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          <Stack.Screen 
            name="DayDetail" 
            component={DayDetailScreen}
            options={{
              gestureEnabled: true,
              cardStyle: { backgroundColor: theme.background },
            }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              gestureEnabled: true,
              presentation: 'modal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}
