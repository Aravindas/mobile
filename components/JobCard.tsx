import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Bookmark, MapPin, Clock, Briefcase } from 'lucide-react-native';
import { Job } from '@/types';
import Card from './Card';
import colors from '@/constants/colors';
import { formatTimeAgo } from '@/utils/date';

interface JobCardProps {
  job: Job;
  onPress?: (jobId: string) => void;
  onSave?: (jobId: string, saved: boolean) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onPress,
  onSave,
}) => {
  const handlePress = () => {
    if (onPress) onPress(job.id);
  };
  
  const handleSave = () => {
    if (onSave) onSave(job.id, !job.saved);
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
  
  return (
    <Card style={styles.card} elevation="low">
      <TouchableOpacity 
        style={styles.container} 
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
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
          
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{job.title}</Text>
            <Text style={styles.company}>{job.company_name}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            activeOpacity={0.7}
          >
            <Bookmark 
              size={20} 
              color={job.saved ? colors.primary : colors.text.tertiary} 
              fill={job.saved ? colors.primary : 'none'} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.details}>
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
            <Text style={styles.detailText}>{formatTimeAgo(job.posted_at)}</Text>
          </View>
        </View>
        
        {job.salary_range && (
          <View style={styles.salary}>
            <Text style={styles.salaryText}>{job.salary_range}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 0,
  },
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
  },
  companyLogoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyLogoPlaceholderText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  saveButton: {
    padding: 8,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 6,
  },
  salary: {
    backgroundColor: colors.inputBackground,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  salaryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
});

export default JobCard;