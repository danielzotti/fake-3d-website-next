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
                <li><Link href={"demo"}>Demo</Link></li>
            </ul>
        </div>
    );
}
