import { api } from "../config/apiConfig";
import type {
  EmailDeliveryModel,
  GetEmailsParams,
  GetNotificationsParams,
  NotificationModel,
  NotificationPreferenceModel,
  PagedModel,
  ReminderRunModel,
  UnreadNotificationsCountModel,
  UpdateNotificationPreferencesModel,
} from "../models/notificationModel";

const API_URL_NOTIFICATIONS = "/notifications";

export const GetNotificationsPreferences = async (): Promise<
  NotificationPreferenceModel[]
> =>
  (
    await api.get<NotificationPreferenceModel[]>(
      `${API_URL_NOTIFICATIONS}/preferences`,
    )
  ).data;

export const PutNotificationsPreferences = async (
  data: UpdateNotificationPreferencesModel,
): Promise<NotificationPreferenceModel[]> =>
  (
    await api.put<NotificationPreferenceModel[]>(
      `${API_URL_NOTIFICATIONS}/preferences`,
      data,
    )
  ).data;

export const PostNotificationsReaded = async (
  id: string,
): Promise<NotificationModel> =>
  (await api.post<NotificationModel>(`${API_URL_NOTIFICATIONS}/${id}/read`))
    .data;

export const PostNotificationsReminders = async (): Promise<ReminderRunModel> =>
  (await api.post<ReminderRunModel>(`${API_URL_NOTIFICATIONS}/reminders/run`))
    .data;

export const PostAllNotificationsReaded = async (): Promise<void> => {
  await api.post(`${API_URL_NOTIFICATIONS}/read-all`);
};

export const PostResendEmail = async (
  id: string,
): Promise<EmailDeliveryModel> =>
  (
    await api.post<EmailDeliveryModel>(
      `${API_URL_NOTIFICATIONS}/emails/${id}/retry`,
    )
  ).data;

export const GetNotifications = async (
  params?: GetNotificationsParams,
): Promise<PagedModel<NotificationModel>> =>
  (
    await api.get<PagedModel<NotificationModel>>(API_URL_NOTIFICATIONS, {
      params,
    })
  ).data;

export const GetUnreadNotificationsCount =
  async (): Promise<UnreadNotificationsCountModel> =>
    (
      await api.get<UnreadNotificationsCountModel>(
        `${API_URL_NOTIFICATIONS}/unread-count`,
      )
    ).data;

export const GetEmails = async (
  params?: GetEmailsParams,
): Promise<PagedModel<EmailDeliveryModel>> =>
  (
    await api.get<PagedModel<EmailDeliveryModel>>(
      `${API_URL_NOTIFICATIONS}/emails`,
      { params },
    )
  ).data;
