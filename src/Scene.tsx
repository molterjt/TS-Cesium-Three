//@ts-ignore
declare module "*.jpg";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import e1 from "../public/assets/textures/earth_atmos_2048.jpg";
import e2 from "../public/assets/textures/earth_normal_2048.jpg";
import e3 from "../public/assets/textures/earth_specular_2048.jpg";

// let textures = [e1, e2];
// import e1 from "./textures/earth_atmos_2048.jpg";
const radius = 6371;
const tilt = 0.41;
const rotationSpeed = 0.02;
const cloudsScale = 1.005;
const moonScale = 0.23;

const textureLoader = new THREE.TextureLoader();
const dMoonVec = new THREE.Vector3();

// let material = new THREE.MeshBasicMaterial({
//   map: new THREE.TextureLoader().load("./textures/earth_specular_2048.jpg"),
// });
// let meshPlanet = new THREE.Mesh(geom, material);
const ViewerScene = () => {
  const viewerRef = useRef<HTMLDivElement>();
  // Set some camera attributes.
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
  const VIEW_ANGLE = 80;
  // const VIEW_ANGLE = 45;
  const ASPECT = WIDTH / HEIGHT;
  const NEAR = 0.1;
  const FAR = 10000;
  useEffect(() => {
    if (viewerRef && viewerRef.current) {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xcccccc);
      scene.fog = new THREE.FogExp2(0xcccccc, 0.001);
      const clock = new THREE.Clock();
      const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
      camera.position.z = 1;
      const renderer = new THREE.WebGLRenderer();
      // const stats = new THREE.Stats();
      renderer.setSize(window.innerWidth, window.innerHeight);
      viewerRef.current.appendChild(renderer.domElement);
      // document.body.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);

      /**
       * RENDER Planet #1
       */
      let geom = new THREE.SphereGeometry(0.15, 100, 30);
      const orbMaterial = new THREE.MeshPhongMaterial({
        color: 0xff00ff,
        flatShading: false,
      });
      const planetMap = new THREE.MeshPhongMaterial({
        specular: 0xcccccc,
        shininess: 9,
        map: textureLoader.load(e1),
        specularMap: textureLoader.load(e3),
        // normalMap: textureLoader.load(e2),
        // y scale is negated to compensate for normal map handedness.
        // normalScale: new THREE.Vector2(0.85, -0.85),
      });
      // let meshPlanet = new THREE.Mesh(geom, planetMap);
      let meshPlanet = new THREE.Mesh(geom, orbMaterial);
      meshPlanet.position.x = 0.95;
      meshPlanet.position.y = 0.65;
      scene.add(meshPlanet);

      /**
       * RENDER EARTH #2
       */
      const geometry = new THREE.SphereGeometry(0.5, 32, 32);
      const geoMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        flatShading: false,
      });
      const materialNormalMap = new THREE.MeshPhongMaterial({
        specular: 0x7c7c7c,
        shininess: 15,
        map: textureLoader.load(e1),
        specularMap: textureLoader.load(e3),
        normalMap: textureLoader.load(e2),
        // y scale is negated to compensate for normal map handedness.
        normalScale: new THREE.Vector2(0.85, -0.85),
      });
      materialNormalMap.map.colorSpace = THREE.SRGBColorSpace;
      const sphereMesh = new THREE.Mesh(geometry, materialNormalMap);
      // scene.add(sphereMesh);

      /**
       * Render Satellite Object
       */
      const geometry_satellite = new THREE.BoxGeometry(0.4, 0.4, 0.4);
      const material_satellite = new THREE.MeshNormalMaterial({
        flatShading: true,
      });
      let satellite = new THREE.Mesh(geometry_satellite, material_satellite);
      // scene.add(satellite);
      /******/

      /**
       * RENDER EARTH #3 (ink tone, with spin)
       */
      const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const earthMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load(e3),
        bumpMap: new THREE.TextureLoader().load(e2),
        bumpScale: 5,
      });
      const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
      earthMesh.rotation.z = 0.1;
      earthMesh.rotation.x = 0.35;
      scene.add(earthMesh);
      /******/

      /**GRID HELPER */
      const helper = new THREE.GridHelper(100, 40, 0x303030, 0x303030);
      helper.position.y = -7.5;
      scene.add(helper);
      /*** */

      let r = calcPosFromLatLonRad(0.5, 84.51, -34.71427);
      console.log("r", r);
      let test = new THREE.SphereGeometry(0.05, 10, 10);
      const testM = new THREE.MeshPhongMaterial({
        color: "purple",
        flatShading: false,
      });
      let testMesh = new THREE.Mesh(test, testM);
      testMesh.position.set(r.x, r.y, r.z);
      scene.add(testMesh);
      //** FLOOR */
      const planeSize = 10;
      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
      const planeMat = new THREE.MeshPhongMaterial({
        color: 0xeeeeee,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(planeGeo, planeMat);
      mesh.rotation.x = Math.PI / 2;
      mesh.position.y = -1;
      // scene.add(mesh);

      //** LIGHTING */
      const dirLight1 = new THREE.DirectionalLight(0xffffff);
      dirLight1.position.set(1, 1, 1);
      scene.add(dirLight1);
      // const dirLight2 = new THREE.DirectionalLight(0x002288);
      // dirLight2.position.set(-1, -1, -1);
      // scene.add(dirLight2);
      const ambientLight = new THREE.AmbientLight(0xffffff);
      // const ambientLight = new THREE.AmbientLight(0x222222);
      scene.add(ambientLight);
      const pointLight = new THREE.PointLight(0xffffff, 5, 4);
      pointLight.position.set(1, 0.3, 1);
      scene.add(pointLight);

      const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onWindowResize);

      const animate = () => {
        //time tracking
        var delta = clock.getDelta();
        var elapsed = clock.elapsedTime;

        //sphere position
        // sphereMesh.position.x = Math.sin(elapsed / 2) * 1;
        // sphereMesh.position.z = Math.cos(elapsed / 2) * 1;

        //satellite
        satellite.position.x =
          sphereMesh.position.x + Math.sin(elapsed * 2) * 3;
        satellite.position.z =
          sphereMesh.position.z + Math.cos(elapsed * 2) * 3;
        satellite.rotation.x += 0.4 * delta;
        satellite.rotation.y += 0.2 * delta;

        // earthMesh.rotation.y += 0.3 * delta;
        camera.updateProjectionMatrix();

        requestAnimationFrame(animate);

        renderer.render(scene, camera);
      };
      animate();
    }
  }, [viewerRef]);
  function calcPosFromLatLonRad(radius, lat, lon) {
    var spherical = new THREE.Spherical(
      radius,
      degToRad(90 - lon),
      degToRad(lat)
    );

    var vector = new THREE.Vector3();
    vector.setFromSpherical(spherical);

    console.log(vector.x, vector.y, vector.z);
    return vector;
  }
  function degToRad(d: number) {
    return d * (Math.PI / 180);
  }
  return <div ref={viewerRef}></div>;
};

export default ViewerScene;
