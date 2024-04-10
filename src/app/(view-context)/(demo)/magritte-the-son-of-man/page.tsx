"use client";

import {Element3d} from "@/components/element-3d/element-3d";
import Image from "next/image";

import styles from "./page.module.scss";

export default function MagritteTheSonOfManPage() {
    return (
        <>
            <Element3d layer={-1} className={styles.frame}>
                <Image src={'images/magritte/the-son-of-man/background.png'} width={3000} height={3000} alt={"Background"}/>
            </Element3d>
            <Element3d layer={1} top={"750px"}>
                <Image src={'images/magritte/the-son-of-man/daniel.png'} width={428} height={1801} alt={"Daniel"}/>
            </Element3d>
            <Element3d layer={50} top={"-32px"} left={"7px"}>
                <Image src={'images/magritte/the-son-of-man/apple.png'} width={122} height={138} alt={"Apple"}/>
            </Element3d>
            <Element3d layer={80} top={"-300px"} left={"500px"}>
                <Image src={'images/magritte/the-son-of-man/dove.png'} width={717} height={377} alt={"Dove"}/>
            </Element3d>
        </>
    );
}
