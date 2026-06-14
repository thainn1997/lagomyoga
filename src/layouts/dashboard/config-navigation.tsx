import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useReceipt, useInvoice, useBirthday } from 'src/hooks/use-notification-layout';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import Label from 'src/components/label/label';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

export const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  birthday: icon('ic_birthday'),
  teacher: icon('ic_teacher'),
  checknote: icon('ic_checknote'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const { receipt } = useReceipt();

  const { user }: any = useAuthContext();

  const { currentBirthday } = useBirthday();

  const { invoice } = useInvoice();

  const count =
    ((user?.role === 'eccbe392-2d3f-430a-a00f-121cb2d1d0ad' && receipt?.length) || 0) +
    (currentBirthday?.length || 0);

  const invoices = invoice?.length || 0;

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t('trang chủ'),

        items: [
          {
            title: t('điểm danh'),
            path: paths.dashboard.root,
            icon: ICONS.checknote,
            roles: ['eccbe392-2d3f-430a-a00f-121cb2d1d0ad', 'abd577a9-620f-4b26-8045-1b46485f501f'],
          },
          {
            title: t('tổng quát'),
            path: paths.dashboard.overview.root,
            icon: ICONS.dashboard,
            info: count > 0 ? <Label color="error">+ {count}</Label> : '',
            roles: ['eccbe392-2d3f-430a-a00f-121cb2d1d0ad', 'abd577a9-620f-4b26-8045-1b46485f501f'],
          },
          {
            title: t('giáo viên'),
            path: paths.dashboard.teacher.root,
            roles: ['eccbe392-2d3f-430a-a00f-121cb2d1d0ad', 'abd577a9-620f-4b26-8045-1b46485f501f'],
            icon: ICONS.teacher,
          },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('quản lý'),

        items: [
          {
            title: t('lớp học'),
            path: paths.dashboard.class.root,
            roles: ['eccbe392-2d3f-430a-a00f-121cb2d1d0ad', 'abd577a9-620f-4b26-8045-1b46485f501f'],
            icon: ICONS.job,
            children: [
              { title: t('danh sách lớp'), path: paths.dashboard.class.root },
              {
                title: t('tạo lớp mới'),
                path: paths.dashboard.class.create,
                roles: ['eccbe392-2d3f-430a-a00f-121cb2d1d0ad'],
              },
            ],
          },

          {
            title: t('học viên'),
            path: paths.dashboard.student.root,
            roles: ['eccbe392-2d3f-430a-a00f-121cb2d1d0ad', 'abd577a9-620f-4b26-8045-1b46485f501f'],
            icon: ICONS.label,
            children: [
              {
                title: t('danh sách học viên'),
                path: paths.dashboard.student.root,
              },
              {
                title: t('tạo học viên mới'),
                path: paths.dashboard.student.create,
                roles: ['eccbe392-2d3f-430a-a00f-121cb2d1d0ad'],
              },
            ],
          },
          {
            title: t('biên lai'),
            path: paths.dashboard.receipt.root,
            roles: ['eccbe392-2d3f-430a-a00f-121cb2d1d0ad'],
            icon: ICONS.invoice,
          },
          {
            title: t('sinh nhật'),
            path: paths.dashboard.birthday.root,
            roles: ['eccbe392-2d3f-430a-a00f-121cb2d1d0ad', 'abd577a9-620f-4b26-8045-1b46485f501f'],
            icon: ICONS.birthday,
          },
          {
            title: t('Thời gian'),
            path: paths.dashboard.time.root,
            roles: ['eccbe392-2d3f-430a-a00f-121cb2d1d0ad', 'abd577a9-620f-4b26-8045-1b46485f501f'],
            icon: <Iconify icon="lets-icons:clock-duotone" width={24} />,
          },
          {
            title: t('thông tin'),
            path: paths.dashboard.profile.root,
            icon: ICONS.user,
            roles: ['b49dda8a-60a9-44b5-9d88-9b0db3480741'],
          },
          {
            title: t('Hoá đơn'),
            path: paths.dashboard.invoice.root,
            icon: ICONS.invoice,
            roles: ['b49dda8a-60a9-44b5-9d88-9b0db3480741'],
            info: invoices > 0 ? <Label color="error">+ {invoices}</Label> : '',
          },
          {
            title: t('bài viết'),
            path: paths.dashboard.blog.root,
            icon: ICONS.blog,
            roles: ['eccbe392-2d3f-430a-a00f-121cb2d1d0ad'],
          },
        ],
      },
      {
        subheader: t('tài khoản và bảo mật'),
        items: [{ title: t('tài khoản'), path: paths.dashboard.account.root, icon: ICONS.lock }],
      },
    ],

    [t, count, invoices]
  );

  return data;
}
