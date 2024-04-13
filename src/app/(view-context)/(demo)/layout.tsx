"use client";

import {useMouse} from "@/hooks/useMouse";
import {usePermissions} from "@/hooks/usePermissions";
import {useWebcam} from "@/hooks/useWebcam";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {ReactNode, useEffect, useState} from "react";

import styles from "./layout.module.scss";

const defaultScale = 10;
const scaleValues = [
    0.1,
    0.15,
    0.2,
    0.25,
    0.3,
    0.4,
    0.5,
    0.6,
    0.7,
    0.85,
    1,
    1.2,
    1.4,
    1.6,
    1.8,
    2,
    2.5
]

export default function DemoLayout({children}: Readonly<{
    children: ReactNode;
}>) {

    const router = useRouter();

    const {permissionState} = usePermissions("camera" as PermissionName);
    const [isSettingsVisible, setIsSettingsVisible] = useState(true);
    const [scaleIndex, setScaleIndex] = useState(defaultScale);

    const {
        videoRef,
        state: webcamState,
        hideWebcam,
        handleVideoLoaded,
        isDetectingVideo,
        enableWebcam,
        disableWebcam,
        enableDetectingVideo,
        disableDetectingVideo,
        setHasWebcamSupport
    } = useWebcam();

    const zoomIn = () => {
        if (scaleIndex < scaleValues.length - 1) {
            setScaleIndex(scaleIndex + 1);
        }
    }
    const zoomOut = () => {
        if (scaleIndex > 0) {
            setScaleIndex(scaleIndex - 1);
        }
    }
    const resetZoom = () => {
        setScaleIndex(defaultScale);
    }

    useEffect(() => {
        enableWebcam();

        return () => {
            disableWebcam();
            disableDetectingVideo();
        }
    }, [disableDetectingVideo, disableWebcam, enableWebcam]);

    useEffect(() => {
        if (permissionState === "granted") {
            setHasWebcamSupport(true);
            enableWebcam();
        }
    }, [disableWebcam, enableWebcam, permissionState, setHasWebcamSupport]);

    // Uncomment to enable mouse. Remember to comment all the code related to the webcam
    // const {enableMouse, disableMouse} = useMouse();
    // useEffect(() => {
    //     enableMouse();
    //     return () => {
    //         disableMouse();
    //     }
    // }, [disableMouse, enableMouse]);

    return (
        <>

            <div className={styles.settings}>
                <button onClick={() => router.push('/')} className={styles.homeButton}>🏠</button>

                {!isSettingsVisible && permissionState === "granted" &&
                    <button onClick={() => setIsSettingsVisible(true)}>⚙️</button>}

                {isSettingsVisible && permissionState === "granted" && <div>
                    <button onClick={() => setIsSettingsVisible(false)}>&times;️</button>

                    {/*3D*/}
                    {isDetectingVideo.current &&
                        <button className="btn-inverse" onClick={() => disableDetectingVideo()}>Disable 3D</button>}
                    {!isDetectingVideo.current && webcamState.isWebcamEnabled &&
                        <button className="btn-inverse" onClick={() => enableDetectingVideo()}>Enable 3D</button>}

                    {/*ZOOM*/}
                    <button onClick={zoomOut}>-</button>
                    <button onClick={resetZoom}><small>reset</small></button>
                    <button onClick={zoomIn}>+</button>
                </div>}

            </div>

            {permissionState !== "granted" &&
                <p className={styles.webcamWarning}>Please, grant webcam permission manually on your browser. Current
                    permission: {permissionState}</p>}

            {webcamState.isOutOfFrame &&
                <div className={styles.outOfFrameContainer}>
                    <p className={styles.outOfFrameWarning}>You are out of the webcam view!</p>
                </div>
            }

            <div className={styles.container}>
                <main className={`${styles.main}`} style={{transform: `scale(${scaleValues[scaleIndex]})`}}>
                    {children}
                </main>
            </div>

            {webcamState.hasWebcamSupport && webcamState.isWebcamEnabled &&
                <video
                    className={styles.video}
                    onClick={() => hideWebcam()}
                    autoPlay
                    muted
                    ref={videoRef}
                    onLoadedData={handleVideoLoaded}
                ></video>
            }
        </>
    );
}
