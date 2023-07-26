const spawnEnemy = (
  prevEnemy: { x: number; y: number; speedX: number; monster: number; status: number }[],
  enemyType: string
) => {
  //'0' ballspawn
  const ballspawn = () => {
    const newEnemies = [];
    const randomy = Math.floor(Math.random() * (360 - 120 + 1)) + 120;
    for (let i = 0; i < 5; i++) {
      const enemyspwan = {
        x: 640 + i * 50,
        y: randomy,
        speedX: -120,
        monster: 0,
        status: -0.5 * i,
      };
      newEnemies.push(enemyspwan);
    }
    return [...prevEnemy, ...newEnemies];
  };
  //'1' sneakspawn
  const sneakspawn = () => {
    const newEnemies = [];
    const randomy = Math.floor(Math.random() * 241);
    for (let i = 0; i < 2; i++) {
      const enemyspwan = {
        x: 640,
        y: randomy + 240 * i,
        speedX: -110,
        monster: 1,
        status: 0,
      };
      newEnemies.push(enemyspwan);
    }
    return [...prevEnemy, ...newEnemies];
  };

  const updownspawn = () => {
    const newEnemies = [];
    const randomy = Math.floor(Math.random() * 241);
    for (let i = 0; i < 2; i++) {
      const enemyspwan = {
        x: 640,
        y: randomy + 240 * i,
        speedX: -150,
        monster: 2,
        status: 0,
      };
      newEnemies.push(enemyspwan);
    }
    return [...prevEnemy, ...newEnemies];
  };

  switch (enemyType) {
    case '0':
      return ballspawn();
    case '1':
      return sneakspawn();
    case '2':
      return updownspawn();
    default:
      return prevEnemy;
  }
};

export default spawnEnemy;

//スポーンする敵の種類ごとに出る数出る場所を決める
//0はボール
//1はスニーク(ついてくる)
//2は上下移動
//1~∞は追加予定
