import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Wallet, ArrowUpCircle, ArrowDownCircle, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react-native';
import { useTrading } from '@/contexts/TradingContext';
import { useState } from 'react';
import { openPayPalCheckout } from '@/lib/paypal';

export default function WalletScreen() {
  const { walletBalance, transactions, addDeposit } = useTrading();
  const [depositAmount, setDepositAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    try {
      const { approvalUrl } = await addDeposit(amount);
      openPayPalCheckout(approvalUrl);
      
      Alert.alert(
        'Complete Deposit',
        'You will be redirected to PayPal to complete your deposit.',
        [{ text: 'OK', onPress: () => setDepositAmount('') }]
      );
    } catch (error: any) {
      Alert.alert('Deposit Failed', error.message || 'Please try again');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownCircle size={20} color="#10B981" />;
      case 'withdrawal':
        return <ArrowUpCircle size={20} color="#EF4444" />;
      case 'commission':
        return <DollarSign size={20} color="#3B82F6" />;
      case 'platform_fee':
        return <DollarSign size={20} color="#F59E0B" />;
      default:
        return <DollarSign size={20} color="#9CA3AF" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} color="#10B981" />;
      case 'pending':
        return <Clock size={16} color="#F59E0B" />;
      case 'failed':
        return <XCircle size={16} color="#EF4444" />;
      default:
        return <Clock size={16} color="#9CA3AF" />;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Wallet',
          headerStyle: { backgroundColor: '#0A0E27' },
          headerTintColor: '#FFFFFF',
          headerShadowVisible: false,
        }}
      />
      <StatusBar barStyle="light-content" />
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.balanceCard}>
            <View style={styles.balanceIconContainer}>
              <Wallet size={32} color="#3B82F6" />
            </View>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(walletBalance.total)}</Text>
            
            <View style={styles.balanceBreakdown}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceItemLabel}>Available</Text>
                <Text style={styles.balanceItemValue}>{formatCurrency(walletBalance.available)}</Text>
              </View>
              <View style={styles.balanceDivider} />
              <View style={styles.balanceItem}>
                <Text style={styles.balanceItemLabel}>Pending</Text>
                <Text style={[styles.balanceItemValue, { color: '#F59E0B' }]}>
                  {formatCurrency(walletBalance.pending)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Deposit</Text>
            <View style={styles.depositCard}>
              <Text style={styles.depositLabel}>Amount (USD)</Text>
              <TextInput
                style={styles.depositInput}
                value={depositAmount}
                onChangeText={setDepositAmount}
                placeholder="0.00"
                placeholderTextColor="#6B7280"
                keyboardType="decimal-pad"
              />
              <TouchableOpacity
                style={[styles.depositButton, isProcessing && styles.depositButtonDisabled]}
                onPress={handleDeposit}
                disabled={isProcessing}
              >
                <ArrowDownCircle size={20} color="#FFFFFF" />
                <Text style={styles.depositButtonText}>
                  {isProcessing ? 'Processing...' : 'Deposit via PayPal'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.depositNote}>
                Funds will be available immediately after payment confirmation
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transaction History</Text>
            {transactions.length === 0 ? (
              <View style={styles.emptyState}>
                <DollarSign size={48} color="#374151" />
                <Text style={styles.emptyStateText}>No transactions yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Your transaction history will appear here
                </Text>
              </View>
            ) : (
              <View style={styles.transactionsList}>
                {transactions.map((transaction) => (
                  <View key={transaction.id} style={styles.transactionItem}>
                    <View style={styles.transactionIcon}>
                      {getTransactionIcon(transaction.type)}
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionDescription}>
                        {transaction.description}
                      </Text>
                      <View style={styles.transactionMeta}>
                        {getStatusIcon(transaction.status)}
                        <Text style={styles.transactionDate}>
                          {formatDate(transaction.timestamp)}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.transactionAmount,
                        transaction.type === 'deposit' || transaction.type === 'commission'
                          ? styles.transactionAmountPositive
                          : styles.transactionAmountNegative,
                      ]}
                    >
                      {transaction.type === 'deposit' || transaction.type === 'commission' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  balanceCard: {
    backgroundColor: '#1F2937',
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  balanceIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F620',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  balanceBreakdown: {
    flexDirection: 'row',
    width: '100%',
    gap: 16,
  },
  balanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  balanceDivider: {
    width: 1,
    backgroundColor: '#374151',
  },
  balanceItemLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  balanceItemValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  depositCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
  },
  depositLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  depositInput: {
    backgroundColor: '#0A0E27',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  depositButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  depositButtonDisabled: {
    opacity: 0.6,
  },
  depositButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  depositNote: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: '#1F2937',
    borderRadius: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0A0E27',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  transactionAmountPositive: {
    color: '#10B981',
  },
  transactionAmountNegative: {
    color: '#EF4444',
  },
});
