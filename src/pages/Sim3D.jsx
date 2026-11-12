/* export default function Sim3D() {
    return <h1>3D Simulation Arena (Three.js + Rapier)</h1>
} */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

export default function Sim3D() {
    const containerRef = useRef(null);
    const [physicsReady, setPhysicsReady] = useState(false);

    useEffect(() => {
        let animationFrameId;
        let renderer, scene, camera, world;

        async function initSim() {
            await RAPIER.init();
            const gravity = { x: 0.0, y: -9.89, z: 0.0 };
            world = new RAPIER.World(gravity);
            setPhysicsReady(true);

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x1a1a1a);
            camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
            camera.position.set(0, 5, 10);
            camera.lookAt(0, 0, 0);

            renderer = new THREE.WebGLRenderer({ antialias: true});
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
            containerRef.current.appendChild(renderer.domElement);

            const ambientLight = new THREE.DirectionalLight(0xffffff, 0.7);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.load ? directionalLight.position.set(5, 10, 5) : directionalLight.position.set(5, 10, 5);
            scene.add(directionalLight);

            const groundGeometry = new THREE.PlaneGeometry(20, 20);
            const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
            const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
            groundMesh.rotation.x = -Math.PI / 2;
            scene.add(groundMesh);

            const groundBodyDesc = RAPIER.RigidBodyDesc.fixed();
            const groundBody = world.createRigidBody(groundBodyDesc);
            const groundColliderDesc = RAPIER.ColliderDesc.cuboid(10, 0.1, 10);
            world.createCollider(groundColliderDesc, groundBody);

            const boxSize = 1;
            const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
            const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff88 });
            const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
            scene.add(boxMesh);

            const boxBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 5, 0);
            const boxBody = world.createRigidBody(boxBodyDesc);
            const boxColliderDesc = RAPIER.ColliderDesc.cuboid(boxSize / 2, boxSize / 2, boxSize / 2);
            world.createCollider(boxColliderDesc, boxBody);

            function animate() {
                animationFrameId = requestAnimationFrame(animate);
                world.step();
                const position = boxBody.translation();
                const rotation = boxBody.rotation();
                boxMesh.position.set(position.x, position.y, position.z);
                boxMesh.setRotationFromQuaternion(new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w));
                renderer.render(scene, camera);
            }
            animate();

            function handleResize() {
                if (!containerRef.current) return;
                camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
                camera.updateProjectMatrix();
                renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
            }
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }

        initSim();

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (renderer && renderer.domElement) {
                renderer.domElement.remove();
            }
        };
    }, [])

    return (
        <div style={{ width: '100%', height: '100vh', height: 'calc(100vh - 60px)', position: 'relative;'}}>
            {!physicsReady && (<div style={{ position: 'absolute', top: '20px', left: '20px', color: '#fff', zIndex: 10}}>
                Initializing Physics Engine...
            </div>)}

            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
}