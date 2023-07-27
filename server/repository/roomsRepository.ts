import type { RoomModel } from '$/commonTypesWithClient/models';
import { UserIdParser, roomIdParser } from '$/service/idParsers';
import { prismaClient } from '$/service/prismaClient';
import { randomUUID } from 'crypto';

// const toRoomModel = (prismaRoom: Room): RoomModel => ({
//   id: roomIdParser.parse(prismaRoom.roomId),
//   userId: UserIdParser.parse(prismaRoom.userId),
// });
export const roomsRepository = {
  save: async (room: RoomModel) => {
    await prismaClient.room.upsert({
      where: { userId: room.userId },
      update: {
        status: room.status,
        nowtime: room.nowtime,
        myposition: room.myposition,
        bullet: room.bullet,
        enemy: room.enemy,
        background: room.background,
      },
      create: {
        roomId: room.id,
        userId: room.userId,
        status: room.status,
        scenario: room.scenario,
        nowtime: room.nowtime,
        myposition: room.myposition,
        bullet: room.bullet,
        enemy: room.enemy,
        background: room.background,
      },
    });
  },

  //findRoomでroomをid取得する、roomがなければ作成するようにする
  findRoom: async (userId: string): Promise<RoomModel> => {
    const room = await prismaClient.room.findUnique({
      where: { userId },
    });
    if (room === null) {
      await prismaClient.room.create({
        data: {
          roomId: roomIdParser.parse(randomUUID()),
          userId,
          status: 'started',
          scenario: ['3', '0', '6', '0', '6', '0', '4', '1', '2', '1', '2', '2', '3', '1', '2', '1'],
          nowtime: [0, 0],
          myposition: [0, 0],
          bullet: '[]',
          enemy: '[]',
          background: [450,0,200]
        },
      });
      return await roomsRepository.findRoom(userId);
    } else {
      return {
        id: roomIdParser.parse(room.roomId),
        userId: UserIdParser.parse(room.userId),
        status: room.status,
        scenario: room.scenario,
        nowtime: room.nowtime,
        myposition: room.myposition,
        bullet: room.bullet,
        enemy: room.enemy,
        background: room.background,
      };
    }
  },
};
