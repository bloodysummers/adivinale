import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Pressable,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/ThemeProvider';
import { useGameStore } from '../store/gameStore';
import type { GameMode } from '../store/gameStore';
import { Text } from './Text';
import { radii, spacing } from '../utils/theme';

const DRAWER_WIDTH = 280;
const ANIMATION_DURATION = 220;

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Drawer({ isOpen, onClose }: DrawerProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const gameMode = useGameStore((s) => s.gameMode);
  const setGameMode = useGameStore((s) => s.setGameMode);

  // `mounted` stays true from first open until close animation fully completes
  const [mounted, setMounted] = useState(false);

  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    }
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: isOpen ? 0 : -DRAWER_WIDTH,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: isOpen ? 1 : 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished && !isOpen) setMounted(false);
    });
  }, [isOpen, translateX, overlayOpacity]);

  useEffect(() => {
    if (!isOpen) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [isOpen, onClose]);

  function navigate(path: string) {
    onClose();
    // Small delay lets the drawer close animation start before navigating
    setTimeout(() => router.push(path as never), 50);
  }

  if (!mounted) return null;

  return (
    <View style={[StyleSheet.absoluteFill, styles.root]} pointerEvents={isOpen ? 'auto' : 'none'}>
      {/* Overlay */}
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.overlay, { opacity: overlayOpacity, backgroundColor: theme.colors.overlay }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Cerrar menú" />
      </Animated.View>

      {/* Drawer panel */}
      <Animated.View
        style={[
          styles.panel,
          {
            width: DRAWER_WIDTH,
            backgroundColor: theme.colors.surface,
            borderRightColor: theme.colors.border,
            transform: [{ translateX }],
          },
        ]}
        accessibilityViewIsModal={isOpen}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <Text variant="heading3" color={theme.colors.primary}>Menú</Text>
        </View>

        {/* Game mode section */}
        <View style={styles.section}>
          <Text variant="label" color={theme.colors.onSurfaceSecondary} style={styles.sectionLabel}>
            MODO DE JUEGO
          </Text>

          <ModeRow
            label="Clásico"
            active={gameMode === 'clasico'}
            onPress={() => setGameMode('clasico')}
            theme={theme}
          />
          <ModeRow
            label="Equipos"
            active={gameMode === 'equipos'}
            onPress={() => setGameMode('equipos')}
            theme={theme}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Navigation section */}
        <View style={styles.section}>
          <NavRow
            icon="⚙️"
            label="Configuración"
            onPress={() => navigate('/settings')}
            theme={theme}
          />
          <NavRow
            icon="💡"
            label="Sugerir respuesta"
            onPress={() => navigate('/submit-answer')}
            theme={theme}
          />
        </View>
      </Animated.View>
    </View>
  );
}

interface ModeRowProps {
  label: string;
  active: boolean;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>['theme'];
}

function ModeRow({ label, active, onPress, theme }: ModeRowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, active && { backgroundColor: theme.colors.surfaceVariant }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text variant="body" color={active ? theme.colors.primary : theme.colors.onSurface}>
        {label}
      </Text>
      <Switch
        value={active}
        onValueChange={onPress}
        trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
        thumbColor={active ? theme.colors.primary : theme.colors.onSurfaceSecondary}
      />
    </TouchableOpacity>
  );
}

interface NavRowProps {
  icon: string;
  label: string;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>['theme'];
}

function NavRow({ icon, label, onPress, theme }: NavRowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.navIcon}>{icon}</Text>
      <Text variant="body" color={theme.colors.onSurface} style={styles.navLabel}>{label}</Text>
      <Text variant="body" color={theme.colors.onSurfaceSecondary}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    zIndex: 100,
  },
  overlay: {
    zIndex: 100,
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 101,
    borderRightWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
  },
  header: {
    paddingTop: spacing[12],
    paddingBottom: spacing[4],
    paddingHorizontal: spacing[6],
    borderBottomWidth: 1,
  },
  section: {
    paddingVertical: spacing[3],
  },
  sectionLabel: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[2],
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: radii.md,
    marginHorizontal: spacing[2],
  },
  navIcon: {
    fontSize: 18,
    marginRight: spacing[3],
  },
  navLabel: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginHorizontal: spacing[4],
  },
});
