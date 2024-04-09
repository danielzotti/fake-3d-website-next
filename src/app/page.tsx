"use client";
import Link from "next/link";
import styles from './page.module.scss'

export default function HomePage() {
    return (
        <div className={styles.content}>
            <h1>Fake 3D website</h1>
            <p>This is a super mega alpha version 😁</p>

            <ul>
                <li><Link href={"debug"}>Debug</Link></li>
                <li><Link href={"magritte-the-son-of-man"}>Magritte - The Son of Man (Demo)</Link></li>
                <li><Link href={"magritte-golconda"}>Magritte - Golconda (Demo)</Link></li>
            </ul>
        </div>
    );
}
