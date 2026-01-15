import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { useTrading } from '@/contexts/TradingContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { CommodityType, Trade } from '@/types';
import PaywallModal from '@/components/PaywallModal';

const COMMODITIES: { value: CommodityType; label: string }[] = [
  { value: 'gold', label: 'Gold' },
  { value: 'fuel_oil', label: 'Fuel Oil' },
  { value: 'steam_coal', label: 'Steam Coal' },
  { value: 'anthracite_coal', label: 'Anthracite Coal' },
  { value: 'urea', label: 'Urea' },
  { value: 'edible_oils', label: 'Edible Oils' }
];

const INCOTERMS = ['CIF', 'FOB', 'CFR', 'DDP', 'EXW', 'FCA', 'DAP'];

export default function CreateTradeScreen() {
  console.log('[CreateTrade] Component mounted');
  const router = useRouter();
  const { counterparties, addTrade, currentUser, trades } = useTrading();
  const { isPremium, getFeatureLimit } = useSubscription();
  const [selectedCounterparty, setSelectedCounterparty] = useState('');
  const [commodity, setCommodity] = useState<CommodityType>('gold');
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [incoterm, setIncoterm] = useState('CIF');
  const [commissionRate, setCommissionRate] = useState(1.0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);
  const [useMarketPrice, setUseMarketPrice] = useState(false);
  const [discountPercent, setDiscountPercent] = useState('5');
  const { livePrices } = useTrading();

  const approvedCounterparties = counterparties.filter(cp => cp.approved);
  const filteredCounterparties = approvedCounterparties.filter(cp =>
    cp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async () => {
    if (!selectedCounterparty || !quantity || !pricePerUnit) {
      return;
    }

    if (!isPremium) {
      const maxTrades = getFeatureLimit('maxActiveTrades');
      const activeTrades = trades.filter(t => ['active', 'in_transit', 'financing_pending'].includes(t.status));
      
      if (maxTrades !== null && activeTrades.length >= maxTrades) {
        setShowPaywall(true);
        return;
      }
    }

    const counterparty = counterparties.find(cp => cp.id === selectedCounterparty);
    if (!counterparty) return;

    const quantityNum = parseFloat(quantity);
    let priceNum = parseFloat(pricePerUnit);
    let marketPriceNum: number | undefined = undefined;
    let discountPercentNum: number | undefined = undefined;

    if (useMarketPrice && livePrices[commodity]) {
      marketPriceNum = livePrices[commodity];
      discountPercentNum = parseFloat(discountPercent) || 0;
      priceNum = marketPriceNum * (1 - discountPercentNum / 100);
    }

    const totalValue = quantityNum * priceNum;
    const commissionAmount = totalValue * (commissionRate / 100);

    const entryPriceNum = entryPrice ? parseFloat(entryPrice) : priceNum;

    const newTrade: Trade = {
      id: `t${Date.now()}`,
      commodity,
      counterpartyId: counterparty.id,
      counterpartyName: counterparty.name,
      quantity: quantityNum,
      unit: commodity === 'gold' ? 'kg' : 'MT',
      pricePerUnit: priceNum,
      entryPrice: entryPriceNum,
      marketPrice: marketPriceNum,
      discountPercent: discountPercentNum,
      totalValue,
      currency: 'USD',
      incoterm: `${incoterm} ${counterparty.country}`,
      deliveryWindow: {
        start: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      },
      status: 'counterparty_review',
      createdAt: new Date(),
      createdBy: currentUser?.name || 'User',
      documents: [],
      riskLevel: counterparty.riskScore.level,
      alerts: [],
      commissionRate,
      commissionAmount,
      commissionPaid: false
    };

    await addTrade(newTrade);
    router.back();
  };

  console.log('[CreateTrade] Rendering, commodity:', commodity, 'useMarketPrice:', useMarketPrice);
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Commodity</Text>
              <View style={styles.optionsGrid}>
                {COMMODITIES.map(({ value, label }) => (
                  <TouchableOpacity
                    key={value}
                    style={[styles.optionCard, commodity === value && styles.optionCardActive]}
                    onPress={() => setCommodity(value)}
                  >
                    <Text style={[styles.optionText, commodity === value && styles.optionTextActive]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Counterparty</Text>
              <View style={styles.searchBar}>
                <Search size={20} color="#6B7280" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search counterparties..."
                  placeholderTextColor="#6B7280"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              {filteredCounterparties.map(cp => (
                <TouchableOpacity
                  key={cp.id}
                  style={[styles.counterpartyItem, selectedCounterparty === cp.id && styles.counterpartyItemActive]}
                  onPress={() => setSelectedCounterparty(cp.id)}
                >
                  <View style={styles.counterpartyInfo}>
                    <Text style={styles.counterpartyName}>{cp.name}</Text>
                    <Text style={styles.counterpartyCountry}>{cp.country}</Text>
                  </View>
                  <View style={[
                    styles.riskBadge,
                    { backgroundColor: 
                      cp.riskScore.level === 'green' ? '#10B98120' : 
                      cp.riskScore.level === 'amber' ? '#F59E0B20' : 
                      '#EF444420'
                    }
                  ]}>
                    <Text style={[
                      styles.riskText,
                      { color: 
                        cp.riskScore.level === 'green' ? '#10B981' : 
                        cp.riskScore.level === 'amber' ? '#F59E0B' : 
                        '#EF4444'
                      }
                    ]}>{cp.riskScore.level.toUpperCase()}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trade Details</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter quantity"
                  placeholderTextColor="#6B7280"
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.inputLabel}>Pricing Method</Text>
                </View>
                <View style={styles.pricingToggle}>
                  <TouchableOpacity
                    style={[styles.toggleOption, !useMarketPrice && styles.toggleOptionActive]}
                    onPress={() => setUseMarketPrice(false)}
                  >
                    <Text style={[styles.toggleText, !useMarketPrice && styles.toggleTextActive]}>Fixed Price</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toggleOption, useMarketPrice && styles.toggleOptionActive]}
                    onPress={() => setUseMarketPrice(true)}
                  >
                    <Text style={[styles.toggleText, useMarketPrice && styles.toggleTextActive]}>Market Price w/ Discount</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {!useMarketPrice ? (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Price per Unit (USD)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter price"
                    placeholderTextColor="#6B7280"
                    keyboardType="numeric"
                    value={pricePerUnit}
                    onChangeText={setPricePerUnit}
                  />
                </View>
              ) : (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Discount from Market Price (%)</Text>
                  {livePrices[commodity] && (
                    <View style={styles.marketPriceInfo}>
                      <Text style={styles.marketPriceLabel}>Current Market Price:</Text>
                      <Text style={styles.marketPriceValue}>${(livePrices[commodity] || 0).toLocaleString()} USD</Text>
                    </View>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Enter discount percentage"
                    placeholderTextColor="#6B7280"
                    keyboardType="numeric"
                    value={discountPercent}
                    onChangeText={setDiscountPercent}
                  />
                  {livePrices[commodity] && discountPercent && discountPercent.length > 0 && (
                    <View style={styles.calculatedPriceBox}>
                      <Text style={styles.calculatedLabel}>Your Trade Price:</Text>
                      <Text style={styles.calculatedValue}>
                        ${((livePrices[commodity] || 0) * (1 - (parseFloat(discountPercent) || 0) / 100)).toLocaleString()} USD
                      </Text>
                      <Text style={styles.savingsText}>Save ${((livePrices[commodity] || 0) * (parseFloat(discountPercent) || 0) / 100).toLocaleString()} per unit</Text>
                    </View>
                  )}
                  {!livePrices[commodity] && (
                    <Text style={styles.warningText}>⚠️ Market price unavailable for this commodity</Text>
                  )}
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Entry Price (USD) - Optional</Text>
                <Text style={styles.helperText}>Track P&L from this price point. Defaults to price per unit.</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter entry price for P&L tracking"
                  placeholderTextColor="#6B7280"
                  keyboardType="numeric"
                  value={entryPrice}
                  onChangeText={setEntryPrice}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>INCOTERM</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.incotermScroll}>
                  {INCOTERMS.map(term => (
                    <TouchableOpacity
                      key={term}
                      style={[styles.incotermChip, incoterm === term && styles.incotermChipActive]}
                      onPress={() => setIncoterm(term)}
                    >
                      <Text style={[styles.incotermText, incoterm === term && styles.incotermTextActive]}>
                        {term}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Facilitation Commission Rate (%)</Text>
                <Text style={styles.helperText}>Masters Energy Inc. USA commission as intermediary</Text>
                <View style={styles.commissionOptions}>
                  {[0.5, 1.0, 1.5, 2.0].map(rate => (
                    <TouchableOpacity
                      key={rate}
                      style={[styles.commissionChip, commissionRate === rate && styles.commissionChipActive]}
                      onPress={() => setCommissionRate(rate)}
                    >
                      <Text style={[styles.commissionText, commissionRate === rate && styles.commissionTextActive]}>
                        {rate}%
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {quantity && ((!useMarketPrice && pricePerUnit) || (useMarketPrice && livePrices[commodity])) && (
              <View style={styles.summarySection}>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>Total Trade Value</Text>
                  <Text style={styles.summaryValue}>
                    ${(() => {
                      const qty = parseFloat(quantity) || 0;
                      if (useMarketPrice && livePrices[commodity]) {
                        const marketPrice = livePrices[commodity] || 0;
                        const discount = parseFloat(discountPercent) || 0;
                        const price = marketPrice * (1 - discount / 100);
                        return (qty * price).toLocaleString();
                      }
                      return (qty * parseFloat(pricePerUnit || '0')).toLocaleString();
                    })()} USD
                  </Text>
                </View>
                <View style={styles.commissionCard}>
                  <Text style={styles.commissionLabel}>Your Commission ({commissionRate}%)</Text>
                  <Text style={styles.commissionValue}>
                    ${(() => {
                      const qty = parseFloat(quantity) || 0;
                      if (useMarketPrice && livePrices[commodity]) {
                        const marketPrice = livePrices[commodity] || 0;
                        const discount = parseFloat(discountPercent) || 0;
                        const price = marketPrice * (1 - discount / 100);
                        return ((qty * price * commissionRate) / 100).toLocaleString();
                      }
                      return ((qty * parseFloat(pricePerUnit || '0') * commissionRate) / 100).toLocaleString();
                    })()} USD
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.createButton, (!selectedCounterparty || !quantity || (!pricePerUnit && !useMarketPrice)) && styles.createButtonDisabled]}
            onPress={handleCreate}
            disabled={!selectedCounterparty || !quantity || (!pricePerUnit && !useMarketPrice)}
          >
            <Text style={styles.createButtonText}>Create Trade</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="Unlimited Active Trades"
      />
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
  },
  content: {
    padding: 20,
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardActive: {
    backgroundColor: '#3B82F620',
    borderColor: '#3B82F6',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  optionTextActive: {
    color: '#3B82F6',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  counterpartyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  counterpartyItemActive: {
    backgroundColor: '#3B82F620',
    borderColor: '#3B82F6',
  },
  counterpartyInfo: {
    flex: 1,
  },
  counterpartyName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  counterpartyCountry: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  riskText: {
    fontSize: 10,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  incotermScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  incotermChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#1F2937',
    marginRight: 8,
  },
  incotermChipActive: {
    backgroundColor: '#3B82F6',
  },
  incotermText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  incotermTextActive: {
    color: '#FFFFFF',
  },
  summarySection: {
    gap: 12,
  },
  summaryCard: {
    backgroundColor: '#10B98120',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#10B981',
  },
  commissionCard: {
    backgroundColor: '#8B5CF620',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  commissionLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  commissionValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  commissionOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  commissionChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  commissionChipActive: {
    backgroundColor: '#8B5CF620',
    borderColor: '#8B5CF6',
  },
  commissionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    fontStyle: 'italic' as const,
  },
  commissionTextActive: {
    color: '#8B5CF6',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  createButton: {
    flex: 2,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#374151',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricingToggle: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleOptionActive: {
    backgroundColor: '#3B82F6',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  marketPriceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#10B98110',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  marketPriceLabel: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  marketPriceValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10B981',
  },
  calculatedPriceBox: {
    backgroundColor: '#3B82F610',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  calculatedLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  calculatedValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 8,
  },
  savingsText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
  },
  warningText: {
    fontSize: 13,
    color: '#F59E0B',
    marginTop: 8,
    fontStyle: 'italic' as const,
  },
});
