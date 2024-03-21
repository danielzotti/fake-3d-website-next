'use client';

import {useViewContext} from "@/providers/ViewContextProvider";

import {useMemo} from "react";
import styles from './box-3d.module.scss';

interface Box3d {
    layer?: number;
}

export const Box3d = ({layer}: Box3d) => {

    const {viewState: {x, y, z}} = useViewContext();

    const backgroundColor = useMemo(() => {
        const R = Math.floor(Math.random() * 256);
        const G = Math.floor(Math.random() * 256);
        const B = Math.floor(Math.random() * 256);
        return `rgba(${R},${G},${B},0.4)`;
    }, []);

    const transform = useMemo(() => {
        const newLayer = layer !== undefined ? layer : 0;
        // const newZ = ((z !== undefined && newLayer > 0) ? z : 1) * newLayer; // Apply only to positive layers
        const newZ = (z !== undefined ? z : 1) * newLayer;
        const newX = -50 - (x ?? 0) * newZ;
        const newY = -50 - (y ?? 0) * newZ;
        return `translate3d(${newX}%, ${newY}%, ${newZ}px)`;
    }, [layer, x, y, z]);

    return (
        <div
            className={styles.box}
            data-layer={layer}
            style={{
                backgroundColor: backgroundColor,
                transform: transform,
            }}
        >
            Layer {layer}
        </div>
    )
}
