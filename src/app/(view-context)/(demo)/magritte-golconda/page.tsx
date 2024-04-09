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
const distanceLayerHorizontal = 420;
const distanceLayerVertical = 695;

function getDanielImageSrc(category: string, index: number) {
    return `${imagesBasePath}_${category}-${imageDanielList.at(index % imageDanielList.length)}`;
}

// [-8,-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((i) => getDanielImageSrc(Math.random() > 0.5 ? "man" : "mac", i))


const DanielRow = ({count, level, top, left, layer}: { count: number; level: number; top: number; left: number;  layer: number }) => {
    return Array.from({length: count}, (_, i) => i - Math.floor(count / 2)).map((i) => {
        return <Element3d key={i} layer={layer} top={`${(distanceLayerVertical * level) + top}px`}
                          left={`${(distanceLayerHorizontal * i) + left}px`}>
            <Image src={getDanielImageSrc(Math.random() > 0.5 ? "man" : "mac", i)}
                   alt="Daniel" width={1434}
                   height={1920}
                   style={{width: "212px", height: "auto", opacity: 0.5}}/>
        </Element3d>
    })
}

const DanielGrid = ({count, top, left, layer}: { count: number; top: number; left: number; layer: number }) => {
    return Array.from({length: (Math.floor(count / 2))}, (_, i) => i - Math.floor(count / 4))
        .map(level => <DanielRow key={count} count={count} level={level} top={top} left={left} layer={layer}/>)
}

export default function MagritteTheSonOfManPage() {
    return (
        <>
            {/*BACKGROUND*/}
            <Element3d layer={0} className={styles.frame}>
                <Image src={'images/magritte/golconda/magritte-golcondaniel.jpg'} width={1841} height={1500}
                       alt={"Golconda"}/>
            </Element3d>
            {/*<Element3d layer={0} className={styles.frame}>*/}
            {/*    <Image src={'images/magritte/golconda/magritte-golconda.jpg'} width={1841} height={1500}*/}
            {/*           alt={"Golconda"}/>*/}
            {/*</Element3d>*/}

            {/*THIRD LAYER*/}
            <DanielGrid layer={-50} count={12} top={450} left={-108}/>
            <DanielGrid layer={-50} count={12} top={103} left={-308}/>

            {/*SECOND LAYER*/}
            <DanielGrid layer={10} count={12} top={450} left={-108}/>
            <DanielGrid layer={10} count={12} top={103} left={-308}/>

            {/*FIRST LAYER*/}
            <DanielGrid layer={100} count={12} top={103} left={-308}/>
            <DanielGrid layer={100} count={12} top={450} left={-108}/>

            <Element3d layer={100} top="105px" left="-308px">
                <Image src={'images/magritte/golconda/golconda-daniel_man-front.png'} width={1434} height={1920}
                       alt={"Daniel Front"}
                       style={{width: "212px", height: "auto", opacity: 0.5}}
                />
            </Element3d>

        </>
    );
}
