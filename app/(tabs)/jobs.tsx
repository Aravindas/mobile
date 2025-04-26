import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Briefcase, X } from 'lucide-react-native';
import { useJobsStore } from '@/store/jobs-store';
import JobCard from '@/components/JobCard';
import colors from '@/constants/colors';

export default function JobsScreen() {
  const { 
    jobs, 
    savedJobs,
    isLoading, 
    error, 
    fetchJobs,
    fetchSavedJobs,
    saveJob,
    searchJobs,
    clearError
  } = useJobsStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    loadData();
  }, []);
  
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error]);
  
  const loadData = async () => {
    await Promise.all([
      fetchJobs(),
      fetchSavedJobs()
    ]);
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  const handleJobPress = (jobId: string) => {
    router.push(`/job/${jobId}`);
  };
  
  const handleSaveJob = (jobId: string, saved: boolean) => {
    saveJob(jobId, saved);
  };
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchJobs(searchQuery);
    } else {
      fetchJobs();
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    fetchJobs();
  };
  
  const toggleSavedFilter = () => {
    setShowSavedOnly(!showSavedOnly);
  };
  
  const displayedJobs = showSavedOnly ? savedJobs : jobs;
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Jobs</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.text.tertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs, companies, or keywords"
            placeholderTextColor={colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color={colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[
              styles.filterButton,
              showSavedOnly && styles.filterButtonActive
            ]}
            onPress={toggleSavedFilter}
          >
            <Briefcase 
              size={16} 
              color={showSavedOnly ? colors.white : colors.text.secondary} 
            />
            <Text 
              style={[
                styles.filterButtonText,
                showSavedOnly && styles.filterButtonTextActive
              ]}
            >
              Saved Jobs
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={displayedJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={handleJobPress}
            onSave={handleSaveJob}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Briefcase size={48} color={colors.text.tertiary} />
              <Text style={styles.emptyTitle}>
                {showSavedOnly 
                  ? "No saved jobs yet" 
                  : searchQuery 
                    ? "No matching jobs found" 
                    : "No jobs available"
                }
              </Text>
              <Text style={styles.emptyText}>
                {showSavedOnly 
                  ? "Save jobs you're interested in to view them later" 
                  : searchQuery 
                    ? "Try different keywords or filters" 
                    : "Check back later for new opportunities"
                }
              </Text>
            </View>
          ) : null
        }
      />
      
      {isLoading && !refreshing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: colors.text.primary,
  },
  clearButton: {
    padding: 6,
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 6,
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});