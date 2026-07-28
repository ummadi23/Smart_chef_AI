import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export type TabType = 'home' | 'scan' | 'youtube' | 'ayurveda' | 'leftovers' | 'community' | 'profile' | 'recipes';

interface BottomNavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function BottomNavBar({ activeTab, onTabChange }: BottomNavBarProps) {
  const tabs: { id: TabType; icon: string; label: string }[] = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'scan', icon: '📋', label: 'Checklist' },
    { id: 'ayurveda', icon: '🌿', label: 'Ayurveda' },
    { id: 'leftovers', icon: '♻️', label: 'Leftovers' },
    { id: 'community', icon: '👥', label: 'Social' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <View style={styles.navContainer}>
      {tabs.map(t => {
        const isActive = activeTab === t.id;
        return (
          <TouchableOpacity
            key={t.id}
            style={styles.tabItem}
            onPress={() => onTabChange(t.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
              {t.icon}
            </Text>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
    transform: [{ scale: 1.15 }],
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  tabLabelActive: {
    color: '#22C55E',
    fontWeight: '900',
  },
});
