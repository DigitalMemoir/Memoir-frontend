export interface IEvent {
  title: string;
  start: Date;
  allDay?: boolean;
}

export interface IPopupProps {
  dateString: string;
  tailYPosition: 'top' | 'bottom';
  tailXPosition: 'left' | 'right';
}
