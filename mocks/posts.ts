import { Post } from '@/types';
import { mockUsers } from './users';

export const mockPosts: Post[] = [
  {
    id: '1',
    user_id: '1',
    content: "Excited to announce that we've just launched our new product feature! After months of hard work, our team has delivered something truly innovative. Check it out and let me know what you think! #ProductLaunch #Innovation",
    image_url: 'https://images.unsplash.com/photo-1661956602116-aa6865609028',
    likes_count: 142,
    comments_count: 28,
    created_at: '2023-09-15T14:30:00Z',
    user: mockUsers[0],
    liked_by_me: false
  },
  {
    id: '2',
    user_id: '2',
    content: "Just published a new article on optimizing React performance. I cover techniques like memoization, code splitting, and virtualization that helped us reduce load times by 40%. Link in comments! #ReactJS #WebPerformance #FrontendDevelopment",
    likes_count: 89,
    comments_count: 15,
    created_at: '2023-09-14T10:15:00Z',
    user: mockUsers[1],
    liked_by_me: true
  },
  {
    id: '3',
    user_id: '3',
    content: "Design tip of the day: Always test your UI with real content. Lorem ipsum can hide many design flaws that only become apparent when real data is used. #UXDesign #DesignTips",
    image_url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e',
    likes_count: 76,
    comments_count: 8,
    created_at: '2023-09-13T16:45:00Z',
    user: mockUsers[2],
    liked_by_me: false
  },
  {
    id: '4',
    user_id: '4',
    content: "Attended an amazing conference on AI ethics yesterday. The discussions around responsible AI development were thought-provoking. It's crucial that we build AI systems that are fair, transparent, and accountable. #AIEthics #MachineLearning #DataScience",
    likes_count: 112,
    comments_count: 19,
    created_at: '2023-09-12T09:20:00Z',
    user: mockUsers[3],
    liked_by_me: false
  },
  {
    id: '5',
    user_id: '5',
    content: "Proud to share that our marketing campaign exceeded all KPIs this quarter! A big thanks to my incredible team for their creativity and dedication. #MarketingSuccess #TeamWork",
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
    likes_count: 203,
    comments_count: 31,
    created_at: '2023-09-11T13:10:00Z',
    user: mockUsers[4],
    liked_by_me: true
  },
  {
    id: '6',
    user_id: '1',
    content: "What's one skill you think every professional should develop in 2023? For me, it's adaptability - the ability to quickly learn and adjust to new situations. What about you? #ProfessionalDevelopment #CareerAdvice",
    likes_count: 167,
    comments_count: 42,
    created_at: '2023-09-10T15:30:00Z',
    user: mockUsers[0],
    liked_by_me: false
  }
];