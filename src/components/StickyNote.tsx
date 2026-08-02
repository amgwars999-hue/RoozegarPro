import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { NoteDesign } from '@/types';
import { useTheme } from '@/theme/ThemeContext';

interface StickyNoteProps {
  design: NoteDesign;
  children: React.ReactNode;
  width?: number;
  height?: number;
  onPress?: () => void;
  style?: any;
}

export default function StickyNote({ design, children, width = 160, height = 120, onPress, style }: StickyNoteProps) {
  const { theme } = useTheme();
  const cornerSize = 24;

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper activeOpacity={0.9} onPress={onPress} style={[styles.container, { width, height }, style]}>
      {/* Main background */}
      <View style={[styles.bg, { backgroundColor: design.backgroundColor, width, height }]}>
        {/* Grid pattern overlay */}
        <View style={[styles.gridOverlay, { opacity: 0.15 }]} pointerEvents="none">
          {Array.from({ length: Math.floor(height / 12) }).map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridH, { top: i * 12, backgroundColor: design.gridColor }]} />
          ))}
          {Array.from({ length: Math.floor(width / 12) }).map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridV, { left: i * 12, backgroundColor: design.gridColor }]} />
          ))}
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          {children}
        </View>

        {/* Curled corner */}
        <View style={[styles.cornerContainer, { width: cornerSize, height: cornerSize }]} pointerEvents="none">
          <Svg width={cornerSize} height={cornerSize} viewBox={`0 0 ${cornerSize} ${cornerSize}`}>
            <Defs>
              <LinearGradient id="curlGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={design.accentColor} stopOpacity="0.9" />
                <Stop offset="1" stopColor={design.backgroundColor} stopOpacity="0.3" />
              </LinearGradient>
            </Defs>
            <Path
              d={`M0,${cornerSize} L${cornerSize},${cornerSize} L${cornerSize},0 Q${cornerSize * 0.3},${cornerSize * 0.3} 0,${cornerSize} Z`}
              fill="url(#curlGrad)"
            />
            <Path
              d={`M${cornerSize},0 Q${cornerSize * 0.6},${cornerSize * 0.4} ${cornerSize * 0.2},${cornerSize * 0.8}`}
              stroke={design.gridColor}
              strokeWidth="0.5"
              fill="none"
              opacity={0.4}
            />
          </Svg>
        </View>
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  bg: {
    borderRadius: 12,
    position: 'relative',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 12,
  },
  gridH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
  gridV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
  },
  content: {
    flex: 1,
    padding: 12,
    paddingBottom: 16,
  },
  cornerContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
