"use client";

import {Element3d} from "@/components/element-3d/element-3d";
import Image from "next/image";

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
const distanceX = 450;
const distanceY = 685;
const distanceZ = 10;

function getDanielImageSrc(category: string, index: number) {
    return `${imagesBasePath}_${category}-${imageDanielList.at(index % imageDanielList.length)}`;
}

const DanielRow = ({count, level, top, left, layer, scale}: {
    count: number;
    level: number;
    top: number;
    left: number;
    layer: number
    scale: number;
}) => {
    return Array.from({length: count}, (_, i) => i + 1 - Math.floor(count / 2)).map((i) => {

        const getTop = () => ((distanceY * level) + top) * scale;
        const getLeft = () => ((distanceX * i) + left) * scale;

        return <Element3d key={i} layer={layer} top={`${getTop()}px`}
                          left={`${getLeft()}px`}>
            <Image src={getDanielImageSrc(imageCategoryList[Math.random() > 0.5 ? 1 : 0], i)}
                   alt="Daniel" width={1434}
                   height={1920}
                   style={{
                       width: `212px`,
                       height: "auto",
                       scale: `${scale}`,
                       // opacity: 0.5,
                       // filter: "drop-shadow(3px 3px 0 red)"
                   }}
            />
        </Element3d>
    })
}

const DanielGrid = ({count, top, left, layer, scale}: {
    count: number;
    top: number;
    left: number;
    layer: number;
    scale: number
}) => {

    return Array.from({length: (Math.floor(count / 2))}, (_, i) => i - Math.floor((count) / 4))
        .map(level => <DanielRow key={level} count={count} level={level} top={top} left={left} layer={layer}
                                 scale={scale}/>)
}

export default function MagritteTheSonOfManPage() {
    return (
        <>
            {/*BACKGROUND*/}
            <Element3d layer={0} className={styles.frame}>
                <Image src={'images/magritte/golconda/magritte-golconda-empty.jpg'} width={1841} height={1500}
                       alt={"Golconda Empty"}/>
            </Element3d>
            {/*<Element3d layer={0} className={styles.frame}>*/}
            {/*    <Image src={'images/magritte/golconda/magritte-golcondaniel.jpg'} width={1841} height={1500}*/}
            {/*           alt={"Golconda"}/>*/}
            {/*</Element3d>*/}
            {/*<Element3d layer={0} className={styles.frame}>*/}
            {/*    <Image src={'images/magritte/golconda/magritte-golconda.jpg'} width={1841} height={1500}*/}
            {/*           alt={"Golconda"}/>*/}
            {/*</Element3d>*/}

            {/*THIRD LAYER*/}
            <DanielGrid layer={2} scale={0.35} count={18} top={500 - 1000} left={-118}/>
            <DanielGrid layer={2} scale={0.35} count={18} top={153 - 1000} left={-348}/>

            {/*SECOND LAYER*/}
            <DanielGrid layer={25} scale={0.6} count={14} top={320} left={-68}/>
            <DanielGrid layer={25} scale={0.6} count={14} top={-30} left={-308}/>

            {/*FIRST LAYER*/}
            <DanielGrid layer={40} scale={1.3} count={10} top={103} left={-338}/>
            <DanielGrid layer={40} scale={1.3} count={10} top={470} left={-118}/>
        </>
    );
}
