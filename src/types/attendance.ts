export type IAttendanceLog = {
  date_created: string;
  date_updated: string;
  id: string;
  sort: string;
  status: string;
  student: string;
  user_created: string;
  user_updated: string;
  time_shift: string;
  class: string;
  type: string;
};

export type IStudentsWithAttendance = {
  directus_users_id: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    location: string;
    title: string;
    description: string;
    tags: string;
    avatar: string;
    language: string;
    tfa_secret: string;
    status: string;
    role: string;
    token: string;
    last_access: string;
    last_page: string;
    provider: string;
    external_identifier: string;
    auth_data: string;
    email_notifications: boolean;
    appearance: string;
    theme_dark: string;
    theme_light: string;
    theme_light_overrides: string;
    theme_dark_overrides: string;
  };
  attendanceLogs?: {
    id: string;
    status: string;
    sort: string;
    user_created: string;
    date_created: string;
    user_updated: string;
    date_updated: string;
    student: string;
    time_shift: string;
    class: string;
    type: string;
  };
};
