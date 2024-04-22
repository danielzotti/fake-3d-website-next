import {MetadataRoute} from "next";

// TODO: it doesn't work with GitHub pages since it creates a manifest.webmanifest file in the root directory (we want to have it in /fake-3d-website-next subfolder)
export default function _manifest(): MetadataRoute.Manifest {
    return {
        name: "Fake 3D Website",
        short_name: "Fake 3D Website",
        description: "A 3D mode for a website using webcam and face detection",
        start_url: "/",
        display: "standalone",
        background_color: "#252525",
        theme_color: "#87CEFAFF",
        icons: [
            {
                src: "/images/favicon.png",
                sizes: "256x256",
                type: "image/png",
            }
        ],
    };
}
