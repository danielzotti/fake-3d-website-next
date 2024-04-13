"use client";
import Image from "next/image";
import Link from "next/link";
import styles from './page.module.scss'
import debug from '../../public/images/debug-preview.png';
import golconda from '../../public/images/magritte/golconda/magritte-golconda.jpg';
import theSonOfMan from '../../public/images/magritte/the-son-of-man/magritte-the-son-of-man.png';

export default function HomePage() {
    return (
        <div className={styles.content}>
            <h1>Fake 3D website</h1>
            <p>This is a super mega alpha version 😁</p>

            <div className={styles.linksContainer}>

                <Link href={"magritte-golconda"} className={styles.link}>
                    <div className={styles.linkImageContainer}>
                        <Image src={golconda.src}
                               alt={`Magritte - "Golconda" painting`}
                               fill
                               objectFit={"cover"}
                        />
                    </div>
                    <div>Magritte - Golconda</div>
                    <div>
                        <small>Golcondaniel</small>
                    </div>
                </Link>

                <Link href={"magritte-the-son-of-man"} className={styles.link}>
                    <div className={styles.linkImageContainer}>
                        <Image src={theSonOfMan.src}
                               alt={`Magritte - "The Son of Man" painting`}
                               fill
                               objectFit={"cover"}
                        />
                    </div>
                    <div>Magritte - The Son of Man</div>
                    <div>
                        <small>The Son of Daniel</small>
                    </div>
                </Link>
            </div>


            <div className={styles.linksContainer}>
                <Link href={"debug"} className={styles.link}>
                    <div className={styles.linkImageContainer}>
                        <Image src={debug.src}
                               alt={`Fake 3D Website Debug preview`}
                               fill
                               objectFit={"cover"}
                        />
                    </div>
                    <div>DEBUG</div>
                </Link>
            </div>
        </div>
    );
}
