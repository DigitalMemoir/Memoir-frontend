export interface IEvent {
  title: string;
  start: Date;
  allDay?: boolean;
}

export interface IDailyKeyword {
  keyword: string;
  frequency: number;
}

export interface IActivityProportion {
  category: string;
  percentage: number;
}

export interface IStatistics {
  totalUsageTimeMinutes: number;
  activityProportions: Array<IActivityProportion>;
}

export interface ITimeLine {
  time: string;
  description: string;
}

export interface ITopKeywords {
  keyword: string;
  frequency: number;
}

export interface IDailyKeyword {
  time: string;
  description: string;
}

export interface ICategorySummaries {
  category: string;
  totalTimeMinutes: number;
}

export interface ISummaryResponse {
  code: number;
  msg: string;
  data: {
    date: string;
    topKeywords: Array<ITopKeywords>;
    dailyTimeline: Array<IDailyKeyword>;
    summaryText: Array<string>;
    activityStats: {
      totalUsageTimeMinutes: number;
      activityProportions: Array<IActivityProportion>;
    };
  };
}
