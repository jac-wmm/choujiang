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
  const containerRef = useRef(null);
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
    let scene, camera, renderer, namesGroup, font;

    const init = () => {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({
        alpha: true, // 启用透明背景
        antialias: true, // 可选：平滑处理
      });
      renderer.setClearColor(0x000000, 0); // 设置完全透明
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);

      const radius = 2;
      const points = generateFibonacciSpherePoints(employees.length, radius);


      namesGroup = new THREE.Group();
      const fontLoader = new FontLoader();
      fontLoader.load('zhw.json', (loadedFont) => {

        font = loadedFont;
        employees.forEach((employee, index) => {
          const angle = Math.random() * 2 * Math.PI;
          const phi = Math.random() * Math.PI;
          const geometry = new TextGeometry(employee.name, {
            font: font,
            size: 0.2,
            height: 0.02,
          });

          const material = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 1 });
          const nameMesh = new THREE.Mesh(geometry, material);

          nameMesh.position.copy(points[index]);
          nameMesh.lookAt(0, 0, 0); // 朝向球体中心

          // nameMesh.position.set(
          //   Math.sin(phi) * Math.cos(angle),
          //   Math.sin(phi) * Math.sin(angle),
          //   Math.cos(phi)
          // );
          namesGroup.add(nameMesh);
        });

        scene.add(namesGroup);
      }
      );

      animate();
    };

    const animate = () => {
      requestAnimationFrame(animate);

      if (namesGroup) {
        namesGroup.rotation.y += rotationSpeed.current;
        namesGroup.rotation.x += rotationSpeed.current;
      }

      renderer.render(scene, camera);
    };

    init();

    return () => {
      renderer.dispose();
    };
  }, []);

  const generateFibonacciSpherePoints = (numPoints, radius) => {
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // 黄金角

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // y 坐标从 1 到 -1
      const radiusAtY = Math.sqrt(1 - y * y); // 当前 y 值下的半径
      const theta = phi * i; // 当前点的角度

      const x = Math.cos(theta) * radiusAtY * radius;
      const z = Math.sin(theta) * radiusAtY * radius;

      points.push(new THREE.Vector3(x, y * radius, z));
    }
    return points;
  };


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

  return (
    <div className="container">
      <video src="video.mp4" autoPlay muted loop className="video"></video>
      <audio src="bgm.mp3" className="audio"></audio>
      <div ref={containerRef} className="three"></div>
      {winners.length > 0 && (
        <div className="winner">
          {winners.join(", ")}
        </div>
      )}
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