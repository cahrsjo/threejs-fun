import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let mesh, moonMesh, moonGroup, textMesh, textGroup, scene;
const geometry = new THREE.SphereGeometry(1.5, 32, 16);
export class Globe extends Component {
  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.set(0, 2, 6);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor("#263238");
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    const loader = new THREE.TextureLoader();
    const fontLoader = new THREE.FontLoader();
    loader.load(
      './images/space.jpg',
      this.onLoadBackground,
      this.onProgress,
      this.onError
    );
    loader.load(
      './images/earth.jpg',
      this.onLoadE,
      this.onProgress,
      this.onError
    ); 
    loader.load(
      './images/moon.jpg',
      this.onLoadM,
      this.onProgress,
      this.onError
    );
    fontLoader.load(
      './font/helvetiker_regular.typeface.json',
      this.onLoadF,
      this.onProgress,
      this.onError
    );
    const light = new THREE.PointLight('#fff', 1.5);
    light.position.fromArray([-2, 2, 4])
    scene.add(light);

  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
    this.controls.dispose();
  }
  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };
  stop = () => {
    cancelAnimationFrame(this.frameId);
  };
  animate = () => {
    if (mesh) mesh.rotation.y += 0.0005;
    if (moonMesh) moonMesh.rotation.y += 0.0003;
    if (moonGroup) moonGroup.rotation.y -= 0.0015;
    if (textGroup) textGroup.rotation.x -= 0.005;
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };
  renderScene = () => {
    if (this.renderer) this.renderer.render(scene, this.camera);
  };

  onLoadBackground = texture => {
    scene.background = texture;
    this.renderScene();
    //start animation
    this.start();
  };

  onLoadE = texture => {
    if (mesh) return;
    const material = new THREE.MeshStandardMaterial({
      roughness: 1,
      metalness: 0,
      map: texture,
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    this.renderScene();
    //start animation
    this.start();
  };

  onLoadM = texture => {
    if (moonMesh) return;
    moonGroup = new THREE.Group();

    const material = new THREE.MeshStandardMaterial({
      roughness: 1,
      metalness: 0,
      map: texture,
    });
    moonMesh = new THREE.Mesh(geometry, material);
    moonMesh.position.set(3, 1, 0);
    moonMesh.scale.setScalar(0.1);
    moonGroup.add(moonMesh);
    scene.add(moonGroup);
    this.renderScene();
    //start animation
    this.start();
  };

  onLoadF = font => {
    if (textMesh) return;
    const mat = new THREE.MeshStandardMaterial({
      roughness: 1,
      metalness: 0,
      color: 'hotpink'
    });
    const fontGeometry = new THREE.TextGeometry( 'SAVE THE PLANET\n     #FEDEX2020\n       #CORONA', {
      font: font,
      size: 0.1,
      height: 0.01,
    });
    textGroup = new THREE.Group();
    textMesh = new THREE.Mesh( fontGeometry, mat );
    textMesh.position.fromArray([ -0.7, 0, 1.5])
    textGroup.add(textMesh)
    scene.add(textGroup);
    this.renderScene();
    //start animation
    this.start();
  };

  onProgress = xhr => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  };

  // Function called when download errors
  onError = error => {
    console.log("An error happened" + error);
  };

  render() {
    return (
      <div
        style={{ width: "100vw", height: "100vh", cursor: "grab" }}
        ref={mount => {
          this.mount = mount;
        }}
      />
    );
  }
}