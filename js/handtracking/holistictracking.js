const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const handBoneMapping = {
    "Palm": [0, 0],
    "Ta": [1, 2],
    "Tb": [2, 3],
    "Tc": [3, 4],
    "F1a": [5, 6],
    "F1b": [6, 7],
    "F1c": [7, 8],
    "F2a": [9, 10],
    "F2b": [10, 11],
    "F2c": [11, 12],
    "F3a": [13, 14],
    "F3b": [14, 15],
    "F3c": [15, 16],
    "F4a": [17, 18],
    "F4b": [18, 19],
    "F4c": [19, 20],
}

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0,
                        canvasElement.width, canvasElement.height);
    
    // Only overwrite existing pixels.
    // canvasCtx.globalCompositeOperation = 'source-in';
    // canvasCtx.fillStyle = '#00FF00';
    // canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Only overwrite missing pixels.
    // canvasCtx.globalCompositeOperation = 'destination-atop';
    // canvasCtx.drawImage(
    //     results.image, 0, 0, canvasElement.width, canvasElement.height);
    
    // canvasCtx.globalCompositeOperation = 'source-over';
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                    {color: '#00FF00', lineWidth: 4});
    drawLandmarks(canvasCtx, results.poseLandmarks,
                    {color: '#FF0000', lineWidth: 2});

    // drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION,
    //                 {color: '#C0C0C070', lineWidth: 1});

    drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS,
                    {color: '#CC0000', lineWidth: 5});
    drawLandmarks(canvasCtx, results.leftHandLandmarks,
                    {color: '#00FF00', lineWidth: 2});

    // drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS,
    //                 {color: '#00CC00', lineWidth: 5});
    // drawLandmarks(canvasCtx, results.rightHandLandmarks,
    //                 {color: '#FF0000', lineWidth: 2});

    if (results.leftHandLandmarks) {
        const leftHand = document.getElementById('left-hand');
        
        const obj = leftHand.getObject3D('mesh');
        // Go over the submeshes and modify materials we want.
        obj.traverse(node => {
            if (handBoneMapping[node.name]) {
                const start = handBoneMapping[node.name][0];
                const end = handBoneMapping[node.name][1];
                node.position.x = 0.05 * (results.leftHandLandmarks[start].x + results.leftHandLandmarks[end].x);
                node.position.y = 0.05 * (results.leftHandLandmarks[start].y + results.leftHandLandmarks[end].y);
                node.position.z = 0.05 * (results.leftHandLandmarks[start].z + results.leftHandLandmarks[end].z);

                if (node.name == 'Palm')
                {
                    console.log(results.leftHandLandmarks[start]);
                    console.log(results.leftHandLandmarks[end]);
                    // console.log(node.position);
                }
            }
        });
    }
    canvasCtx.restore();
}

const holistic = new Holistic({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
}});

holistic.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    refineFaceLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
holistic.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await holistic.send({image: videoElement});
    },
    width: 640,
    height: 360
});

camera.start();