import type { RoomId, TaskId, UserId } from './branded';

export type UserModel = {
  id: UserId;
  email: string;
  displayName: string | undefined;
  photoURL: string | undefined;
};

export type TaskModel = {
  id: TaskId;
  label: string;
  done: boolean;
  created: number;
};

export type RoomModel = {
  id: RoomId;
  userId: UserId;
  status: string;
  scenario: string[];
  nowtime: number[];
  myposition: number[];
  bullet: string;
  enemy: string;
  background: number[];
  powerup: number[];
  cellcount: number;
};
