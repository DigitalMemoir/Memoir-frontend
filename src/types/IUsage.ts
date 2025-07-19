export interface IActivityStats {
  totalUsageTimeMinutes: number;
  categorySummaries: ICategorySummary[];
  hourlyActivityBreakdown: IHourlyBreakdown[];
}

export interface ICategorySummary {
  category: Category;
  totalTimeMinutes: number;
}

export interface IHourlyBreakdown {
  hour: number;
  totalUsageMinutes: number;
  categoryMinutes: {
    '공부, 학습'?: number;
    '업무, 프로젝트'?: number;
    '뉴스, 정보 탐색'?: number;
    쇼핑?: number;
    '콘텐츠 소비'?: number;
  };
}

export interface IActivityStatsResponse {
  msg: string;
  data: IActivityStats;
  status: number;
}

export type Category =
  | '공부, 학습'
  | '업무, 프로젝트'
  | '뉴스, 정보 탐색'
  | '쇼핑'
  | '콘텐츠 소비';
