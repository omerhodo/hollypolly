export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string
          created_at: string
          result: Json | null
        }
        Insert: {
          id: string
          created_at?: string
          result?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          result?: Json | null
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          name: string
          avatar: string
          is_admin: boolean
          room_id: string
          joined_at: string
        }
        Insert: {
          id: string
          name: string
          avatar: string
          is_admin?: boolean
          room_id: string
          joined_at?: string
        }
        Update: {
          id?: string
          name?: string
          avatar?: string
          is_admin?: boolean
          room_id?: string
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_room_id_fkey"
            columns: ["room_id"]
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          }
        ]
      }
      options: {
        Row: {
          id: string
          room_id: string
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          text: string
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          text?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "options_room_id_fkey"
            columns: ["room_id"]
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
