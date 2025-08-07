export interface IKeyword {
  keyword: string;
  frequency: number;
}

export interface IKeywordResponse {
  data: {
    keywordFrequencies: Array<IKeyword>;
  };
  msg: string;
  status: number;
}
