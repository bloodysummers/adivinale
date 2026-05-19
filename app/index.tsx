import { ActivityIndicator, FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useCategories } from '../src/hooks/useCategories';
import { CategoryCard } from '../src/components/CategoryCard';
import { Text } from '../src/components/Text';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { useGameStore } from '../src/store/gameStore';
import { useTheme } from '../src/theme/ThemeProvider';
import type { Category } from '../src/types';
import { spacing } from '../src/utils/theme';

const GRID_GAP = spacing[3];

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { width, height } = useWindowDimensions();
  const resetRound = useGameStore((s) => s.resetRound);
  const { data: categories, error, isLoading } = useCategories();

  const isLandscape = width > height;
  const numColumns = isLandscape ? 3 : 2;

  function handleSelectCategory(category: Category) {
    resetRound();
    router.push(
      `/game/ready?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}&categoryEmoji=${encodeURIComponent(category.emoji)}`
    );
  }

  return (
    <ScreenContainer scrollable style={styles.container}>
      <View style={styles.header}>
        <Text variant="heading1" color={theme.colors.primary} align="center">
          Adivínale
        </Text>
        <Text variant="body" color={theme.colors.onSurfaceSecondary} align="center">
          Elige una categoría
        </Text>
      </View>

      {isLoading && (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
      )}

      {error && (
        <Text variant="body" color={theme.colors.error} align="center" style={styles.error}>
          No se pudieron cargar las categorías
        </Text>
      )}

      {categories && (
        <FlatList
          // key forces remount when column count changes (FlatList requires this)
          key={numColumns}
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              onPress={handleSelectCategory}
              style={styles.card}
            />
          )}
          contentContainerStyle={styles.list}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.rowGap} />}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing[6],
  },
  header: {
    gap: spacing[2],
    marginBottom: spacing[6],
  },
  loader: {
    marginTop: spacing[10],
  },
  error: {
    marginTop: spacing[10],
  },
  list: {
    paddingBottom: spacing[10],
  },
  row: {
    gap: GRID_GAP,
  },
  rowGap: {
    height: GRID_GAP,
  },
  card: {
    flex: 1,
  },
});
