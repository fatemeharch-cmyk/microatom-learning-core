/**
 * Typed endpoint definitions for future Xano API integration.
 * These are path templates only — not yet wired to a real backend.
 */

export const endpoints = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
    userRoles: "/auth/user/roles",
  },
  student: {
    dashboard: "/student/dashboard",
    todayPlan: "/student/today-plan",
    learningJournal: "/student/learning-journal",
    growthPath: "/student/growth-path",
    resources: "/student/resources",
  },
  teacher: {
    dashboard: "/teacher/dashboard",
    schedule: "/teacher/schedule",
    classLogs: "/teacher/class-logs",
    students: "/teacher/students",
    insights: "/teacher/insights",
  },
  supervisor: {
    dashboard: "/supervisor/dashboard",
    mentoring: "/supervisor/mentoring",
    followups: "/supervisor/followups",
    turboSummary: "/supervisor/turbo-summary",
    weeklyFeedback: "/supervisor/weekly-feedback",
    studentProfile: (studentId: string) => `/supervisor/students/${studentId}`,
  },
  parent: {
    dashboard: "/parent/dashboard",
    childCalendar: (childId: string) => `/parent/children/${childId}/calendar`,
    childGrowth: (childId: string) => `/parent/children/${childId}/growth`,
    weeklySummary: "/parent/weekly-summary",
    meetings: "/parent/meetings",
    companion: "/parent/companion",
  },
  admin: {
    dashboard: "/admin/dashboard",
    users: "/admin/users",
    classrooms: "/admin/classrooms",
    schedule: "/admin/schedule",
    calendar: "/admin/calendar",
    registration: "/admin/registration",
    feedback: "/admin/feedback",
    system: "/admin/system",
  },
  homework: {
    list: "/homework",
    byStudent: (studentId: string) => `/homework/students/${studentId}`,
    detail: (id: string) => `/homework/${id}`,
  },
  exams: {
    list: "/exams",
    insights: (studentId: string) => `/exams/insights/${studentId}`,
    detail: (id: string) => `/exams/${id}`,
    // Biology exam endpoints live on a dedicated Xano API group.
    sessionCreate: "https://x8ki-letl-twmt.n7.xano.io/api:biology/exam/session/create",
    answerSubmit: "https://x8ki-letl-twmt.n7.xano.io/api:biology/exam/answer/submit",
    result: "https://x8ki-letl-twmt.n7.xano.io/api:biology/exam/result",
    recommendation: "https://x8ki-letl-twmt.n7.xano.io/api:biology/exam/recommendation",
  },
  calendar: {
    byRole: (role: string) => `/calendar/${role}`,
    today: (role: string) => `/calendar/${role}/today`,
  },
  notifications: {
    byRole: (role: string) => `/notifications/${role}`,
    markRead: (id: string) => `/notifications/${id}/read`,
  },
  mentoring: {
    sessions: "/mentoring/sessions",
    detail: (id: string) => `/mentoring/sessions/${id}`,
    notes: (sessionId: string) => `/mentoring/sessions/${sessionId}/notes`,
  },
  resources: {
    list: "/resources",
    byAtomBit: (atomBitId: string) => `/resources/atom-bit/${atomBitId}`,
  },
  feedback: {
    weekly: "/feedback/weekly",
    school: "/feedback/school",
    submit: "/feedback",
  },
} as const;

export type Endpoints = typeof endpoints;
