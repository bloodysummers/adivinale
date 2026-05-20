import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../src/components/Text';
import { useTheme } from '../src/theme/ThemeProvider';
import { useCategories } from '../src/hooks/useCategories';
import type { Category } from '../src/types';
import { spacing, radii } from '../src/utils/theme';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

type SubmitStatus = 'idle' | 'loading' | 'created' | 'duplicate' | 'error';

export default function SubmitAnswerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [text, setText] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const canSubmit = selectedCategory != null && text.trim().length > 0 && status !== 'loading';

  async function handleSubmit() {
    if (!canSubmit || !selectedCategory) return;
    setStatus('loading');
    try {
      const res = await fetch(`${BASE_URL}/api/suggest-word`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: selectedCategory.id, text: text.trim() }),
      });
      if (!res.ok) throw new Error('server_error');
      const body = await res.json() as { status: 'created' | 'duplicate' };
      setStatus(body.status);
      if (body.status === 'created') {
        setText('');
        setSelectedCategory(null);
      }
    } catch {
      setStatus('error');
    }
  }

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
        <Text variant="heading3" color={theme.colors.onBackground}>Sugerir respuesta</Text>
        <Text variant="bodySmall" color={theme.colors.onSurfaceSecondary}>
          ¿Conoces una palabra que debería estar en una categoría? ¡Sugiérela!
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Category dropdown */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text variant="label" color={theme.colors.onSurfaceSecondary} style={styles.fieldLabel}>
            CATEGORÍA
          </Text>

          {categoriesLoading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <>
              <TouchableOpacity
                style={[styles.dropdownTrigger, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceVariant }]}
                onPress={() => setDropdownOpen((o) => !o)}
                activeOpacity={0.8}
              >
                <Text variant="body" color={selectedCategory ? theme.colors.onBackground : theme.colors.onSurfaceSecondary}>
                  {selectedCategory ? `${selectedCategory.emoji} ${selectedCategory.name}` : 'Selecciona una categoría'}
                </Text>
                <Text variant="body" color={theme.colors.onSurfaceSecondary}>{dropdownOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {dropdownOpen && categories && (
                <View style={[styles.dropdownList, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.dropdownItem,
                        selectedCategory?.id === cat.id && { backgroundColor: theme.colors.surfaceVariant },
                      ]}
                      onPress={() => {
                        setSelectedCategory(cat);
                        setDropdownOpen(false);
                        setStatus('idle');
                      }}
                    >
                      <Text variant="body" color={theme.colors.onBackground}>
                        {cat.emoji} {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}
        </View>

        {/* Text input */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text variant="label" color={theme.colors.onSurfaceSecondary} style={styles.fieldLabel}>
            RESPUESTA SUGERIDA
          </Text>
          <TextInput
            style={[styles.input, { color: theme.colors.onBackground, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceVariant }]}
            placeholder="Escribe una palabra o frase…"
            placeholderTextColor={theme.colors.onSurfaceSecondary}
            value={text}
            onChangeText={(v) => { setText(v); setStatus('idle'); }}
            maxLength={80}
            autoCapitalize="sentences"
            returnKeyType="done"
          />
        </View>

        {/* Feedback messages */}
        {status === 'created' && (
          <View style={[styles.feedback, { backgroundColor: theme.colors.success + '22', borderColor: theme.colors.success }]}>
            <Text variant="body" color={theme.colors.success} align="center">
              ¡Gracias! Tu sugerencia fue enviada.
            </Text>
          </View>
        )}
        {status === 'duplicate' && (
          <View style={[styles.feedback, { backgroundColor: theme.colors.primary + '22', borderColor: theme.colors.primary }]}>
            <Text variant="body" color={theme.colors.primary} align="center">
              Esa respuesta ya existe en esta categoría.
            </Text>
          </View>
        )}
        {status === 'error' && (
          <View style={[styles.feedback, { backgroundColor: theme.colors.error + '22', borderColor: theme.colors.error }]}>
            <Text variant="body" color={theme.colors.error} align="center">
              Ocurrió un error. Intenta de nuevo.
            </Text>
          </View>
        )}

        {/* Submit button */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            {
              backgroundColor: canSubmit ? theme.colors.primary : theme.colors.border,
            },
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit}
          activeOpacity={0.8}
        >
          {status === 'loading' ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text variant="button" color="#fff">Enviar sugerencia</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
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
    paddingBottom: spacing[12],
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[3],
  },
  fieldLabel: {
    letterSpacing: 0.8,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  dropdownList: {
    borderWidth: 1,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  input: {
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    fontSize: 15,
  },
  feedback: {
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing[4],
  },
  submitBtn: {
    borderRadius: radii.lg,
    paddingVertical: spacing[4],
    alignItems: 'center',
  },
});
