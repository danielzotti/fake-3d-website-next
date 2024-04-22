import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.scss";
import Script from "next/script";
import {ReactNode, Suspense} from "react";
import {Roboto} from 'next/font/google'

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
})
export const metadata: Metadata = {
    title: "Fake 3D Website",
    description: "A 3D mode for a website using webcam and face detection",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en" className={roboto.className}>
        <head>
            <meta charSet="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <link rel="icon" href="images/favicon.png"/>
            <link rel="manifest" href="manifest.webmanifest"/>
        </head>
        <body>
        {children}
        </body>
        <Suspense fallback={null}>
            {/*Client only*/}
            <Script src="service-worker.js"/>
        </Suspense>
        </html>
    );
}
