"use client";

import {Element3d} from "@/components/element-3d/element-3d";
import {useMouse} from "@/hooks/useMouse";
import {usePermissions} from "@/hooks/usePermissions";
import {useWebcam} from "@/hooks/useWebcam";
import {useEffect, useState} from "react";

import styles from "./page.module.scss";

export default function DemoPage() {
    const {permissionState} = usePermissions("camera" as PermissionName);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);

    // const {enableMouse, disableMouse} = useMouse();
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
    // useEffect(() => {
    //     enableMouse();
    // }, [disableMouse, enableMouse]);

    return (
        <>
            <div className={styles.settings}>

                {!isSettingsVisible && permissionState === "granted" &&
                    <button onClick={() => setIsSettingsVisible(true)}>⚙️</button>}

                {isSettingsVisible && permissionState === "granted" && <div>
                    <button onClick={() => setIsSettingsVisible(false)}>&times;️</button>

                    {/*3D*/}
                    {isDetectingVideo.current &&
                        <button onClick={() => disableDetectingVideo()}>Disable 3D</button>}
                    {!isDetectingVideo.current && webcamState.isWebcamEnabled &&
                        <button onClick={() => enableDetectingVideo()}>Enable 3D</button>}
                </div>}

            </div>

            {permissionState !== "granted" &&
                <p className={styles.webcamWarning}>Please, grant webcam permission manually on your browser. Current
                    permission: {permissionState}</p>}


            <main className={`${styles.container}`}>

                <Element3d layer={0} style={{
                    top: "45%",
                    right: "45%",
                    height: "10%",
                    width: "10%",
                    backgroundColor: "blue"
                }}></Element3d>
                <Element3d layer={100} style={{
                    top: "45%",
                    right: "45%",
                    height: "10%",
                    width: "10%",
                    backgroundColor: "lightblue"
                }}></Element3d>

                <Element3d layer={100} style={{
                    top: 0,
                    left: "-10%",
                    height: "200%",
                    width: "20%",
                    backgroundColor: "green"
                }}></Element3d>

                <Element3d layer={100} style={{
                    "top": 0,
                    "left": "40%",
                    "height": "50%",
                    "width": "20%",
                    "backgroundColor": "yellow"
                }}></Element3d>

            </main>

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
