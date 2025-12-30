import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Star, Send } from 'lucide-react-native';
import type { MarketParticipant, CompanyRating } from '@/types';
import { useMarket } from '@/contexts/MarketContext';

interface CompanyRatingsModalProps {
  visible: boolean;
  onClose: () => void;
  company: MarketParticipant;
  currentUserId: string;
  currentUserName: string;
}

export default function CompanyRatingsModal({ 
  visible, 
  onClose, 
  company, 
  currentUserId, 
  currentUserName 
}: CompanyRatingsModalProps) {
  const { getRatingsForCompany, addRating, getAverageRating } = useMarket();
  const [newRating, setNewRating] = useState<number>(0);
  const [newReview, setNewReview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const companyRatings = getRatingsForCompany(company.id);
  const averageRating = getAverageRating(company.id);

  const handleSubmitRating = async () => {
    if (newRating === 0) {
      Alert.alert('Missing Rating', 'Please select a star rating.');
      return;
    }

    if (!newReview.trim()) {
      Alert.alert('Missing Review', 'Please write a review.');
      return;
    }

    setIsSubmitting(true);

    try {
      const rating: CompanyRating = {
        id: Date.now().toString(),
        companyId: company.id,
        userId: currentUserId,
        userName: currentUserName,
        rating: newRating,
        review: newReview.trim(),
        date: new Date(),
        verified: true
      };

      await addRating(rating);
      setNewRating(0);
      setNewReview('');
      Alert.alert('Success', 'Your review has been submitted!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, onPress?: (rating: number) => void) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity
            key={star}
            onPress={() => onPress?.(star)}
            disabled={!onPress}
            style={styles.starButton}
          >
            <Star 
              size={onPress ? 32 : 16} 
              color="#F59E0B" 
              fill={star <= rating ? '#F59E0B' : 'transparent'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.title}>Ratings & Reviews</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.companyHeader}>
              <Text style={styles.companyName}>{company.name}</Text>
              <View style={styles.averageRatingContainer}>
                {renderStars(Math.round(averageRating))}
                <Text style={styles.averageRatingText}>
                  {averageRating.toFixed(1)} ({companyRatings.length} {companyRatings.length === 1 ? 'review' : 'reviews'})
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Write a Review</Text>
              <View style={styles.ratingInput}>
                <Text style={styles.label}>Your Rating</Text>
                {renderStars(newRating, setNewRating)}
              </View>
              <View style={styles.reviewInput}>
                <Text style={styles.label}>Your Review</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Share your experience with this company..."
                  placeholderTextColor="#6B7280"
                  value={newReview}
                  onChangeText={setNewReview}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>
              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleSubmitRating}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Text style={styles.submitButtonText}>Submitting...</Text>
                ) : (
                  <>
                    <Send size={18} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>Submit Review</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>All Reviews ({companyRatings.length})</Text>
              {companyRatings.length === 0 ? (
                <View style={styles.emptyState}>
                  <Star size={40} color="#374151" />
                  <Text style={styles.emptyStateText}>No reviews yet</Text>
                  <Text style={styles.emptyStateSubtext}>Be the first to review this company</Text>
                </View>
              ) : (
                <View style={styles.reviewsList}>
                  {companyRatings.map(rating => (
                    <View key={rating.id} style={styles.reviewCard}>
                      <View style={styles.reviewHeader}>
                        <View>
                          <Text style={styles.reviewerName}>{rating.userName}</Text>
                          <Text style={styles.reviewDate}>
                            {rating.date.toLocaleDateString()}
                          </Text>
                        </View>
                        {renderStars(rating.rating)}
                      </View>
                      <Text style={styles.reviewText}>{rating.review}</Text>
                      {rating.verified && (
                        <View style={styles.verifiedBadge}>
                          <Text style={styles.verifiedText}>Verified User</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.bottomPadding} />
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  companyHeader: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  companyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  averageRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  averageRatingText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  ratingInput: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  reviewInput: {
    marginBottom: 20,
  },
  textArea: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#374151',
    minHeight: 120,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#374151',
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  reviewsList: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  reviewText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    marginBottom: 10,
  },
  verifiedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#10B98120',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  bottomPadding: {
    height: 40,
  },
});
