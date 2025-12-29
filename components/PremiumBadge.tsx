import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Crown } from 'lucide-react-native';

interface PremiumBadgeProps {
  onPress?: () => void;
  small?: boolean;
}

export default function PremiumBadge({ onPress, small = false }: PremiumBadgeProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.container, small && styles.containerSmall]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Crown size={small ? 12 : 14} color="#FFD700" fill="#FFD700" />
      <Text style={[styles.text, small && styles.textSmall]}>PREMIUM</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFD70020',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  containerSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD700',
  },
  textSmall: {
    fontSize: 10,
  },
});
