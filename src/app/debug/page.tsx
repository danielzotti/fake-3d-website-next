"use client";
import {useMouse} from "@/hooks/useMouse";
import {Box3d} from "@/components/box-3d/box-3d";
import {useWebcam} from "@/hooks/useWebcam";

import {ViewContext} from "@/providers/ViewContextProvider";
import {useContext, useMemo, useState} from "react";

import styles from "./page.module.scss";

interface State {
    // mouse
    isMouseEnabled: boolean;
    mousePosition: { x: number, y: number };
    screenWidth: number;
    screenHeight: number;
    // debug
    isDebugEnabled: boolean;
    // UI
    isSettingsVisible: boolean;
}

export default function HomePage() {
    const {viewState} = useContext(ViewContext);

    const {enableMouse, disableMouse} = useMouse();

    const {
        state: webcamState, videoRef, isDetectingVideo,
        disableDetectingVideo,
        enableDetectingVideo, handleVideoLoaded, enableWebcam, disableWebcam,
        showWebcam,
        hideWebcam
    } = useWebcam();

    const [state, setState] = useState<State>({
        // mouse
        isMouseEnabled: false,
        screenWidth: 1,
        screenHeight: 1,
        mousePosition: {x: 0, y: 0},
        // debug
        isDebugEnabled: false,
        // UI
        isSettingsVisible: true
    });

    const enableSettings = () => {
        setState((s) => ({
            ...s,
            isSettingsVisible: true,
        }));
    };

    const disableSettings = () => {
        setState((s) => ({
            ...s,
            isSettingsVisible: false,
        }));
    }

    const enableDebug = () => {
        setState((s) => ({
            ...s,
            isDebugEnabled: true,
        }));
    };

    const disableDebug = () => {
        setState((s) => ({
            ...s,
            isDebugEnabled: false,
        }));
    }

    const activateMouse = () => {
        setState((s) => ({
            ...s,
            isMouseEnabled: true,
        }));
        enableMouse();
    }
    const deactivateMouse = () => {
        setState((s) => ({
            ...s,
            isMouseEnabled: false,
            mousePosition: {x: 0, y: 0},
        }));
        disableMouse();
    }

    const currentState = useMemo(() => ({
        mouse: {
            x: state.mousePosition.x.toFixed(2),
            y: state.mousePosition.y.toFixed(2),
        },
        eyes: {
            x: webcamState.eyesPosition.x.toFixed(2),
            y: webcamState.eyesPosition.y.toFixed(2),
        },
        view: {
            x: viewState.x.toFixed(2),
            y: viewState.y.toFixed(2),
            z: viewState.z?.toFixed(2),
        },
        webcam: {
            height: webcamState.webcamHeight,
            width: webcamState.webcamWidth
        },
        screen: {
            height: state.screenHeight,
            width: state.screenWidth
        }
    }), [state.mousePosition.x, state.mousePosition.y, state.screenHeight, state.screenWidth, viewState.x, viewState.y, viewState.z, webcamState.eyesPosition.x, webcamState.eyesPosition.y, webcamState.webcamHeight, webcamState.webcamWidth]);

    return (
        <>
            <main className={`${styles.container} ${state.isMouseEnabled ? 'eyes' : ''}`}>
                <div className={styles.contentContainer}>
                    <div className={styles.content}>
                        <Box3d layer={-100}></Box3d>
                        <Box3d layer={-50}></Box3d>
                        <Box3d layer={0}></Box3d>
                        <Box3d layer={20}></Box3d>
                        <Box3d layer={50}></Box3d>
                    </div>
                </div>
                <div className={styles.contentContainer}>
                    <div className={styles.content}>
                        <Box3d layer={0}></Box3d>
                        <Box3d layer={10}></Box3d>
                        <Box3d layer={20}></Box3d>
                        <Box3d layer={50}></Box3d>
                        <Box3d layer={100}></Box3d>
                    </div>
                </div>
                <div className={styles.contentContainer}>
                    <div className={styles.content}>
                        <Box3d layer={-100}></Box3d>
                        <Box3d layer={-50}></Box3d>
                        <Box3d layer={-20}></Box3d>
                        <Box3d layer={-10}></Box3d>
                        <Box3d layer={0}></Box3d>
                    </div>
                </div>

            </main>


            <div className={styles.webcamControls}>
                {!state.isSettingsVisible && <button onClick={enableSettings} style={{fontSize: "30px"}}>⚙️</button>}
                {state.isSettingsVisible &&
                    <button onClick={disableSettings} style={{fontSize: "30px"}}>&times;</button>}

                {state.isSettingsVisible && <>
                    {/*DEBUG*/}
                    {!state.isDebugEnabled &&
                        <button onClick={enableDebug} className="btn-inverse">
                            Enable Debug
                        </button>}
                    {state.isDebugEnabled && <button onClick={disableDebug} className="btn-inverse">
                        Disable Debug
                    </button>}

                    {/*MOUSE*/}
                    {!state.isMouseEnabled && !webcamState.isWebcamEnabled &&
                        <button onClick={activateMouse}>
                            Enable Mouse
                        </button>}
                    {state.isMouseEnabled && <>
                        <button onClick={deactivateMouse}>
                            Disable Mouse
                        </button>
                        <span className={styles.mouseDisclaimer}>Use mouse wheel to zoom in/out</span>
                    </>
                    }

                    {/*WEBCAM*/}
                    {!state.isMouseEnabled && webcamState.hasWebcamSupport && <>
                        {!webcamState.isWebcamEnabled && <button onClick={enableWebcam}>
                            Enable Webcam
                        </button>}
                        {webcamState.isWebcamEnabled &&
                            <button onClick={disableWebcam}>
                                Disable Webcam
                                {!webcamState.isVideoLoaded && <small>&nbsp;(Loading video...)</small>}
                            </button>}
                    </>}

                    {webcamState.hasWebcamSupport === false &&
                        <p>No webcam support, I&apos;m sorry</p>}

                    {webcamState.isWebcamEnabled && <>
                        {!isDetectingVideo.current && webcamState.isVideoLoaded &&
                            <button
                                onClick={enableDetectingVideo}
                                disabled={webcamState.isModelLoading}
                            >
                                <span>
                                    Enable 3D
                                </span>
                                {webcamState.isModelLoading && <small>&nbsp;(loading...)</small>}
                            </button>
                        }
                        {isDetectingVideo.current &&
                            <button
                                onClick={disableDetectingVideo}
                            >
                                Disable 3D
                            </button>}
                    </>}

                    {state.isDebugEnabled &&
                        <pre>State: {JSON.stringify(currentState, null, 2)}</pre>}
                    {/*<pre>State: {JSON.stringify(state, null, 2)}</pre>*/}
                </>}


            </div>

            {webcamState.hasWebcamSupport && webcamState.isWebcamEnabled && <>
                <video
                    className={`${styles.video} ${!webcamState.isWebcamVisible ? 'hide' : ''}`}
                    onClick={() => hideWebcam()}
                    autoPlay
                    muted
                    ref={videoRef}
                    onLoadedData={handleVideoLoaded}
                    style={{display: webcamState.isVideoLoaded ? 'block' : 'none'}}
                ></video>

                {!webcamState.isWebcamVisible &&
                    <button onClick={() => showWebcam()}
                            className={styles.videoMini}>📷</button>}
            </>}
        </>
    );
}
