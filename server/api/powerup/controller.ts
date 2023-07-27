import { roomUsecase } from '$/usecase/roomUsecase';
import { defineController } from './$relay';


export default defineController(() => ({
  get: async ({ user }) => ({ status: 200, body: await roomUsecase.powerup(user.id) })
}));