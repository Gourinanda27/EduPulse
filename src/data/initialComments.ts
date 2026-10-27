import { Comment } from '../types';

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    postId: 'post-1',
    authorName: 'Alex Thorne',
    authorRole: 'Machine Learning Engineer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    content: 'The explanation of the sqrt(d_k) scaling factor is the clearest I have ever read. I used to struggle to explain to my interns why softmax saturates without it. Excellent post!',
    createdAt: '2 days ago',
    likes: 18
  },
  {
    id: 'c2',
    postId: 'post-1',
    authorName: 'Sophia Chen',
    authorRole: 'CS Graduate Student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    content: 'The PyTorch code snippet is concise and easy to test. Tried it in my local notebook with a small toy sequence and verified the tensor shapes. Thank you Dr. Rostova!',
    createdAt: '1 day ago',
    likes: 7
  },
  {
    id: 'c3',
    postId: 'post-2',
    authorName: 'David Miller',
    authorRole: 'Frontend Developer',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    content: 'Trading space for time using a Set or HashMap saved my team when our search filter choked on 50,000 products! Big-O is truly practical.',
    createdAt: '3 days ago',
    likes: 12
  },
  {
    id: 'c4',
    postId: 'post-3',
    authorName: 'Liam O’Connor',
    authorRole: 'Physics Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
    content: 'The 300 qubits comparison to the total atoms in the observable universe blew my mind. Superposition is so counter-intuitive yet mathematically rigorous.',
    createdAt: '4 days ago',
    likes: 24
  },
  {
    id: 'c5',
    postId: 'post-5',
    authorName: 'Prof. Gabriel K.',
    authorRole: 'Math Educator',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    content: 'The Taylor series grouping of real and imaginary parts into cosine and sine is pure mathematical poetry. Always enjoy sharing this with students.',
    createdAt: '5 days ago',
    likes: 31
  }
];
