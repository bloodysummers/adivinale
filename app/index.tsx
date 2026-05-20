import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useCategories } from '../src/hooks/useCategories';
import { useOfflineMode } from '../src/hooks/useOfflineMode';
import { hasCachedWords } from '../src/utils/cache';
import { CategoryCard } from '../src/components/CategoryCard';
import { Text } from '../src/components/Text';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { Drawer } from '../src/components/Drawer';
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
  const { isOffline } = useOfflineMode();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState<Category[] | null>(null);

  const isLandscape = width > height;
  const numColumns = isLandscape ? 3 : 2;

  // Filter categories by offline availability when in offline mode
  useEffect(() => {
    if (!categories) {
      setVisibleCategories(null);
      return;
    }
    if (!isOffline) {
      setVisibleCategories(categories);
      return;
    }
    let cancelled = false;
    Promise.all(categories.map((c) => hasCachedWords(c.id).then((has) => ({ cat: c, has }))))
      .then((results) => {
        if (!cancelled) setVisibleCategories(results.filter((r) => r.has).map((r) => r.cat));
      });
    return () => { cancelled = true; };
  }, [categories, isOffline]);

  function handleSelectCategory(category: Category) {
    resetRound();
    router.push(
      `/game/ready?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}&categoryEmoji=${encodeURIComponent(category.emoji)}`
    );
  }

  const showEmptyOffline = isOffline && visibleCategories != null && visibleCategories.length === 0;

  return (
    <>
    <ScreenContainer scrollable style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setDrawerOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Abrir menú"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text variant="body" color={theme.colors.onBackground} style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text variant="title" color={theme.colors.primary} align="center">
          Adivínale
        </Text>
        <Text variant="body" color={theme.colors.onSurfaceSecondary} align="center">
          {isOffline ? 'Modo offline' : 'Elige una categoría'}
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

      {showEmptyOffline && (
        <View style={styles.emptyOffline}>
          <Text variant="body" align="center" color={theme.colors.onSurfaceSecondary}>
            📵
          </Text>
          <Text variant="body" align="center" color={theme.colors.onSurfaceSecondary}>
            No hay categorías disponibles offline.{'\n'}Juega una ronda conectado para guardar palabras.
          </Text>
        </View>
      )}

      {visibleCategories && visibleCategories.length > 0 && (
        <FlatList
          // key forces remount when column count changes (FlatList requires this)
          key={numColumns}
          data={visibleCategories}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              onPress={handleSelectCategory}
              offlineAvailable={isOffline}
              style={styles.card}
            />
          )}
          contentContainerStyle={styles.list}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.rowGap} />}
        />
      )}
    </ScreenContainer>
    <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
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
  menuButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    padding: spacing[2],
  },
  menuIcon: {
    fontSize: 22,
    lineHeight: 28,
  },
  loader: {
    marginTop: spacing[10],
  },
  error: {
    marginTop: spacing[10],
  },
  emptyOffline: {
    marginTop: spacing[10],
    alignItems: 'center',
    gap: spacing[4],
    paddingHorizontal: spacing[8],
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
