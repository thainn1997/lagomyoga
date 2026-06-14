type ITimeShift = {
  id: string;
  date_created: string;
  date_updated: string;
  end_time: string;
  sort: string;
  start_time: string;
  status: string;
  user_created?: string;
  user_updated?: string;
};

export type IDirectusUser = {
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
  id?: string;
  day_studies?: [];
};

export type IClassProps = {
  date_created: string;
  date_updated: string;
  day: [];
  id: string;
  sort: string;
  status: string;
  students: IDirectusUser[];
  time_shift: ITimeShift;
  title: string;
  user_created: string;
  user_updated: string;
  teacher: {
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
};

export type IClassTableFilterValue = string | string[];

export type IClassTableFilters = {
  title: string;
  role?: string[];
  status?: string;
};

export type IClassWithAttendance = {
  attendanceLogs: {
    date_created: string;
    date_updated: string;
    id: string;
    sort: string;
    status: string;
    student: string;
    time_shift: string;
    user_created: string;
    user_updated: string;
  }[];
  date_created: string;
  date_updated: string;
  day: string[];
  id: string;
  sort: string;
  status: string;
  students: {
    directus_users_id: {
      appearance: string;
      auth_data: string;
      avatar: string;
      description: string;
      email: string;
      email_notifications: boolean;
      external_identifier: string;
      first_name: string;
      id: string;
      language: string;
      last_access: string;
      last_name: string;
      last_page: string;
      location: string;
      password: string;
      provider: string;
      role: string;
      status: string;
      tags: string;
      tfa_secret: string;
      theme_dark: string;
      theme_dark_overrides: string;
      theme_light: string;
      theme_light_overrides: string;
      title: string;
      token: string;
    };
  };
  time_shift: {
    date_created: string;
    date_updated: string;
    end_time: string;
    id: string;
    sort: string;
    start_time: string;
    status: string;
    user_created: string;
    user_updated: string;
  };
  title: string;
  user_created: string;
  user_updated: string;
};

export type IClassWithAttendances = {
  class: {
    date_created: string;
    date_updated: string;
    day: string[];
    id: number | string;
    sort: string;
    status: string;
    students: string[] | number[];
    time_shift: string;
    title: string;
    user_created: string;
    user_updated: string;
  };
  date_created: string;
  date_updated: string;
  id: string;
  sort: string;
  status: string;
  student: string;
  time_shift: {
    date_created: string;
    date_updated: string;
    end_time: string;
    id: string;
    sort: string;
    start_time: string;
    status: string;
    user_created: string;
    user_updated: string;
  };
  type: string;
  user_created: string;
  user_updated: string;
};
