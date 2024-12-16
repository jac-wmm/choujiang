import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import './App.css';

const employees = [
  { name: "阿萨德", years: 1 },
  { name: "王墨镜", years: 3 },
  { name: "王五", years: 2 },
  { name: "赵六", years: 4 },
  { name: "孙七", years: 0 },
  { name: "周八", years: 3 },
  { name: "吴九", years: 5 },
  { name: "郑十", years: 2 },
  { name: "孙七", years: 0 },
  { name: "周八", years: 3 },
  { name: "吴九", years: 5 },
  { name: "郑十", years: 2 },
  { name: "孙七", years: 0 },
  { name: "周八", years: 3 },
  { name: "吴九", years: 5 },
  { name: "郑十", years: 2 }, { name: "孙七", years: 0 },
  { name: "周八", years: 3 },
  { name: "吴九", years: 5 },
  { name: "郑十", years: 2 }, { name: "孙七", years: 0 },
  { name: "周八", years: 3 },
  { name: "吴九", years: 5 },
  { name: "郑十", years: 2 },
  { name: "孙七", years: 0 },
  { name: "周八", years: 3 },
  { name: "吴九", years: 5 },
  { name: "郑十", years: 2 },
  { name: "孙七", years: 0 },
  { name: "周八", years: 3 },
  { name: "吴九", years: 5 },
  { name: "郑十", years: 2 },
];

const LotteryApp = () => {
  const mountRef = useRef(null);
  const [winners, setWinners] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prizeLevel, setPrizeLevel] = useState("3rd");
  const rotationSpeed = useRef(0.01);

  const config = {
    "3rd": { count: 1, minYears: 0 },
    "2nd": { count: 1, minYears: 2 },
    "1st": { count: 1, minYears: 3 },
  };

  useEffect(() => {
    // 初始化场景、相机和渲染器
    if (isDrawing) {

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      // 加载字体
      const loader = new FontLoader();
      loader.load("zhw.json", // 请替换为实际路径
        (font) => {
          const group = new THREE.Group();

          // 创建文字
          employees.forEach((employee, index) => {
            const textGeometry = new TextGeometry(employee.name, {
              font,
              size: 0.25,
              depth: 0.01,
            });
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            // 设置文字初始位置
            textMesh.position.set(
              (Math.random() - 0.5) * 5, // x 随机分布
              (Math.random() - 0.5) * 5, // y 随机分布
              Math.random() * -10 - 2 // z 初始距离相机较近
            );
            group.add(textMesh);
          });
          scene.add(group);

          // 动画效果
          const animate = () => {
            group.children.forEach((textMesh) => {
              // 沿 z 轴向远处移动
              textMesh.position.z += 0.1;
              // 当超出视野范围时，重置位置
              if (textMesh.position.z > 5) {
                textMesh.position.z = Math.random() * -10 - 2; // 重置到靠近相机处
                textMesh.position.x = (Math.random() - 0.5) * 5; // 重置 x 轴
                textMesh.position.y = (Math.random() - 0.5) * 5; // 重置 y 轴
              }
            });

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
          };
          animate();
        }
      );

    }

    // 清理函数
    return () => {
      while (mountRef.current && mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
    };
  }, [isDrawing]);

  const startDrawing = () => {
    if (isDrawing) return;
    setIsDrawing(true);

    const prize = config[prizeLevel];
    const eligible = employees.filter((emp) => emp.years >= prize.minYears);

    if (eligible.length < prize.count) {
      alert("参与人数不足！");
      setIsDrawing(false);
      return;
    }

    rotationSpeed.current = 0.2;

    setTimeout(() => {
      rotationSpeed.current = 0.01;
      const winners = [];
      for (let i = 0; i < prize.count; i++) {
        const winner = eligible.splice(
          Math.floor(Math.random() * eligible.length),
          1
        )[0];
        winners.push(winner.name);
      }

      setWinners(winners);
      setIsDrawing(false);
    }, 3000);
  };

  console.log('isDrawing',isDrawing);
  

  return (
    <div className="container">
      <video src="video.mp4" autoPlay muted loop className="video"></video>
      <audio src="bgm.mp3" className="audio"></audio>
      {
        isDrawing ? (
          <div ref={mountRef} className="three"></div>
        ) :
          <div className="giftContainer">
            <div className="row">
              <h2>奖品展示</h2>
            </div>
            <div className="row">
              <div className="gift"> <img className="" src="1.png" width="200" />
                <h4>惊喜奖(幸运躺赢5天假)</h4>
              </div>
              <div className="gift"> <img className="" src="2.png" width="200" />
                <h4>一等奖(华为手机)</h4>
              </div>
              <div className="gift"> <img className="" src="3.png" width="200" />
                <h4>二等奖(平板电脑)</h4>
              </div>
              <div className="gift"> <img className="" src="4.png" width="200" />
                <h4>三等奖(智能手表)</h4>
              </div>
            </div>
          </div>
      }

      <div className="config">
        <select
          onChange={(e) => setPrizeLevel(e.target.value)}
          value={prizeLevel}
        >
          <option value="3rd">三等奖 (1人)</option>
          <option value="2nd">二等奖 (1人)</option>
          <option value="1st">一等奖 (1人)</option>
        </select>
        <button onClick={startDrawing} disabled={isDrawing}>
          {isDrawing ? "抽奖中..." : "开始抽奖"}
        </button>
      </div>

    </div>
  );
};

export default LotteryApp;