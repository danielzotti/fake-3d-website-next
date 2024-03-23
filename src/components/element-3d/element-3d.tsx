import {ViewContext} from "@/providers/ViewContextProvider";
import {CSSProperties, useContext, useMemo} from "react";

export const Element3d = ({layer, style}: { layer: number; style: CSSProperties }) => {
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
