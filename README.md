# Fake 3D Website

A 3D mode for a website using webcam and face detection

## Dependencies

- NextJs 14
- TensorflowJs
- MediaPipe Face Detection

## Notes

- HTTPS on local environment: https://mswjs.io/docs/recipes/using-local-https/#trust-certificate-on-browser-level
- Service Worker
    - Chrome --> Application Tab --> Service Workers --> Update on reload [checked!]
    - Chrome --> Network Tab --> Disable cache [checked!]

## Project idea

- Create a hide & seek website where the user can enable 3D mode using the webcam in order to find hidden things
    - A famous 3D painting?
- Alternative point of views:
    - Far away (frame?)
    - Very close (Keyhole?)
- Recreate famous paintings in 3D

## Project features

- Enable webcam
    - Read webcam stream
    - Show video on page
    - Once the video is loaded, show "Enable 3D" button
- Enable 3D
    - Load the model
    - Start face detection
    - Read right eye position
    - Calculate distance from the center
    - Apply translation coords to child elements (Box3D)
- Disable 3D
    - Stop face detection
    - Stop video
    - Position content in the basic position (0,0)
- Disable webcam
    - Hide video & Reset Stream
- Enable mouse
    - Listen to mouse move events (change x and y position)
    - Listen to mouse wheel event (zoom in/out)
- Disable mouse
  - Remove listeners (mouse move, mouse wheel)

## TODO

- [x] Add local mediapipe detector solutionPath
- [x] Cache model using Service Worker (do not download model every time)
- [x] Add React Context in order to simplify the set of x and y point
- [x] Add/Improve depth using both eyes (it works only calculating the horizontal distance)
- [x] Create a more graphical example (Magritte paintings)
- [x] Add threshold/interpolation for face detection (view position buffer)
- [x] Make z (zoom) work not just if eyes are horizontal
- [ ] Select webcam (in case of multiple webcams)
- [ ] Improve UI
- [ ] Improve performance (lighter images?) 
- [ ] Create an example of a real "standard" website with 3D mode

## Thanks to

- TensorflowJs
- MediaPipe/FaceDetection
- [Prevent Default inside passive elements](https://www.uriports.com/blog/easy-fix-for-unable-to-preventdefault-inside-passive-event-listener/)
- [Emoji Cursor](https://www.emojicursor.app/)
