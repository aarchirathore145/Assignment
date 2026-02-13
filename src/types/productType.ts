export type HttpError = Error & {
  statusCode?: number;
  code?: number;
  keyPattern?: Record<string, unknown>;
  errors?: Record<string, unknown>;
  value?: unknown;
  name?: string;
  array?: () => Array<{ param?: string; msg?: string }>;
};