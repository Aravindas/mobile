// supabaseClient.ts
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://rqpcxvzchlspwskyojws.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcGN4dnpjaGxzcHdza3lvandzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMzE2NTAsImV4cCI6MjA2MDYwNzY1MH0.rkWj6K_1E1EYFm8gIWvCRnNllfIZlDT_WI-7pdSCrn0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
