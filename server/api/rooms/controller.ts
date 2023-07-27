import { roomsRepository } from '$/repository/roomsRepository';
import { roomUsecase } from '$/usecase/roomUsecase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ user }) => ({ status: 200, body: await roomsRepository.findRoom(user.id) }),
  post: async ({ user, body }) => ({
    status: 201,
    body: await roomUsecase.pause(
      user.id,
      body.status,
      body.nowtime,
      body.myposition,
      body.bullet,
      body.enemy,
      body.background,
      body.powerup,
      body.cellcount
    ),
  }),
}));
