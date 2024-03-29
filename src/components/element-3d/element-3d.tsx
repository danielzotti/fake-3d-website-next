import {ViewContext} from "@/providers/ViewContextProvider";
import {CSSProperties, ReactElement, useContext, useMemo} from "react";

export const Element3d = ({layer, top, left, style, className, children}: {
    layer: number;
    style?: CSSProperties,
    top?: string;
    left?: string;
    children?: ReactElement;
    className?: string;
}) => {
    const {viewState: {x, y, z}} = useContext(ViewContext);

    const transform = useMemo(() => {
        const newLayer = layer ?? 0;
        const newZ = (z ?? 1) * newLayer;
        // const newX = -(x ?? 0) * newZ;
        // const newY = -(y ?? 0) * newZ;
        const newX = -50 - (x ?? 0) * newZ;
        const newY = -50 - (y ?? 0) * newZ;
        return `translate3d(${newX}%, ${newY}%, ${newZ}px)`;
    }, [layer, x, y, z]);

    return <div className={className} style={{
        position: "absolute",
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        top: "50%",
        left: "50%",
        ...top && {top: `calc(50% + ${top})`},
        ...left && {left: `calc(50% + ${left})`},
        ...style,
        transform,
    }}>{children}</div>;
}
