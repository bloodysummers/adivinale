import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useCategories } from '../src/hooks/useCategories';
import { CategoryCard } from '../src/components/CategoryCard';
import { useGameStore } from '../src/store/gameStore';
import type { Category } from '../src/types';
import { colors, spacing, typography } from '../src/utils/theme';

export default function HomeScreen() {
  const router = useRouter();
  const resetRound = useGameStore((s) => s.resetRound);
  const { data: categories, error, isLoading } = useCategories();

  function handleSelectCategory(category: Category) {
    resetRound();
    router.push(
      `/game/ready?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}&categoryEmoji=${encodeURIComponent(category.emoji)}`
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adivínale</Text>
      <Text style={styles.subtitle}>Elige una categoría</Text>

      {isLoading && <ActivityIndicator size="large" color={colors.text} />}

      {error && (
        <Text style={styles.error}>No se pudieron cargar las categorías</Text>
      )}

      {categories && (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryCard category={item} onPress={handleSelectCategory} />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.md,
  },
  title: {
    ...typography.heading,
    fontSize: 36,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  error: {
    ...typography.body,
    color: colors.skip,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
