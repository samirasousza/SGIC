import type { NotificationType, EmailStatus } from "../types/notificationType";

export interface NotificationModel {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  projectId: string | null;
  read: boolean;
  resolved: boolean;
  createdAt: string;
}

export interface NotificationPreferenceModel {
  type: NotificationType;
  label: string;
  mandatory: boolean;
  emailEnabled: boolean;
}

export interface UpdateNotificationPreferencesModel {
  emailDisabled: NotificationType[];
}

export interface UnreadNotificationsCountModel {
  unread: number;
}

export interface ReminderRunModel {
  alertsCreated: number;
  emailsQueued: number;
  alertsResolved: number;
  alertsPurged: number;
}

export interface EmailDeliveryModel {
  id: string;
  to: string;
  event: string;
  subject: string;
  status: EmailStatus;
  attempts: number;
  createdAt: string;
  sentAt: string | null;
  nextAttemptAt: string | null;
  lastError: string | null;
}

export interface PagedModel<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface GetNotificationsParams {
  unreadOnly?: boolean;
  page?: number;
  size?: number;
  sort?: string[];
}

export interface GetEmailsParams {
  status?: EmailStatus;
  page?: number;
  size?: number;
  sort?: string[];
}
