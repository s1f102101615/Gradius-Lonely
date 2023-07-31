import type { UserId } from '$/commonTypesWithClient/branded';
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
    background: RoomModel['background'],
    powerup: RoomModel['powerup'],
    cellcount: RoomModel['cellcount'],
    score: RoomModel['score'],
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
      powerup,
      cellcount,
      score,
    };
    await roomsRepository.save(newRoom);

    return newRoom;
  },
  powerup: async (userId: UserId) => {
    const room = await roomsRepository.findRoom(userId);

    const powerposition = (room.cellcount - 1) % 6;
    if (
      (powerposition > 0 && powerposition !== 4 && room.powerup[powerposition] === 1) ||
      room.cellcount === 0
    ) {
      return [room.powerup, room.cellcount];
    }
    room.powerup[powerposition] += 1;
    room.cellcount = 0;
    await roomsRepository.save(room);
    return [room.powerup, room.cellcount];
  },
};
