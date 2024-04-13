"use client";

import {Element3d} from "@/components/element-3d/element-3d";
import Image from "next/image";
import {CSSProperties} from "react";

import styles from "./page.module.scss";

const imagesBasePath = 'images/magritte/golconda/golconda-daniel';
const imageCategoryList = ['man', 'mac'];
const imageDanielList = [
    "front.png",
    "back.png",
    "left.png",
    "left-look.png",
    "three-quarter-left.png",
    "three-quarter-left-look.png",
    "right.png",
    "right-look.png",
    "three-quarter-right.png",
    "three-quarter-right-look.png",
];
const distanceX = 400;
const distanceY = 685;

function getDanielImageSrc(category: string, index: number) {
    return `${imagesBasePath}_${category}-${imageDanielList.at(Math.floor(Math.random() * imageDanielList.length) % imageDanielList.length)}`;
}

interface ElementProps {
    top: number;
    left: number;
    layer: number
    scale?: number;
    style?: CSSProperties;
}

type DanielRowProps = {
    count: number;
    level: number;
} & ElementProps;
const DanielRow = ({count, level, top, left, layer, scale = 1, style}: DanielRowProps) => {
    return Array.from({length: count}, (_, i) => i + 1 - Math.floor(count / 2))
        .map((i) => {
            return <Element3d key={i}
                              layer={layer}
                              top={`${((distanceY * level) + top) * scale}px`}
                              left={`${((distanceX * i) + left) * scale}px`}
            >
                <Image src={getDanielImageSrc(imageCategoryList[Math.random() > 0.5 ? 1 : 0], i)}
                       alt="Daniel" width={1434}
                       height={1920}
                       style={{
                           width: `212px`,
                           height: "auto",
                           scale: `${scale}`,
                           ...style
                       }}
                />
            </Element3d>
        })
}

type DanielGridProps = {
    count: number;
} & ElementProps;
const DanielGrid = ({count, top, left, layer, scale, style}: DanielGridProps) => {

    return Array.from({length: (Math.floor(count / 2))}, (_, i) => i - Math.floor((count) / 4))
        .map(level => {
            return <DanielRow key={level}
                              count={count}
                              level={level}
                              top={top}
                              left={left}
                              layer={layer}
                              scale={scale}
                              style={style}/>
        })
}

export default function MagritteTheSonOfManPage() {
    return (
        <>
            {/*SKY*/}
            <Element3d layer={0}>
                <div className={styles.sky}/>
            </Element3d>

            {/*THIRD LAYER*/}
            <DanielGrid layer={15}
                        scale={0.35}
                        count={18}
                        top={-500}
                        left={-118}
                        style={{filter: "contrast(0.5)"}}
            />
            <DanielGrid layer={15}
                        scale={0.35}
                        count={18}
                        top={-847}
                        left={-348}
                        style={{filter: "contrast(0.5)"}}
            />

            {/*HOUSE*/}
            <Element3d layer={3} top={"470px"} left={"-60px"}>
                <Image src={'images/magritte/golconda/golconda-floating-house.png'}
                       width={1880}
                       height={793}
                       alt={"Golconda House Background"}
                       style={{
                           scale: "1"
                       }}
                />
            </Element3d>

            {/*SECOND LAYER*/}
            <DanielGrid layer={25}
                        scale={0.6}
                        count={14}
                        top={320}
                        left={-68}
                        style={{filter: "contrast(0.75)"}}
            />
            <DanielGrid layer={25}
                        scale={0.6}
                        count={14}
                        top={-30}
                        left={-308}
                        style={{filter: "contrast(0.75)"}}
            />


            {/*FIRST LAYER*/}
            <DanielGrid layer={35} scale={1.3} count={10} top={103} left={-305}/>
            <DanielGrid layer={35} scale={1.3} count={10} top={470} left={-108}/>

            {/*HOUSE*/}
            <Element3d layer={40} top={"524px"} left={"1407px"}>
                <Image src={'images/magritte/golconda/golconda-floating-house2.png'}
                       width={2106}
                       height={4215}
                       alt={"Golconda House Foreground"}
                       style={{
                           scale: "0.8",
                       }}
                />
            </Element3d>
        </>
    );
}
