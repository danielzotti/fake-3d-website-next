"use client";

import {Box3d} from "@/components/box-3d/box-3d";
import {ViewState} from "@/models/view-state.models";
import {ViewContext} from "@/providers/ViewContextProvider";
import {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";

import {type MediaPipeFaceDetectorMediaPipeModelConfig} from "@tensorflow-models/face-detection/dist/mediapipe/types";
import {
    type FaceDetector,
    SupportedModels,
    createDetector,
} from "@tensorflow-models/face-detection";
import styles from "./page.module.scss";

interface State {
    // webcam
    hasWebcamSupport?: boolean;
    isWebcamEnabled: boolean;
    isWebcamVisible: boolean;
    isVideoLoaded: boolean;
    isModelLoading: boolean;
    isVideoPictureInPicture: boolean;
    eyesPosition: { x: number, y: number };
    webcamWidth: number;
    webcamHeight: number;
    // mouse
    isMouseEnabled: boolean;
    mousePosition: { x: number, y: number };
    screenWidth: number;
    screenHeight: number;
}

export const PageContent = () => {

    const {viewState, setViewState} = useContext(ViewContext);

    const video = useRef<HTMLVideoElement>(null);
    const webcamStream = useRef<MediaStream>();
    const detector = useRef<FaceDetector>()
    const isDetectingVideo = useRef<boolean>(false);

    const [state, setState] = useState<State>({
        // webcam
        hasWebcamSupport: undefined,
        isWebcamEnabled: false,
        isWebcamVisible: true,
        isVideoLoaded: false,
        isModelLoading: false,
        isVideoPictureInPicture: false,
        webcamHeight: 480,
        webcamWidth: 640,
        eyesPosition: {x: 0, y: 0},
        // mouse
        isMouseEnabled: false,
        screenWidth: 1,
        screenHeight: 1,
        mousePosition: {x: 0, y: 0},
    });

    const detectMousePosition = useCallback((e: MouseEvent) => {
        setState((s) => ({
            ...s,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            mousePosition: {
                x: e.clientX,
                y: e.clientY
            },
        }));
        setViewState(s => ({
            ...s,
            x: ((e.clientX / window.innerWidth) * 2) - 1,
            y: ((e.clientY / window.innerHeight) * 2) - 1,
            z: s.z === undefined ? 1 : s.z > 0 ? s.z : 0
        }))
    }, [setViewState])

    const detectMouseWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        const deltaZ = e.deltaY / window.innerHeight;

        setViewState((s: ViewState) => ({
            ...s,
            z: s.z !== undefined && s.z - deltaZ > 0 ? s.z - deltaZ : 0
        }));
    }, [setViewState])

    const enableMouse = () => {
        setState((s) => ({
            ...s,
            isMouseEnabled: true,
        }));
        window.addEventListener('mousemove', detectMousePosition)
        window.addEventListener('wheel', detectMouseWheel, {passive: false}) // See https://www.uriports.com/blog/easy-fix-for-unable-to-preventdefault-inside-passive-event-listener/
    }
    const disableMouse = () => {
        setState((s) => ({
            ...s,
            isMouseEnabled: false,
            mousePosition: {x: 0, y: 0},
        }));
        setViewState({
            x: 0,
            y: 0
        });
        window.removeEventListener('mousemove', detectMousePosition)
        window.removeEventListener('wheel', detectMouseWheel)
    }

    const enableWebcam = () => {
        setState((s) => ({
            ...s,
            isWebcamEnabled: true,
        }));

        // Activate the webcam stream.
        window.navigator.mediaDevices
            .getUserMedia({
                video: {
                    facingMode: "user",
                    frameRate: {ideal: 25, max: 25},
                },
                audio: false,
            })
            .then(function (stream) {
                webcamStream.current = stream;
                if (video.current) {
                    video.current.srcObject = stream;
                }
                const {width: webcamWidth, height: webcamHeight} = stream.getTracks()[0].getSettings();
                setState((s) => ({
                    ...s,
                    webcamWidth: webcamWidth ?? 640,
                    webcamHeight: webcamHeight ?? 480,
                    isWebcamVisible: true,
                }));
            })
            .catch(function (err) {
                console.debug(err)
                setState((s) => ({
                    ...s,
                    isWebcamEnabled: false,
                    hasWebcamSupport: false,
                }));
            });
    }
    const disableWebcam = () => {
        webcamStream.current?.getTracks().forEach((t) => t.stop());
        setState((s) => ({
            ...s,
            isWebcamEnabled: false,
            isWebcamVisible: false,
            eyesPosition: {x: 0, y: 0},
        }));
        setViewState({
            x: 0,
            y: 0
        });
        disableDetectingVideo();
    }

    const detectVideo = async () => {
        if (!video.current) {
            console.debug("no video");
            return;
        }

        if (!detector.current) {
            console.debug("no detector");
            return;
        }

        const estimationConfig = {flipHorizontal: true};
        const faces = await detector.current.estimateFaces(video.current, estimationConfig);

        if (faces?.at(0)?.keypoints) {
            let position: ViewState = {x: 0, y: 0};

            const eyesPosition = faces
                ?.at(0)
                ?.keypoints.filter(({name}) => ["rightEye", "leftEye"].includes(name ?? "")) || [];

            if (eyesPosition.length === 2) {
                // center
                position = {
                    x: (eyesPosition[1].x + eyesPosition[0].x) / 2,
                    y: (eyesPosition[1].y + eyesPosition[0].y) / 2,
                    z: Math.abs(eyesPosition[1].x - eyesPosition[0].x) / state.webcamWidth, // NB: This should definitely be improved (it works only for horizontal eyes)
                }
            }
            if (eyesPosition.length === 1) {
                // right or left eye
                position = {
                    x: eyesPosition[0].x,
                    y: eyesPosition[0].y,
                }
            }

            setState((s) => ({
                ...s,
                eyesPosition: {
                    x: position.x,
                    y: position.y,
                },
            }));
            setViewState({
                x: ((position.x / state.webcamWidth) * 2) - 1,
                y: ((position.y / state.webcamHeight) * 2) - 1,
                ...position.z && {z: position.z * 10} // 10 is a magic number to make the effect more visible
            })
            // TODO - improvement: point between 2 eyes and not just right eye
            // TODO - improvement: calculate Z based on distance to the webcam -> E.G. (rightX - leftX) / webcam width
        }

        if (isDetectingVideo.current) {
            // requestAnimationFrame(() => {
            //     detectVideo();
            // });
            setTimeout(() => {
                detectVideo();
            }, 100);
        } else {
            setState((s) => ({
                ...s,
                eyesPosition: {x: 0, y: 0},
            }));
            setViewState({
                x: 0,
                y: 0
            });
        }
    }

    const disableDetectingVideo = () => {
        isDetectingVideo.current = false;
    }
    const enableDetectingVideo = async () => {
        void startVideoDetection();
    }

    const startVideoDetection = async () => {
        setState((s) => ({
            ...s,
            isModelLoading: true,
        }));

        const model = SupportedModels.MediaPipeFaceDetector;
        const detectorConfig: MediaPipeFaceDetectorMediaPipeModelConfig = {
            runtime: "mediapipe",
            solutionPath: "models/face_detection", // NB: is public/models/face_detection
        };

        createDetector(model, detectorConfig)
            .then((d) => {
                setState((s) => ({
                    ...s,
                    isModelLoading: false,
                }));
                isDetectingVideo.current = true;
                detector.current = d;
                detectVideo();
            })
            .catch((e) => {
                console.error("Problem on loading the model", e);
            });
    }

    const handleVideoLoaded = () => {
        setState((s) => ({
            ...s,
            isVideoLoaded: true,
        }));
        // enableDetectingVideo(); // Uncomment to enable detecting video once enable webcam is clicked
    };

    const currentState = useMemo(() => ({
        mouse: {
            x: state.mousePosition.x.toFixed(2),
            y: state.mousePosition.y.toFixed(2),
        },
        eyes: {
            x: state.eyesPosition.x.toFixed(2),
            y: state.eyesPosition.y.toFixed(2),
        },
        view: {
            x: viewState.x.toFixed(2),
            y: viewState.y.toFixed(2),
            z: viewState.z?.toFixed(2),
        },
        webcam: {
            height: state.webcamHeight,
            width: state.webcamWidth
        },
        screen: {
            height: state.screenHeight,
            width: state.screenWidth
        }
    }), [state.eyesPosition.x, state.eyesPosition.y, state.mousePosition.x, state.mousePosition.y, state.screenHeight, state.screenWidth, state.webcamHeight, state.webcamWidth, viewState.x, viewState.y, viewState.z]);

    useEffect(() => {
        setState((s) => ({
            ...s,
            hasWebcamSupport: !!navigator.mediaDevices.getUserMedia,
        }));

        return () => {
            window.removeEventListener('mousemove', detectMousePosition);
            window.removeEventListener('wheel', detectMouseWheel);
        };
    }, [detectMousePosition, detectMouseWheel]);

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
                {!state.isMouseEnabled && !state.isWebcamEnabled &&
                    <button onClick={enableMouse} className={styles.button}>
                        Enable Mouse
                    </button>}
                {state.isMouseEnabled && <button onClick={disableMouse} className={styles.button}>
                    Disable Mouse
                </button>}
                {!state.isMouseEnabled && state.hasWebcamSupport && <>
                    {!state.isWebcamEnabled && <button onClick={enableWebcam} className={styles.button}>
                        Enable Webcam
                    </button>}
                    {state.isWebcamEnabled &&
                        <button onClick={disableWebcam} className={styles.button}>
                            Disable Webcam
                            {!state.isVideoLoaded && <small>&nbsp;(Loading video...)</small>}
                        </button>}
                </>}

                {state.hasWebcamSupport === false &&
                    <p>No webcam support, you cannot see this website in 3D mode!</p>}

                {state.isWebcamEnabled && <>
                    {!isDetectingVideo.current && state.isVideoLoaded &&
                        <button
                            onClick={enableDetectingVideo}
                            className={styles.button}
                            disabled={state.isModelLoading}
                        >
                                <span>
                                    Enable 3D
                                </span>
                            {state.isModelLoading && <small>&nbsp;(loading...)</small>}
                        </button>
                    }
                    {isDetectingVideo.current &&
                        <button
                            onClick={disableDetectingVideo}
                            className={styles.button}
                        >
                            Disable 3D
                        </button>}
                </>}
                <pre>State: {JSON.stringify(currentState, null, 2)}</pre>
                {/*<pre>State: {JSON.stringify(state, null, 2)}</pre>*/}
            </div>

            {state.hasWebcamSupport && state.isWebcamEnabled && <>
                <video
                    className={`${styles.video} ${!state.isWebcamVisible ? 'hide' : ''}`}
                    onClick={() => setState((s) => ({...s, isWebcamVisible: !s.isWebcamVisible}))}
                    autoPlay
                    muted
                    ref={video}
                    onLoadedData={handleVideoLoaded}
                    style={{display: state.isVideoLoaded ? 'block' : 'none'}}
                ></video>

                {!state.isWebcamVisible &&
                    <button onClick={() => setState((s) => ({...s, isWebcamVisible: true}))}
                            className={styles.videoMini}>📷</button>}
            </>}

        </>
    );
}
