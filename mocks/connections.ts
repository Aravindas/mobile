import { Connection } from '@/types';
import { mockUsers } from './users';

export const mockConnections: Connection[] = [
  {
    id: '1',
    user_id: 'current_user',
    connected_user_id: '1',
    status: 'accepted',
    created_at: '2023-06-15T10:30:00Z',
    connected_user: mockUsers[0]
  },
  {
    id: '2',
    user_id: 'current_user',
    connected_user_id: '2',
    status: 'accepted',
    created_at: '2023-07-20T14:15:00Z',
    connected_user: mockUsers[1]
  },
  {
    id: '3',
    user_id: 'current_user',
    connected_user_id: '3',
    status: 'pending',
    created_at: '2023-09-05T09:45:00Z',
    connected_user: mockUsers[2]
  }
];

export const mockConnectionSuggestions = [
  mockUsers[3],
  mockUsers[4]
];