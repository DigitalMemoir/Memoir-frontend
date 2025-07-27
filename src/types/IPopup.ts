export interface IPopupData {
  date: string;
  title: string[];
}

export interface IPopupResponse {
  code: number;
  msg: string;
  data: IPopupData;
}

export interface IPopupProps {
  dateString: string;
  tailYPosition: 'top' | 'bottom';
  tailXPosition: 'left' | 'right';
  openDetail: () => void;
}
