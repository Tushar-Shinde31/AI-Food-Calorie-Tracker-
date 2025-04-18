import { View, Text, Image, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useAtomValue } from 'jotai';
import { analysisAtom } from '@/atoms/analysis';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const CollapsibleSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const rotation = useSharedValue('0deg');

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    rotation.value = withTiming(isCollapsed ? '0deg' : '180deg', { duration: 300 });
  };

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: rotation.value }],
  }));

  return (
    <View style={styles.section}>
      <Pressable onPress={toggleCollapse} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Animated.View style={iconStyle}>
          <Ionicons name="chevron-up" size={24} color="#666" />
        </Animated.View>
      </Pressable>
      {!isCollapsed && children}
    </View>
  );
};

const Page = () => {
  const analysis = useAtomValue(analysisAtom);

  if (!analysis) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: analysis.image }} style={styles.image} resizeMode="cover" />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.foodName}>{analysis.identifiedFood}</Text>
      </View>

      <CollapsibleSection title="Portion Information">
        <View style={styles.sectionContent}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Portion Size:</Text>
            <Text style={styles.value}>{analysis.portionSize}g</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Serving Size:</Text>
            <Text style={styles.value}>{analysis.recognizedServingSize}g</Text>
          </View>
        </View>
      </CollapsibleSection>

      <CollapsibleSection title="Nutrition Facts (per portion)">
        <View style={styles.sectionContent}>
          <View style={styles.nutritionGrid}>
            <NutritionItem label="Calories" value={analysis.nutritionFactsPerPortion.calories} />
            <NutritionItem
              label="Protein"
              value={`${analysis.nutritionFactsPerPortion.protein}g`}
            />
            <NutritionItem label="Carbs" value={`${analysis.nutritionFactsPerPortion.carbs}g`} />
            <NutritionItem label="Fat" value={`${analysis.nutritionFactsPerPortion.fat}g`} />
            <NutritionItem label="Fiber" value={`${analysis.nutritionFactsPerPortion.fiber}g`} />
            <NutritionItem label="Sugar" value={`${analysis.nutritionFactsPerPortion.sugar}g`} />
            <NutritionItem label="Sodium" value={`${analysis.nutritionFactsPerPortion.sodium}mg`} />
            <NutritionItem
              label="Cholesterol"
              value={`${analysis.nutritionFactsPerPortion.cholesterol}mg`}
            />
          </View>
        </View>
      </CollapsibleSection>

      <CollapsibleSection title="Additional Notes">
        <View style={styles.sectionContent}>
          {analysis.additionalNotes.map((note, index) => (
            <Text key={index} style={styles.note}>
              • {note}
            </Text>
          ))}
        </View>
      </CollapsibleSection>
    </ScrollView>
  );
};

const NutritionItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.nutritionItem}>
    <Text style={styles.nutritionLabel}>{label}</Text>
    <Text style={styles.nutritionValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  imageContainer: {
    height: 300,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    padding: 16,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  foodName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    lineHeight: 32,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionContent: {
    padding: 16,
    paddingTop: 8,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  nutritionItem: {
    width: '50%',
    padding: 8,
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  note: {
    fontSize: 16,
    color: '#4a4a4a',
    marginBottom: 8,
    lineHeight: 22,
  },
});

export default Page;
