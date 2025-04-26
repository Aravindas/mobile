import { Conversation, Message } from '@/types';
import { mockUsers } from './users';

export const mockMessages: Message[] = [
  {
    id: '1',
    sender_id: '1',
    receiver_id: 'current_user',
    content: "Hi there! I saw your profile and I'm impressed with your work. Would you be interested in discussing a potential collaboration?",
    created_at: '2023-09-14T10:30:00Z',
    read: true,
    sender: mockUsers[0]
  },
  {
    id: '2',
    sender_id: 'current_user',
    receiver_id: '1',
    content: "Thanks for reaching out! I'd definitely be interested in hearing more about the collaboration opportunity. What did you have in mind?",
    created_at: '2023-09-14T11:15:00Z',
    read: true
  },
  {
    id: '3',
    sender_id: '1',
    receiver_id: 'current_user',
    content: "Great! Our company is working on a new project that aligns with your expertise. Would you be available for a quick call tomorrow to discuss the details?",
    created_at: '2023-09-14T11:45:00Z',
    read: true,
    sender: mockUsers[0]
  },
  {
    id: '4',
    sender_id: 'current_user',
    receiver_id: '1',
    content: "Absolutely! I'm free tomorrow afternoon, around 2-4 PM. Would any time in that window work for you?",
    created_at: '2023-09-14T12:30:00Z',
    read: true
  },
  {
    id: '5',
    sender_id: '1',
    receiver_id: 'current_user',
    content: "Perfect! Let's do 3 PM. I'll send you a calendar invite with the meeting details. Looking forward to our conversation!",
    created_at: '2023-09-14T13:00:00Z',
    read: false,
    sender: mockUsers[0]
  },
  {
    id: '6',
    sender_id: '2',
    receiver_id: 'current_user',
    content: "Hey! I just read your article on React performance optimization. Really insightful stuff! I've been dealing with some rendering issues in my current project. Do you have any specific tips for large data sets?",
    created_at: '2023-09-13T15:20:00Z',
    read: true,
    sender: mockUsers[1]
  },
  {
    id: '7',
    sender_id: 'current_user',
    receiver_id: '2',
    content: "Thanks for the kind words! For large data sets, I'd recommend looking into virtualization libraries like react-window or react-virtualized. They only render what's visible in the viewport, which can dramatically improve performance. Happy to chat more about it if you'd like!",
    created_at: '2023-09-13T16:45:00Z',
    read: true
  }
];

export const mockConversations: Conversation[] = [
  {
    id: '1',
    last_message: "Perfect! Let's do 3 PM. I'll send you a calendar invite with the meeting details. Looking forward to our conversation!",
    last_message_time: '2023-09-14T13:00:00Z',
    unread_count: 1,
    user: mockUsers[0]
  },
  {
    id: '2',
    last_message: "Thanks for the kind words! For large data sets, I'd recommend looking into virtualization libraries like react-window or react-virtualized. They only render what's visible in the viewport, which can dramatically improve performance. Happy to chat more about it if you'd like!",
    last_message_time: '2023-09-13T16:45:00Z',
    unread_count: 0,
    user: mockUsers[1]
  }
];