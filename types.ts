
export interface ClassicalPiece {
  id: string;
  date: string;
  composer: string;
  title: string;
  year: string;
  era: string;
  performer: string;
  description: string;
  mood: string;
  funFact: string;
  youtubeQuery: string;
}

export enum SubscriptionTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM'
}

export interface UserAccount {
  username: string;
  email: string;
  joinedDate: string;
}

export interface Subscriber {
  email: string;
  date: string;
  tier: SubscriptionTier;
}

export interface BoardPost {
  id: string;
  title: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface SalonPost {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  pieceId?: string;
  instrument?: string;
  aiResponse?: string;
}

export interface Performance {
  id: string;
  title: string;
  date: string;
  venue: string;
  performer: string;
  link: string;
}

export enum ViewState {
  CURATE = 'CURATE',
  HOME = 'HOME',
  HISTORY = 'HISTORY',
  COMMUNITY = 'COMMUNITY',
  PERFORMANCES = 'PERFORMANCES',
  MY_COLLECTION = 'MY_COLLECTION',
  PRICING = 'PRICING',
  ADMIN = 'ADMIN'
}