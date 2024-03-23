"use client";
import {Box3d} from "@/components/box-3d/box-3d";
import {useMouse} from "@/hooks/useMouse";
import {usePermissions} from "@/hooks/usePermissions";
import {useWebcam} from "@/hooks/useWebcam";
import {ViewState} from "@/models/view-state.models";
import {ViewContext} from "@/providers/ViewContextProvider";
import {CSSProperties, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";

import styles from "./page.module.scss";

const Element = ({layer, style}: { layer: number; style: CSSProperties }) => {
    const {viewState: {x, y, z}} = useContext(ViewContext);

    const transform = useMemo(() => {
        const newLayer = layer ?? 0;
        const newZ = (z ?? 1) * newLayer;
        const newX = -(x ?? 0) * newZ;
        const newY = -(y ?? 0) * newZ;
        return `translate3d(${newX}%, ${newY}%, ${newZ}px)`;
    }, [layer, x, y, z]);

    return <div style={{
        position: "absolute",
        backgroundColor: "red",
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.5,
        ...style,
        transform,
    }}>X</div>;
}

export default function DemoPage() {
    const {permissionState, handlePermission} = usePermissions("camera" as PermissionName);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);

    // const {enableMouse, disableMouse} = useMouse();
    // useEffect(() => {
    //     enableMouse();
    // }, [disableMouse, enableMouse]);

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

                <Element layer={0} style={{
                    top: "45%",
                    right: "45%",
                    height: "10%",
                    width: "10%",
                    backgroundColor: "blue"
                }}></Element>
                <Element layer={100} style={{
                    top: "45%",
                    right: "45%",
                    height: "10%",
                    width: "10%",
                    backgroundColor: "lightblue"
                }}></Element>

                <Element layer={100} style={{
                    top: 0,
                    left: "-10%",
                    height: "200%",
                    width: "20%",
                    backgroundColor: "green"
                }}></Element>

                <Element layer={100} style={{
                    "top": 0,
                    "left": "40%",
                    "height": "50%",
                    "width": "20%",
                    "backgroundColor": "yellow"
                }}></Element>

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
