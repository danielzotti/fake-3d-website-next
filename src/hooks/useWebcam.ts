import {ViewState} from "@/models/view-state.models";
import {ViewContext} from "@/providers/ViewContextProvider";
import {createDetector, type FaceDetector, SupportedModels} from "@tensorflow-models/face-detection";
import type {MediaPipeFaceDetectorMediaPipeModelConfig} from "@tensorflow-models/face-detection/dist/mediapipe/types";
import {useCallback, useContext, useEffect, useRef, useState} from "react";

interface WebcamState {
    hasWebcamSupport?: boolean;
    isWebcamEnabled: boolean;
    isWebcamVisible: boolean;
    isVideoLoaded: boolean;
    isModelLoading: boolean;
    isVideoPictureInPicture: boolean;
    eyesPosition: { x: number, y: number };
    webcamWidth: number;
    webcamHeight: number;
}

export const useWebcam = () => {

    const {viewState, setViewState} = useContext(ViewContext);

    const videoRef = useRef<HTMLVideoElement>(null);
    const webcamStream = useRef<MediaStream>();
    const detector = useRef<FaceDetector>()
    const isDetectingVideo = useRef<boolean>(false);

    const [state, setState] = useState<WebcamState>({
        hasWebcamSupport: undefined,
        isWebcamEnabled: false,
        isWebcamVisible: true,
        isVideoLoaded: false,
        isModelLoading: false,
        isVideoPictureInPicture: false,
        webcamHeight: 480,
        webcamWidth: 640,
        eyesPosition: {x: 0, y: 0},
    });

    const showWebcam = useCallback(() => {
        setState((s) => ({
            ...s,
            isWebcamVisible: true,
        }));
    }, [])

    const hideWebcam = useCallback(() => {
        setState((s) => ({
            ...s,
            isWebcamVisible: false,
        }));
    }, [])

    const setHasWebcamSupport = useCallback((hasWebcamSupport: boolean) => {
        setState((s) => ({
            ...s,
            hasWebcamSupport,
        }));
    }, [])

    const enableWebcam = useCallback(() => {
        setState((s) => ({
            ...s,
            isWebcamEnabled: true,
        }));

        // Activate the webcam stream.
        window.navigator.mediaDevices
            .getUserMedia({
                video: {
                    facingMode: "user", // front camera
                    frameRate: {ideal: 25, max: 25}, // more than 25 fps not needed
                },
                audio: false,
            })
            .then(function (stream) {
                webcamStream.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
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
                console.error(err)
                setState((s) => ({
                    ...s,
                    isWebcamEnabled: false,
                    hasWebcamSupport: false,
                }));
            });
    }, [])

    const disableDetectingVideo = useCallback(() => {
        isDetectingVideo.current = false;
    }, [])

    const disableWebcam = useCallback(() => {
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
    }, [disableDetectingVideo, setViewState])

    const detectVideo = useCallback(async () => {
        if (!videoRef.current) {
            console.debug("no video");
            return;
        }

        if (!detector.current) {
            console.debug("no detector");
            return;
        }

        const estimationConfig = {flipHorizontal: true};
        const faces = await detector.current.estimateFaces(videoRef.current, estimationConfig);

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
    }, [])


    const startVideoDetection = useCallback(async () => {
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
    }, [detectVideo]);

    const enableDetectingVideo = useCallback(async () => {
        void startVideoDetection();
    }, [startVideoDetection])

    const handleVideoLoaded = useCallback(() => {
        setState((s) => ({
            ...s,
            isVideoLoaded: true,
        }));
        enableDetectingVideo(); // Comment/Uncomment to disable/enable detecting video once enable webcam is clicked
    }, [enableDetectingVideo]);

    useEffect(() => {
        setState((s) => ({
            ...s,
            hasWebcamSupport: !!navigator.mediaDevices.getUserMedia,
        }));
        return () => {
            disableWebcam();
        }
    }, [disableWebcam]);

    return {
        state,
        setHasWebcamSupport,
        videoRef,
        isDetectingVideo,
        disableDetectingVideo,
        enableDetectingVideo,
        enableWebcam,
        disableWebcam,
        handleVideoLoaded,
        showWebcam,
        hideWebcam
    }
}