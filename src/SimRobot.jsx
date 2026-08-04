import React, { useEffect, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

export default function SimRobot ({ weight = 15, cadUrl = null}) {
    // ROBOT WEIGHT //
    const [ref, api] = useBox(() => ({
        mass: Number(weight) || 15, position: [0, 1, 0], args: [2, 1.2, 2],
    }));

    const keys = useRef({ w: false, s: false, a: false, d: false });
    const heading = useRef(0);
    const velocity = useRef([0, 0, 0, ]);

    // DRIVING CONTROLS //
    useEffect(() => {
        const handleKeyDown = (e) => {
            const k = e.key.toLowerCase();
            if (k in keys.current) keys.current[k] = true;
        };
        const handleKeyUp = (e) => {
            const k = e.key.toLowerCase();
            if (k in keys.current) keys.current[k] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame(() => {
        let speed = 0;
        let turnSpeed = 0;

        if (keys.current.w) speed = -7;
        if (keys.current.s) speed = 7;
        if (keys.current.a) turnSpeed = 3;
        if (keys.current.d) turnSpeed = -3;

        api.angularVelocity.set(0, turnSpeed, 0);

        if (ref.current) {
            heading.current = ref.current.rotation.y;
        }

        const vx = speed * Math.sin(heading.current);
        const vy = speed * Math.cos(heading.current);

        api.velocity.set(vx, velocity.current[1], vz);
    });

    return (
        <mesh ref={ref}>
            {cadUrl ? (
                <CadModel url={cadUrl} />
            ) : (
                <>
                {/* DEFAULT BOX ROBOT */}
                <boxGeometry args={[2, 1.2, 2]} />
                <meshStandardMaterial color="#ff5500" />
                <mesh position={[0, 0.7, -0.9]}>
                    <boxGeometry args={[0.4, 0.2, 0.4]} />
                    <meshStandardMaterial color="#ffffff" />
                </mesh>
            </>
            )}
        </mesh>
    );
}

// SUB-COMPONENT TO LOAD .STL FILES //
function CadModel({ url }) {
    const geometry = useLoader(STLLoader, url);
    return (
        <mesh geometry={geometry} scale={0.05} rotation={[-Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#9b51e0" metalness={0.5} roughness={0.3} />
        </mesh>
    );
}