const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0,
                        canvasElement.width, canvasElement.height);
    
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                            {color: '#00FF00', lineWidth: 5});
            drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
        }
    }

    if (results.multiHandWorldLandmarks) {
        let handIndex = 0;
        const leftPalm = document.getElementById('left-hand-palm');
        const rightPalm = document.getElementById('right-hand-palm');
        for (let handIndex=0; handIndex < results.multiHandWorldLandmarks.length; handIndex++) {
            const landmarks = results.multiHandWorldLandmarks[handIndex];
            let handLabel = results.multiHandedness[handIndex].label;
            let offset = handLabel == 'Left' ? rightPalm.getAttribute('position') : leftPalm.getAttribute('position');

            for (let i=0; i<landmarks.length; i++)
            {
                const id = (handLabel == 'Left' ? 'left-hand-' : 'right-hand-') + i.toString();
                let box = document.getElementById(id);
                if (box)
                {
                    box.setAttribute("position", {
                        x: -(landmarks[i].x - landmarks[0].x) + offset.x, 
                        y: -(landmarks[i].y - landmarks[0].y) + offset.y, 
                        z: landmarks[i].z - landmarks[0].z + offset.z});
                }
            }
        }
    }
    canvasCtx.restore();
}

function onResultsPose(results) {
    canvasCtx.save();
    if (results.poseLandmarks)
    {
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
            {color: '#00FF00', lineWidth: 4});
        drawLandmarks(canvasCtx, results.poseLandmarks,
            {color: '#FF0000', lineWidth: 2});
    }
    canvasCtx.restore();
    if (results.poseWorldLandmarks) {
        let box = document.getElementById('left-hand-palm');
        box.setAttribute("position", {
            x: -results.poseWorldLandmarks[15].x,
            y: -results.poseWorldLandmarks[15].y,
            z: results.poseWorldLandmarks[15].z,
        });

        box = document.getElementById('right-hand-palm');
        box.setAttribute("position", {
            x: -results.poseWorldLandmarks[16].x,
            y: -results.poseWorldLandmarks[16].y,
            z: results.poseWorldLandmarks[16].z,
        });
    }
}

const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }});

hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onResults);

const pose = new Pose({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  }});

pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });
pose.onResults(onResultsPose);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement});
        await pose.send({image: videoElement});
    },
    width: 640,
    height: 360
});

camera.start();