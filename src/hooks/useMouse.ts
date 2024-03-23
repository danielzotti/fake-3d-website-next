import {ViewState} from "@/models/view-state.models";
import {ViewContext} from "@/providers/ViewContextProvider";
import {useCallback, useContext, useEffect} from "react";

export const useMouse = () => {
    const {setViewState} = useContext(ViewContext);

    const detectMousePosition = useCallback((e: MouseEvent) => {
        setViewState(s => ({
            ...s,
            x: ((e.clientX / window.innerWidth) * 2) - 1,
            y: ((e.clientY / window.innerHeight) * 2) - 1,
            z: s.z === undefined ? 1 : s.z > 0 ? s.z : 0,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        }))
    }, [setViewState])

    const detectMouseWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        const deltaZ = e.deltaY / window.innerHeight;

        setViewState((s: ViewState) => ({
            ...s,
            z: s.z !== undefined && s.z - deltaZ > 0 ? s.z - deltaZ : 0
        }));
    }, [setViewState]);

    const enableMouse = useCallback(() => {
        window.addEventListener('mousemove', detectMousePosition)
        window.addEventListener('wheel', detectMouseWheel, {passive: false}) // See https://www.uriports.com/blog/easy-fix-for-unable-to-preventdefault-inside-passive-event-listener/
    }, [detectMousePosition, detectMouseWheel])

    const disableMouse = useCallback(() => {
        setViewState({
            x: 0,
            y: 0
        });
        window.removeEventListener('mousemove', detectMousePosition)
        window.removeEventListener('wheel', detectMouseWheel)
    }, [detectMousePosition, detectMouseWheel, setViewState]);

    useEffect(() => {
        return () => {
            disableMouse();
        }
    }, []);

    return {
        enableMouse,
        disableMouse
    }
}
