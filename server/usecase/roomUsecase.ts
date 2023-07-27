import type { RoomModel } from '$/commonTypesWithClient/models';
import { roomsRepository } from '$/repository/roomsRepository';
import { roomIdParser } from '$/service/idParsers';
import { randomUUID } from 'crypto';

export const roomUsecase = {
  pause: async (
    user: RoomModel['userId'],
    status: RoomModel['status'],
    nowtime: RoomModel['nowtime'],
    myposition: RoomModel['myposition'],
    bullet: RoomModel['bullet'],
    enemy: RoomModel['enemy'],
    background: RoomModel['background']
  ) => {
    const newRoom: RoomModel = {
      id: roomIdParser.parse(randomUUID()),
      userId: user,
      status,
      scenario: ['3', '0', '6', '0', '6', '0', '4', '1', '2', '1', '2', '2', '3', '1', '2', '1'],
      nowtime,
      myposition,
      bullet,
      enemy,
      background,
    };
    await roomsRepository.save(newRoom);

    return newRoom;
  },
};
