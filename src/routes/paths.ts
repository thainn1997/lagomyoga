// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    general: {
      attendance: `${ROOTS.DASHBOARD}/attendance`,
      detail: `${ROOTS.DASHBOARD}/attendance/detail`,
    },
    teacher: {
      root: `${ROOTS.DASHBOARD}/teacher`,
    },
    class: {
      root: `${ROOTS.DASHBOARD}/class`,
      create: `${ROOTS.DASHBOARD}/class/create`,
      detail: (id: string) => `${ROOTS.DASHBOARD}/class/${id}`,
    },
    student: {
      root: `${ROOTS.DASHBOARD}/student`,
      create: `${ROOTS.DASHBOARD}/student/create`,
      detail: (id: string) => `${ROOTS.DASHBOARD}/student/${id}`,
    },
    receipt: {
      root: `${ROOTS.DASHBOARD}/receipt`,
      create: `${ROOTS.DASHBOARD}/receipt/create`,
    },
    birthday: {
      root: `${ROOTS.DASHBOARD}/birthday`,
    },
    overview: {
      root: `${ROOTS.DASHBOARD}/overview`,
    },
    time: {
      root: `${ROOTS.DASHBOARD}/time_shift`,
    },
    profile: {
      root: `${ROOTS.DASHBOARD}/profile`,
    },
    invoice: { root: `${ROOTS.DASHBOARD}/invoice` },
    blog: {
      root: `${ROOTS.DASHBOARD}/blog`,
      create: `${ROOTS.DASHBOARD}/blog/create`,
      details: (slug: string) => `${ROOTS.DASHBOARD}/blog/${slug}`,
      edit: (slug: string) => `${ROOTS.DASHBOARD}/blog/${slug}/edit`,
    },
    account: {
      root: `${ROOTS.DASHBOARD}/account`,
    },
  },
};
