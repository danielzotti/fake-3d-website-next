import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.scss";
import Script from "next/script";
import {ReactNode, Suspense} from "react";

const inter = Inter({subsets: ["latin"]});

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
        <html lang="en">
        <body className={inter.className}>
        {children}
        </body>
        <Suspense fallback={null}>
            {/*Client only*/}
            <Script src="/service-worker.js"/>
        </Suspense>
        </html>
    );
}
