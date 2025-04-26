export interface User {
  id: string;
  email: string;
  avatar_url?: string;
  current_position?: string;
  location?: string;
  about?: string;
  created_at: string;
  connections_count?: number;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user?: User;
  liked_by_me?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: User;
}

export interface Connection {
  id: string;
  user_id: string;
  connected_user_id: string;
  status: 'pending' | 'accepted';
  created_at: string;
  connected_user?: User;
}

export interface Job {
  id: string;
  company_name: string;
  company_logo?: string;
  title: string;
  location: string;
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  description: string;
  salary_range?: string;
  posted_at: string;
  saved?: boolean;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender?: User;
  receiver?: User;
}

export interface Conversation {
  id: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  user: User;
}