"use client";

import {Element3d} from "@/components/element-3d/element-3d";
import {useMouse} from "@/hooks/useMouse";
import {usePermissions} from "@/hooks/usePermissions";
import {useWebcam} from "@/hooks/useWebcam";
import Image from "next/image";
import {useEffect, useState} from "react";

import styles from "./page.module.scss";

export default function DemoPage() {
    const {permissionState} = usePermissions("camera" as PermissionName);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);

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

                <Element3d layer={0}>
                    <Image src={'images/magritte/background.png'} width={3000} height={3000} alt={"Background"}/>
                </Element3d>
                <Element3d layer={2} top={"750px"}>
                    <Image src={'images/magritte/daniel.png'} width={428} height={1801} alt={"Daniel"}/>
                </Element3d>
                <Element3d layer={30} top={"-32px"} left={"7px"}>
                    <Image src={'images/magritte/apple.png'} width={122} height={138} alt={"Apple"}/>
                </Element3d>
                <Element3d layer={200} top={"-300px"} left={"500px"}>
                    <Image src={'images/magritte/dove.png'} width={717} height={377} alt={"Dove"}/>
                </Element3d>
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
