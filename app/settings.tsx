import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../src/components/Text';
import { useTheme } from '../src/theme/ThemeProvider';
import { useCalibration, CALIBRATION_MIN, CALIBRATION_MAX } from '../src/hooks/useCalibration';
import { spacing, radii } from '../src/utils/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, colorScheme, setTheme } = useTheme();
  const { threshold, setThreshold } = useCalibration();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text variant="body" color={theme.colors.primary}>‹ Volver</Text>
        </TouchableOpacity>
        <Text variant="heading3" color={theme.colors.onBackground}>Configuración</Text>
      </View>

      <View style={styles.content}>
        {/* Calibration section */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text variant="label" color={theme.colors.onSurfaceSecondary} style={styles.sectionLabel}>
            CALIBRACIÓN DE INCLINACIÓN
          </Text>
          <Text variant="body" color={theme.colors.onBackground} style={styles.settingTitle}>
            Sensibilidad
          </Text>
          <Text variant="bodySmall" color={theme.colors.onSurfaceSecondary} style={styles.settingDesc}>
            Ajusta cuánto debes inclinar el teléfono para marcar una respuesta.
          </Text>
          <View style={styles.sliderRow}>
            <Text variant="caption" color={theme.colors.onSurfaceSecondary}>Poco</Text>
            <Slider
              style={styles.slider}
              minimumValue={CALIBRATION_MIN}
              maximumValue={CALIBRATION_MAX}
              step={0.05}
              value={threshold}
              onValueChange={setThreshold}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.border}
              thumbTintColor={theme.colors.primary}
            />
            <Text variant="caption" color={theme.colors.onSurfaceSecondary}>Mucho</Text>
          </View>
          <Text variant="caption" color={theme.colors.onSurfaceSecondary} align="center">
            Valor actual: {threshold.toFixed(2)}
          </Text>
        </View>

        {/* Theme section */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text variant="label" color={theme.colors.onSurfaceSecondary} style={styles.sectionLabel}>
            TEMA
          </Text>
          <View style={styles.themeRow}>
            <ThemeOption
              label="Claro"
              emoji="☀️"
              active={colorScheme === 'light'}
              onPress={() => setTheme('light')}
              theme={theme}
            />
            <ThemeOption
              label="Oscuro"
              emoji="🌙"
              active={colorScheme === 'dark'}
              onPress={() => setTheme('dark')}
              theme={theme}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

interface ThemeOptionProps {
  label: string;
  emoji: string;
  active: boolean;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>['theme'];
}

function ThemeOption({ label, emoji, active, onPress, theme }: ThemeOptionProps) {
  return (
    <TouchableOpacity
      style={[
        styles.themeOption,
        {
          backgroundColor: active ? theme.colors.primaryLight + '33' : theme.colors.surfaceVariant,
          borderColor: active ? theme.colors.primary : theme.colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.themeEmoji}>{emoji}</Text>
      <Text variant="label" color={active ? theme.colors.primary : theme.colors.onSurface}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    gap: spacing[1],
  },
  backBtn: {
    paddingVertical: spacing[2],
    alignSelf: 'flex-start',
  },
  content: {
    padding: spacing[4],
    gap: spacing[4],
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[3],
  },
  sectionLabel: {
    letterSpacing: 0.8,
  },
  settingTitle: {},
  settingDesc: {},
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  slider: {
    flex: 1,
    height: 40,
  },
  themeRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  themeOption: {
    flex: 1,
    borderRadius: radii.md,
    borderWidth: 2,
    paddingVertical: spacing[4],
    alignItems: 'center',
    gap: spacing[2],
  },
  themeEmoji: {
    fontSize: 28,
  },
});
