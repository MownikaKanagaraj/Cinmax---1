export interface NotificationDTO {
  id: string;
  user_id?: string | null;
  type: string;
  title: string;
  message: string;
  link?: string | null;
  is_read: boolean;
  created_at: string;
}
