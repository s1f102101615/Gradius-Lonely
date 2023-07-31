/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable max-depth */
/* eslint-disable max-nested-callbacks */
/* eslint-disable react-hooks/exhaustive-deps */
import type { RoomModel } from '$/commonTypesWithClient/models';
import { useAtom } from 'jotai';
import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { Circle, Image, Layer, Line, Rect, Stage, Text } from 'react-konva';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import { userAtom } from '../atoms/user';
import spawnEnemy from './spawnEnemy';
import updateEnemy from './updateEnemy';

const Home = () => {
  const [user] = useAtom(userAtom);
  const [nowkey, setNowkey] = useState([0, 0]);
  const [enemy, setEnemy] = useState<
    { x: number; y: number; speedX: number; monster: number; status: number }[]
  >([]);
  const [room, setRoom] = useState<RoomModel>();
  const [nowtime, setNowtime] = useState([0, 0]);
  const [gradius_bullet, setGradius_bullet] = useState<{ x: number; y: number; speedX: number ; speedY:number ; status:number}[]>(
    []
  );
  const [up, setUp] = useState(false);
  const [down, setDown] = useState(false);
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);
  const [bullet, setBullet] = useState(false);
  const [missile, setMissile] = useState(false);
  const [missiletimer, setMissiletimer] = useState(0);
  const [shottimer, setShottimer] = useState(0);
  const animationRef = useRef<Konva.Animation | null>(null);
  const [imageBack, setImageBack] = useState(new window.Image());
  const [imageMiddle, setImageMiddle] = useState(new window.Image());
  const [middle1, setMiddle1] = useState(450);
  const [middle2, setMiddle2] = useState(0);
  const [middle3, setMiddle3] = useState(200);
  const [powerup, setPowerup] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [cellcount, setCellcount] = useState<number>(0);
  const [score, setScore] = useState(0);

  //キーを押したときに実行される関数
  const handleKeyDown = async (event: KeyboardEvent) => {
    switch (event.code) {
      case 'ArrowUp':
        setUp(true);
        break;
      case 'ArrowDown':
        setDown(true);
        break;
      case 'ArrowLeft':
        setLeft(true);
        break;
      case 'ArrowRight':
        setRight(true);
        break;
      case 'KeyZ':
        setBullet(true);
        break;
      case 'KeyC':
        if (!event.repeat) {
          await apiClient.powerup.get();
          rendRooms();
        }
        break;
      case 'KeyX':
        setMissile(true);
        break;
    }
  };

  // キーを離したときに実行される関数
  const handleKeyUp = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'ArrowUp':
        setUp(false);
        break;
      case 'ArrowDown':
        setDown(false);
        break;
      case 'ArrowLeft':
        setLeft(false);
        break;
      case 'ArrowRight':
        setRight(false);
        break;
      case 'KeyZ':
        setBullet(false);
        break;
      case 'KeyX':
        setMissile(false);
        break;
    }
  };

  //敵と球が接触しているか確かめる関数
  function checkCollision(
    bullet: { x: number; y: number; speedX: number },
    enemy: { x: number; y: number; speedX: number }
  ) {
    const bullet_radius = 10;
    const enemy_radius = 22.5;
    const dx = bullet.x - enemy.x;
    const dy = bullet.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const collisionDistance = bullet_radius + enemy_radius;
    return distance <= collisionDistance;
  }
  // 弾と敵が接触していたら消滅
  const checkCollisions = () => {
    setEnemy((prevEnemies) => {
      return prevEnemies.filter((enemy) => {
        const collision = gradius_bullet.some((bullet) => checkCollision(bullet, enemy));
        if (collision) {
          // 接触した敵は除外する
          setGradius_bullet((prevBullets) => {
            setScore(score + 100);
            return prevBullets.filter((bullet) => !checkCollision(bullet, enemy));
          });
          return false;
        }
        return true;
      });
    });
  };

  const rendRooms = async () => {
    const box = await apiClient.rooms.get();
    setPowerup(box.body.powerup);
    setCellcount(box.body.cellcount);
  };
  //再描画
  const fetchRooms = async () => {
    const box = await apiClient.rooms.get();

    const image = new window.Image();
    image.src = '/images/back.png';
    image.onload = () => {
      setImageBack(image);
    };
    const image2 = new window.Image();
    image2.src = '/images/middle.png';
    image2.onload = () => {
      setImageMiddle(image2);
    };

    setMiddle1(box.body.background[0]);
    setMiddle2(box.body.background[1]);
    setMiddle3(box.body.background[2]);
    setRoom(box.body);
    setNowtime(box.body.nowtime);
    setGradius_bullet(JSON.parse(box.body.bullet));
    setEnemy(JSON.parse(box.body.enemy));
    setNowkey(box.body.myposition);
    setPowerup(box.body.powerup);
    setCellcount(box.body.cellcount);
    setScore(box.body.score);
    //start後加速している 敵と球が一種類だから可能(多分後で変える)
    setGradius_bullet((prev) =>
      prev.map((bullet) => ({
        ...bullet,
        speedX: 1000, // speedXを元の値に戻す
      }))
    );
  };

  //room読み込み作成
  useEffect(() => {
    fetchRooms();
  }, []);

  //シナリオ制御
  useEffect(() => {
    let time = nowtime[0];
    const now = nowtime[1];
    const interval = setInterval(() => {
      if (room?.status === 'started') {
        setNowtime([time + 1, now]);
        console.log(time);
        if (room.scenario && Number(room.scenario[now]) === time) {
          console.log(room.scenario[now + 1]);
          setEnemy((prevEnemy) => spawnEnemy(prevEnemy, room.scenario[now + 1]));
          time = 0;
          setNowtime([time, now + 2]);
        }
      }
    }, 1000);
    const autosave = setInterval(async () => {
      const pack = [middle1, middle2, middle3];
      const middle = pack.map((value) => Math.round(value));
      await apiClient.rooms.post({
        body: {
          status: 'paused',
          nowtime,
          myposition: nowkey,
          bullet: JSON.stringify(gradius_bullet),
          enemy: JSON.stringify(enemy),
          background: middle,
          powerup,
          cellcount,
          score,
        },
      });
    }, 1000);

    return () => {
      clearInterval(autosave);
      clearInterval(interval); // コンポーネントがアンマウントされたときにインターバルをクリアしてメモリリークを防止します。
    };
  }, [room, nowtime]);

  //高速で実行される(Animation)
  useEffect(() => {
    const anim = new Konva.Animation((frame) => {
      if (frame) {
        const timeDiff = frame.timeDiff / 1000; // ミリ秒を秒に変換
        if (room?.status === 'started') {
          //背景移動
          if (middle1 >= imageMiddle.width) {
            setMiddle1(0);
          }
          setMiddle1((before) => before + 320 * timeDiff);
          if (middle2 >= imageMiddle.width) {
            setMiddle2(0);
          }
          setMiddle2((before) => before + 160 * timeDiff);
          if (middle3 >= imageMiddle.width) {
            setMiddle3(0);
          }
          setMiddle3((before) => before + 80 * timeDiff);
          //自機移動
          const nowstate = nowkey;
          nowstate[0] = Math.min(
            Math.max(nowkey[0] + (up ? -powerup[0] - 1 : 0) + (down ? powerup[0] + 1 : 0), 0),
            416
          );
          nowstate[1] = Math.min(
            Math.max(nowkey[1] + (left ? -powerup[0] - 1 : 0) + (right ? powerup[0] + 1 : 0), 0),
            590
          );
          setNowkey(nowstate);
          //弾発射
          setShottimer(shottimer + timeDiff);
          if (bullet) {
            if (shottimer > 0.3) {
              setGradius_bullet((prevGradius_bullet) => {
                if (powerup[2] === 1) {
                  return [
                    ...prevGradius_bullet,
                    { x: nowkey[1] + 54, y: nowkey[0] + 20, speedX: 1000, speedY: 0, status: 0 },
                    { x: nowkey[1] + 54, y: nowkey[0] + 10, speedX: 1000, speedY: -1000, status: 0 },
                  ];
                } else {
                  return [
                    ...prevGradius_bullet,
                    { x: nowkey[1] + 54, y: nowkey[0] + 20, speedX: 1000, speedY: 0, status: 0 },
                  ];
                }
              });
              
              setShottimer(0);
            }
          }
          //ミサイル発射
          if (powerup[1] === 1) {
          setMissiletimer(missiletimer + timeDiff);
          if (missile) {
            if (missiletimer > 0.3) {
              setGradius_bullet((prevGradius_bullet) => [
                ...prevGradius_bullet,
                { x: nowkey[1] + 54, y: nowkey[0] + 40, speedX: 800, speedY: 800 , status: 1 },
              ]);
              setMissiletimer(0);
            }
          }
          }
        }

        // ボールの位置や状態を更新する処理
        setGradius_bullet(
          (prev) =>
            prev
              .map((bullet) => ({
                ...bullet,
                x: bullet.x + bullet.speedX * timeDiff,
                y: bullet.y + bullet.speedY * timeDiff,
                speedX: room?.status === 'paused' ? 0 : bullet.speedX, // pause中はspeedXを0にする
                speedY: room?.status === 'paused' ? 0 : bullet.speedY, // pause中はspeedYを0にする
              }))
              .filter((bullet) => bullet.x < 640 && bullet.y < 480) // 画面の右端に到達していない弾のみをフィルタリング
        );
        // 敵の動き
        setEnemy((prev) => updateEnemy(prev, room?.status, timeDiff, nowkey));
        // 弾と敵が当たっているか
        checkCollisions();
      }
    });
    anim.start();

    animationRef.current = anim;

    return () => {
      anim.stop();
    };
  }, [gradius_bullet, enemy, up, down, left, right, nowkey]);

  //キー入力検知
  useEffect(() => {
    // コンポーネントがマウントされたときにイベントリスナーを追加
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // コンポーネントがアンマウントされるときにイベントリスナーを削除
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  //ポーズと再開の処理ポーズ   ブラウザバックとリロード時にも起動するように今後する。
  const pause = async () => {
    const pack = [middle1, middle2, middle3];
    const middle = pack.map((value) => Math.round(value));
    await apiClient.rooms.post({
      body: {
        status: 'paused',
        nowtime,
        myposition: nowkey,
        bullet: JSON.stringify(gradius_bullet),
        enemy: JSON.stringify(enemy),
        background: middle,
        powerup,
        cellcount,
        score,
      },
    });
    fetchRooms();
    console.log('pause');
  };

  const start = async () => {
    const pack = [middle1, middle2, middle3];
    const middle = pack.map((value) => Math.round(value));
    // 次の行のnowtime赤線が出るから一応書いておいた
    await apiClient.rooms.post({
      body: {
        status: 'started',
        nowtime,
        myposition: nowkey,
        bullet: JSON.stringify(gradius_bullet),
        enemy: JSON.stringify(enemy),
        background: middle,
        powerup,
        cellcount,
        score,
      },
    });
    fetchRooms();
    console.log('start');
  };

  const restart = async () => {
    const pack = [middle1, middle2, middle3];
    const middle = pack.map((value) => Math.round(value));
    await apiClient.rooms.post({
      body: {
        status: 'paused',
        nowtime: [0, 0],
        myposition: [0, 0],
        bullet: JSON.stringify([]),
        enemy: JSON.stringify([]),
        background: middle,
        powerup,
        cellcount,
        score,
      },
    });
    fetchRooms();
    console.log('restart');
  };

  const cellplus = async () => {
    setCellcount(cellcount + 1);
  };

  if (!user) return <Loading visible />;
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <p>gradius{nowkey}</p>
        <div tabIndex={0} style={{ display: 'inline-block', border: 'solid' }}>
          <Stage width={640} height={480}>
            <Layer>
              {/* 背景処理 */}
              <Image image={imageBack} />
              <Image image={imageMiddle} x={-middle1} opacity={0.4} />
              {middle1 >= 320 && (
                <Image image={imageMiddle} x={-middle1 + imageMiddle.width} opacity={0.4} />
              )}
              <Image image={imageMiddle} x={-middle2} opacity={0.3} />
              {middle2 >= 320 && (
                <Image image={imageMiddle} x={-middle2 + imageMiddle.width} opacity={0.3} />
              )}
              <Image image={imageMiddle} x={-middle3} opacity={0.2} />
              {middle3 >= 320 && (
                <Image image={imageMiddle} x={-middle3 + imageMiddle.width} opacity={0.2} />
              )}
              {/* 自機早めに変えたい */}
              <Rect x={nowkey[1]} y={nowkey[0]} width={50} height={40} fill="white" />
              {/* 敵 */}
              {enemy.map((state, index) => (
                <Circle
                  key={index}
                  x={state.x}
                  y={state.y}
                  radius={20}
                  fill={state.monster === 1 ? 'pink' : state.monster === 2 ? 'white' : 'red'}
                />
              ))}
              {/* 玉 */}
              {gradius_bullet.map((bullet, index) => (
                <Circle key={index} x={bullet.x} y={bullet.y} radius={10} fill={bullet.status === 0 ? 'yellow' : 'green'} />
              ))}
              {/* パワーアップ欄 */}
              <Rect
                key={1}
                x={80}
                y={458}
                width={75}
                height={20}
                fill={(cellcount - 1) % 6 === 0 ? 'black' : '#C0C0C0'}
              />
              <Rect
                key={2}
                x={160}
                y={458}
                width={75}
                height={20}
                fill={(cellcount - 1) % 6 === 1 ? 'black' : '#C0C0C0'}
              />
              <Rect
                key={3}
                x={240}
                y={458}
                width={75}
                height={20}
                fill={(cellcount - 1) % 6 === 2 ? 'black' : '#C0C0C0'}
              />
              <Rect
                key={4}
                x={320}
                y={458}
                width={75}
                height={20}
                fill={(cellcount - 1) % 6 === 3 ? 'black' : '#C0C0C0'}
              />
              <Rect
                key={5}
                x={400}
                y={458}
                width={75}
                height={20}
                fill={(cellcount - 1) % 6 === 4 ? 'black' : '#C0C0C0'}
              />
              <Rect
                key={6}
                x={480}
                y={458}
                width={75}
                height={20}
                fill={(cellcount - 1) % 6 === 5 ? 'black' : '#C0C0C0'}
              />
              {/* ボーダー */}
              <Line
                points={[80, 458, 555, 458, 555, 478, 80, 478, 80, 458]}
                closed
                stroke="gray"
                strokeWidth={3}
              />
              <Rect x={155} y={458} width={5} height={20} fill="gray" />
              <Rect x={235} y={458} width={5} height={20} fill="gray" />
              <Rect x={315} y={458} width={5} height={20} fill="gray" />
              <Rect x={395} y={458} width={5} height={20} fill="gray" />
              <Rect x={475} y={458} width={5} height={20} fill="gray" />
              {/* テキスト */}
              <Text
                x={83} // テキストのX座標（中央に配置するための位置）
                y={463} // テキストのY座標（中央に配置するための位置）
                fill={(cellcount - 1) % 6 === 0 ? 'white' : 'black'} // テキストの色を黒色に設定
                fontSize={13} // テキストのフォントサイズを指定
                text="SPEEDUP" // テキストの内容を指定
              />
              <Text
                x={167} // テキストのX座標（中央に配置するための位置）
                y={463} // テキストのY座標（中央に配置するための位置）
                fill={(cellcount - 1) % 6 === 1 ? 'white' : 'black'} // テキストの色を黒色に設定
                fontSize={13} // テキストのフォントサイズを指定
                text={powerup[1] === 1 ? '' : 'MISSILE'} // テキストの内容を指定
              />
              <Text
                x={246} // テキストのX座標（中央に配置するための位置）
                y={463} // テキストのY座標（中央に配置するための位置）
                fill={(cellcount - 1) % 6 === 2 ? 'white' : 'black'} // テキストの色を黒色に設定
                fontSize={13} // テキストのフォントサイズを指定
                text={powerup[2] === 1 ? '' : 'DOUBLE'} // テキストの内容を指定
              />
              <Text
                x={333} // テキストのX座標（中央に配置するための位置）
                y={463} // テキストのY座標（中央に配置するための位置）
                fill={(cellcount - 1) % 6 === 3 ? 'white' : 'black'} // テキストの色を黒色に設定
                fontSize={13} // テキストのフォントサイズを指定
                text={powerup[3] === 1 ? '' : 'LASER'} // テキストの内容を指定
              />
              <Text
                x={407} // テキストのX座標（中央に配置するための位置）
                y={463} // テキストのY座標（中央に配置するための位置）
                fill={(cellcount - 1) % 6 === 4 ? 'white' : 'black'} // テキストの色を黒色に設定
                fontSize={13} // テキストのフォントサイズを指定
                text="OPTION" // テキストの内容を指定
              />
              <Text
                x={513} // テキストのX座標（中央に配置するための位置）
                y={463} // テキストのY座標（中央に配置するための位置）
                fill={(cellcount - 1) % 6 === 5 ? 'white' : 'black'} // テキストの色を黒色に設定
                fontSize={13} // テキストのフォントサイズを指定
                text={powerup[5] === 1 ? '' : '?'} // テキストの内容を指定
              />
              {/* スコア */}
              <Text
                x={0} // テキストのX座標（中央に配置するための位置）
                y={0} // テキストのY座標（中央に配置するための位置）
                fill= 'white' // テキストの色を黒色に設定
                fontSize={22} // テキストのフォントサイズを指定
                text= {'score: ' +  score} // テキストの内容を指定
              />
            </Layer>
          </Stage>
        </div>
        <div onClick={pause}>pause</div>
        <div onClick={start}>start</div>
        <div onClick={restart}>restart</div>
        <div>{powerup}</div>
        <div onClick={cellplus}>{cellcount}</div>
        <div>
          {nowtime[0]}秒{nowtime[1] / 2}wave
        </div>
        <div>{score}</div>
      </div>
    </>
  );
};

export default Home;
