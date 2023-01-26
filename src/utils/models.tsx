export interface IMessage {
  uid: string;
  content: string;
}
export interface IMessageGroup {
  isSend: boolean;
  group: [string, IMessage[]];
}
export interface IUser {
  authentication_uid: string;
  email: string;
  rooms: [];
}
export interface IRoomItem {
  uid: string;
  members: IUser[];
}
