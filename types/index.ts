export interface User {
  id: string;
  name: string;
  avatar: string;
  is_admin: boolean;
  room_id: string;
  joined_at: string;
  last_seen?: string;
}

export interface Room {
  id: string;
  created_at: string;
  last_activity?: string;
  result: ResultData | null;
}

export interface ResultData {
  type: 'winner' | 'loser';
  option_id: string;
}

export interface Option {
  id: string;
  room_id: string;
  text: string;
  created_at: string;
}
