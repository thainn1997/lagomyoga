import { IClassProps } from './class';

export interface StudentProps {
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
  birthday: string;
  token: string;
  phone: string;
}

export type IReceipt = {
  amount_received: number;
  date_created: string;
  date_updated: string;
  id: string;
  sort: string;
  start_date: string;
  end_date: string;
  status: string;
  student: StudentProps;
  total_sessions: number;
  user_created: string;
  user_updated: string;
  duration: string;
  schedule: Schedule[];
};

export type Schedule = {
  classId: string;
  userId: string;
  data: {
    date: string;
    dayOfWeek: string;
  }[];
};

export type ReciptProps = {
  amount_received: number;
  date_created: string;
  date_updated: string;
  end_date: string;
  id: number | string;
  sort: string;
  start_date: string;
  status: string;
  student: string | StudentProps;
  total_sessions: number;
  user_created: string;
  user_updated: string;
  duration: string;
};

export type IStudentWithReceipt = {
  appearance: string;
  auth_data: string;
  avatar: string;
  birthday: string;
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
  phone: string;
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
  receipt: ReciptProps[] | [];
};

export type IReceiptTableFilterValue = string | string[];

export type IReceiptTableFilters = {
  date_created: string;
  student?: string;
  last_name?: string;
  start_date?: string;
};

export type IReceiptWithSchedule = {
  classId: string;
  cls: IClassProps;
  userId: string;
  data: [
    {
      date: string;
      dayOfWeek: string;
    },
  ];
}[];
