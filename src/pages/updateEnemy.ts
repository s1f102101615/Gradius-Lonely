

/* eslint-disable complexity */
const updateEnemy = (
  enemies: { x: number; y: number; speedX: number; monster: number; status: number }[],
  roomStatus: string | undefined,
  timeDiff: number,
  nowkey: number[]
) => {
  return enemies
    .map((enemy) => {
      switch (enemy.monster) {
        case 0:
          return {
            ...enemy,
            status: roomStatus === 'paused' ? enemy.status : enemy.status + timeDiff,
            x:
              enemy.x +
              (roomStatus === 'paused'
                ? 0
                : (enemy.status + timeDiff >= 3 && enemy.status + timeDiff <= 3.7) ||
                  (enemy.status + timeDiff >= 5 && enemy.status + timeDiff <= 7) ||
                  enemy.status + timeDiff >= 7
                ? -enemy.speedX * timeDiff
                : enemy.speedX * timeDiff), // pause中はspeedXを0にする
            y:
              enemy.y +
              (roomStatus === 'paused'
                ? 0
                : (enemy.status + timeDiff >= 3 && enemy.status + timeDiff <= 3.7) ||
                  (enemy.status + timeDiff >= 5 && enemy.status + timeDiff <= 7)
                ? -60 * timeDiff
                : 0),
          };
        case 1:
          return {
            ...enemy,
            status: roomStatus === 'paused' ? enemy.status : enemy.status + timeDiff,
            x: enemy.x + (roomStatus === 'paused' ? 0 : enemy.speedX * timeDiff),
            y:
              enemy.status + timeDiff >= 2.5
                ? enemy.y +
                  (roomStatus === 'paused'
                    ? 0
                    : enemy.y - nowkey[0] - 20 >= 0
                    ? -35 * timeDiff
                    : 35 * timeDiff)
                : enemy.y,
          };
        case 2:
          return {
            ...enemy,
            status: roomStatus === 'paused' ? enemy.status : enemy.status + timeDiff,
            x: enemy.x + (roomStatus === 'paused' ? 0 : enemy.speedX * timeDiff),
            //8が上下の速度 1.5が上下の振幅
            y: enemy.y + (roomStatus === 'paused' ? 0 : Math.sin(8*(enemy.status + timeDiff)) * 1.5),
          }
        default:
          return {
            ...enemy,
          };
      }
    })
    .filter((enemy) => enemy.x > 0); // 画面の左端に到達していない敵のみをフィルタリング
};

export default updateEnemy;

//また敵0にしか対応していない今後追加予定(0もまだミラーにできてない*上から出たら下の方に曲がる)
