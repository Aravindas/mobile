import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Linking
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign,
  Bookmark,
  Share2,
  ExternalLink
} from 'lucide-react-native';
import { Job } from '@/types';
import Button from '@/components/Button';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { mockJobs } from '@/mocks/jobs';
import { useJobsStore } from '@/store/jobs-store';
import { formatTimeAgo } from '@/utils/date';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  const { saveJob } = useJobsStore();
  
  useEffect(() => {
    // Find the job in the mock data
    const foundJob = mockJobs.find(j => j.id === id);
    if (foundJob) {
      setJob(foundJob);
    }
    
    setIsLoading(false);
  }, [id]);
  
  const handleSave = () => {
    if (job) {
      saveJob(job.id, !job.saved);
      setJob({
        ...job,
        saved: !job.saved
      });
    }
  };
  
  const handleApply = () => {
    Alert.alert(
      'Apply for Job',
      'This would redirect to the application form or external website in a real app.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => {
            // In a real app, this might open a web browser or an in-app form
            Alert.alert('Application Started', 'You would now be filling out an application.');
          }
        }
      ]
    );
  };
  
  const handleShare = () => {
    Alert.alert('Share Job', 'Sharing functionality would be implemented here.');
  };
  
  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'Full-time';
      case 'part-time':
        return 'Part-time';
      case 'contract':
        return 'Contract';
      case 'internship':
        return 'Internship';
      case 'remote':
        return 'Remote';
      default:
        return type;
    }
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }
  
  if (!job) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Job not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Job Details' }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.header}>
          <View style={styles.headerTop}>
            {job.company_logo ? (
              <Image 
                source={{ uri: job.company_logo }} 
                style={styles.companyLogo} 
                resizeMode="contain"
              />
            ) : (
              <View style={styles.companyLogoPlaceholder}>
                <Text style={styles.companyLogoPlaceholderText}>
                  {job.company_name.charAt(0)}
                </Text>
              </View>
            )}
            
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleSave}
              >
                <Bookmark 
                  size={20} 
                  color={job.saved ? colors.primary : colors.text.tertiary} 
                  fill={job.saved ? colors.primary : 'none'} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleShare}
              >
                <Share2 size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.companyName}>{job.company_name}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <MapPin size={16} color={colors.text.tertiary} />
              <Text style={styles.detailText}>{job.location}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Briefcase size={16} color={colors.text.tertiary} />
              <Text style={styles.detailText}>{getJobTypeLabel(job.job_type)}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Clock size={16} color={colors.text.tertiary} />
              <Text style={styles.detailText}>Posted {formatTimeAgo(job.posted_at)}</Text>
            </View>
            
            {job.salary_range && (
              <View style={styles.detailItem}>
                <DollarSign size={16} color={colors.text.tertiary} />
                <Text style={styles.detailText}>{job.salary_range}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.actions}>
            <Button
              title="Apply Now"
              onPress={handleApply}
              variant="primary"
              style={styles.applyButton}
              fullWidth
            />
            
            <Button
              title={job.saved ? "Saved" : "Save"}
              onPress={handleSave}
              variant="outline"
              style={styles.saveButton}
              fullWidth
              icon={
                <Bookmark 
                  size={16} 
                  color={colors.primary} 
                  fill={job.saved ? colors.primary : 'none'} 
                />
              }
            />
          </View>
        </Card>
        
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.descriptionText}>{job.description}</Text>
        </Card>
        
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>About the Company</Text>
          <Text style={styles.aboutText}>
            {job.company_name} is a leading company in its industry. Visit their website to learn more.
          </Text>
          
          <TouchableOpacity 
            style={styles.websiteLink}
            onPress={() => Linking.openURL('https://example.com')}
          >
            <Text style={styles.websiteLinkText}>Visit Company Website</Text>
            <ExternalLink size={16} color={colors.primary} />
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  backButton: {
    padding: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  header: {
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
  },
  companyLogoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyLogoPlaceholderText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  jobTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  applyButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  aboutText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  websiteLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  websiteLinkText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginRight: 6,
  },
});