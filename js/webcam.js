  // You can also set which camera to use (front/back/etc)
  navigator.mediaDevices.getUserMedia({audio: false, video: true})
  .then(stream => {
    let $video = document.querySelector('video')
    $video.srcObject = stream
    $video.onloadedmetadata = () => {
      $video.play()
    }
  })
