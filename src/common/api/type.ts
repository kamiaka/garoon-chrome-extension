export type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export interface User {
  id: string;
  name: string;
  code: string;
}

export const EventType = {
  Regular: 'REGULAR',
  Repeating: 'REPEATING',
  AllDay: 'ALL_DAY',
} as const;
export type EventType = typeof EventType[keyof typeof EventType];

export const VisibilityType = {
  Public: 'PUBLIC',
  Private: 'PRIVATE',
  SetPrivateWatchers: 'SET_PRIVATE_WATCHERS',
} as const;
export type VisibilityType = typeof VisibilityType[keyof typeof VisibilityType];

export interface CompanyInfo {
  address: string;
  name: string;
  phone: string;
  route: string;
  routeFare: string;
  routeTime: string;
  zipCode: string;
}

export interface Attachment {
  id: string;
  contentType: string;
  name: string;
  size: string;
}

export interface Time {
  dateTime: string;
  timeZone: string;
}

export interface Attendee extends User {
  type: AttendeeType;
  attendanceResponse?: AttendanceResponse;
}

export interface AttendanceResponse {
  status: string;
  comment: string;
}

export const AttendeeType = {
  User: 'USER',
  Organization: 'ORGANIZATION',
} as const;
export type AttendeeType = typeof AttendeeType[keyof typeof AttendeeType];

export interface Watcher extends User {
  type: WatcherType;
}

export const WatcherType = {
  User: 'USER',
  Organization: 'ORGANIZATION',
  Role: 'ROLE',
} as const;
export type WatcherType = typeof WatcherType[keyof typeof WatcherType];

export interface Facility {
  id: string;
  name: string;
  code: string;
}

export interface RepeatInfo {
  range: {
    type: RepeatRangeType;
    date: string;
  };
  period: TimeRange;
  time: TimeRange;
  isAllDay: boolean;
  isStartOnly: boolean;
  timeZone: string;
  dayOfWeek: DayOfWeek;
  dayOfMonth: DayOfMonth;
  exclusiveDateTimes: TimeRange[];
}

export interface TimeRange {
  start: string;
  end: string;
}

export const DayOfWeek = {
  Mon: 'MON',
  Tue: 'TUE',
  Wed: 'WED',
  Thu: 'THU',
  Fri: 'FRI',
  Sat: 'SAT',
  Sun: 'SUN',
} as const;
export type DayOfWeek = typeof DayOfWeek[keyof typeof DayOfWeek];

export type DayOfMonth =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23'
  | '24'
  | '25'
  | '26'
  | '27'
  | '28'
  | '29'
  | '30'
  | '31'
  | 'EOM';

export const RepeatType = {
  EveryWeekday: 'EVERY_WEEKDAY',
  EveryWeek: 'EVERY_WEEK',
  Every1stWeek: 'EVERY_1STWEEK',
  Every2ndWeek: 'EVERY_2NDWEEK',
  Every3rdWeek: 'EVERY_3RDWEEK',
  Every4thWeek: 'EVERY_4THWEEK',
  EveryLastWeek: 'EVERY_LASTWEEK',
  EveryMonth: 'EVERY_MONTH',
} as const;
export type RepeatType = typeof RepeatType[keyof typeof RepeatType];

export const RepeatRangeType = {
  ThisEventOnly: 'THIS_EVENT_ONLY',
  OnAndAfterThisEvent: 'ON_AND_AFTER_THIS_EVENT',
  AllEvent: 'ALL_EVENT',
} as const;
export type RepeatRangeType = typeof RepeatRangeType[keyof typeof RepeatRangeType];

export interface ScheduleEvent {
  id: string;
  creator: User;
  createdAt: string;
  updater: User;
  updatedAt: string;
  eventType: EventType;
  eventMenu: string;
  subject: string;
  notes: string;
  visibilityType: VisibilityType;
  useAttendanceCheck: boolean;
  companyInfo: CompanyInfo;
  attachments: Attachment[];
  start: Time;
  end: Time;
  isAllDay: boolean;
  isStartOnly: boolean;
  originalStartTimeZone: string;
  originalEndTimeZone: string;
  attendees: Attendee[];
  watchers: Watcher[];
  facilities: Facility[];
  facilityUsingPurpose?: string;
  repeatInfo: RepeatInfo;
}

export const ModuleID = {
  Schedule: 'grn.schedule',
  SpaceDiscussion: 'grn.space.discussion',
  Workflow: 'grn.workflow',
  Bulletin: 'grn.bulletin',
} as const;
export type ModuleID = typeof ModuleID[keyof typeof ModuleID];

export interface Notification {
  moduleId: ModuleID;
  notificationKey: string;
  creator: User;
  createdAt: string;
  operation: 'add' | 'modify' | 'remove';
  url: string;
  title: string;
  body: string;
  icon: string;
  isRead: boolean;
  hasNext: boolean;
}
