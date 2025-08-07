export interface IVisitedPage {
  title: string;
  url: string;
  visitCount: number;
  startTimestamp: number;
  durationSeconds: number;
}

export interface IHistoryItem {
  id: string;
  lastVisitTime: number;
  title: string;
  typedCount: number;
  url: string;
  visitCount: number;
}

export interface IVisitItem {
  visitId: string;
  visitTime?: number;
  referringVisitId: string;
  transition: string;
}
