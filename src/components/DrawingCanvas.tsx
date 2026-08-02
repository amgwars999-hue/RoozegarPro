import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface Point {
  x: number;
  y: number;
}

interface DrawingPath {
  id: string;
  color: string;
  strokeWidth: number;
  points: Point[];
}

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  paths?: DrawingPath[];
  onPathsChange?: (paths: DrawingPath[]) => void;
  strokeColor?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  readOnly?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export default function DrawingCanvas({
  width = screenWidth - 32,
  height = 300,
  paths: externalPaths,
  onPathsChange,
  strokeColor = '#1a1a1a',
  strokeWidth = 2.5,
  backgroundColor = '#F5F0D0',
  readOnly = false,
}: DrawingCanvasProps) {
  const [paths, setPaths] = useState<DrawingPath[]>(externalPaths || []);
  const currentPath = useRef<Point[]>([]);
  const pathIdCounter = useRef(0);

  const updatePaths = useCallback((newPaths: DrawingPath[]) => {
    setPaths(newPaths);
    onPathsChange?.(newPaths);
  }, [onPathsChange]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !readOnly,
      onMoveShouldSetPanResponder: () => !readOnly,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPath.current = [{ x: locationX, y: locationY }];
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPath.current.push({ x: locationX, y: locationY });
        
        // Force re-render to show live drawing
        const livePath: DrawingPath = {
          id: 'live',
          color: strokeColor,
          strokeWidth,
          points: currentPath.current,
        };
        setPaths(prev => [...prev.filter(p => p.id !== 'live'), livePath]);
      },
      onPanResponderRelease: () => {
        if (currentPath.current.length < 2) return;
        pathIdCounter.current += 1;
        const newPath: DrawingPath = {
          id: `path-${pathIdCounter.current}`,
          color: strokeColor,
          strokeWidth,
          points: [...currentPath.current],
        };
        updatePaths([...paths.filter(p => p.id !== 'live'), newPath]);
        currentPath.current = [];
      },
    })
  ).current;

  const pointsToSvgPath = (points: Point[]): string => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  };

  return (
    <View style={[styles.container, { width, height, backgroundColor }]}>
      {/* Grid background */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {Array.from({ length: Math.floor(height / 20) }).map((_, i) => (
          <View key={`gh-${i}`} style={[styles.gridLineH, { top: i * 20 }]} />
        ))}
        {Array.from({ length: Math.floor(width / 20) }).map((_, i) => (
          <View key={`gv-${i}`} style={[styles.gridLineV, { left: i * 20 }]} />
        ))}
      </View>
      
      <View style={StyleSheet.absoluteFillObject} {...panResponder.panHandlers}>
        <Svg width={width} height={height}>
          {paths.map(path => (
            <Path
              key={path.id}
              d={pointsToSvgPath(path.points)}
              stroke={path.color}
              strokeWidth={path.strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
});
