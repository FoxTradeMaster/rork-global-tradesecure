import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Lock, X } from 'lucide-react-native';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface AdminPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export default function AdminPasswordModal({
  visible,
  onClose,
  onAuthenticated,
}: AdminPasswordModalProps) {
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { authenticate } = useAdminAuth();

  const handleSubmit = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    setIsLoading(true);
    try {
      const success = await authenticate(password);
      if (success) {
        setPassword('');
        onAuthenticated();
      } else {
        Alert.alert('Access Denied', 'Incorrect password. Please try again.');
        setPassword('');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Error', 'Failed to authenticate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            disabled={isLoading}
          >
            <X size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Lock size={48} color="#3B82F6" />
          </View>

          <Text style={styles.title}>Admin Access Required</Text>
          <Text style={styles.subtitle}>
            Enter the admin password to access wallet data
          </Text>

          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter admin password"
            placeholderTextColor="#6B7280"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Authenticate</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  submitButtonDisabled: {
    backgroundColor: '#4B5563',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
