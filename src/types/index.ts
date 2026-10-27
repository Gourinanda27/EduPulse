export type Category = 
  | 'All'
  | 'Computer Science'
  | 'Artificial Intelligence'
  | 'Mathematics'
  | 'Physics & Science'
  | 'Web Development'
  | 'Biology & Genetics';

export type Difficulty = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';

export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
}

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorRole: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: Category;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTimeMinutes: number;
  publishDate: string;
  author: Author;
  coverImage: string;
  tags: string[];
  featured?: boolean;
  likes: number;
  views: number;
  content: string;
  quizzes?: QuizQuestion[];
  flashcards?: Flashcard[];
  tableOfContents?: TocItem[];
}

export interface UserStats {
  bookmarkedPostIds: string[];
  likedPostIds: string[];
  completedQuizzes: Record<string, number>; // quizId -> score (0-100)
  recentReadPostIds: string[];
}
