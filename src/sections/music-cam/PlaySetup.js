import { Synth } from 'tone'

let p5
let removeP5

let video
let isClassifying = false
let faceapiDetections

let posenetModel, faceApiModel, NNModel

let allModelsReady = false

let poses, skeletons

let color = null

let dbLevel                 = -80
let currNote                = 'C4'
let pitchClasses            = ['C', 'D', 'E', 'G', 'A']
let octave                  = 4
let isOctaveUpdateAvailable = true

let mouthTop    = -Infinity
let mouthBottom = Infinity

const SKELETONS_TO_DRAW  = ['rightWrist', 'leftWrist', 'rightShoulder', 'leftShoulder', 'rightElbow', 'leftElbow']
const BODY_PARTS_TO_DRAW = ['rightWrist',
  'leftWrist',
  'rightShoulder',
  'leftShoulder',
  'rightElbow',
  'leftElbow',
  'leftEye',
  'rightEye',
]

const synthConfig = {
  oscillator: {
    type:     'fatcustom',
    partials: [0.2, 1, 0, 0.5, 0.1],
    spread:   40,
    // "count" : 3
  },
  envelope:   {
    attack:  0.05,
    decay:   1.6,
    // "sustain": 1,
    release: 0.01,
  },
}

const synth = new Synth(synthConfig).toDestination()

export default function (_p5, parent) {
  p5 = _p5

  p5.setup = async () => {
    const canvas = p5.createCanvas(640, 480)
    updateColors()
    canvas.parent(parent)
    video                  = p5.createCapture(p5.VIDEO)
    const detectionOptions = {
      withLandmarks:   true,
      withDescriptors: false,
    }

    video.hide()
    posenetModel = ml5.poseNet(video, () => {
      console.log('posenetModelReady')
    })
    posenetModel.on('pose', data => {
      if (data.length) {
        const results = data.filter(res => res.pose.score > 0.6)
        poses         = []
        skeletons     = []
        results.forEach(res => {
          poses.push(res.pose)
          skeletons.push(res.skeleton)
        })
      }
    })
    faceApiModel       = ml5.faceApi(video, detectionOptions, faceApiModelReady)
    const modelOptions = {
      inputs:  ['x', 'y'],
      outputs: ['label'],
      task:    'classification',
      debug:   true,
    }
    NNModel            = ml5.neuralNetwork(modelOptions)
    NNModel.load('model.json', NNModelLoaded)
  }

  const faceApiModelReady = () => {
    console.log('face API ready!')
    allModelsReady = true
  }

  const gotResults = (err, result) => {
    if (err) {
      console.log(err)
      return
    }
    faceapiDetections = result
  }

  const drawLandmarks = (detections) => {
    p5.noFill()
    p5.stroke(color)
    p5.strokeWeight(3)

    for (let i = 0; i < detections.length; i++) {
      const mouth = detections[i].parts.mouth
      drawPart(mouth, true)
    }
  }

  const drawPart = (feature, closed) => {
    p5.beginShape()
    mouthTop    = -Infinity
    mouthBottom = Infinity
    for (let i = 0; i < feature.length; i++) {
      const x = feature[i]._x
      const y = feature[i]._y
      if (y < mouthBottom) {
        mouthBottom = y
      } else if (y > mouthTop) {
        mouthTop = y
      }
      p5.vertex(x, y)
    }
    const dist = p5.dist(0, mouthBottom, 0, mouthTop)
    dbLevel    = p5.map(dist, 5, 15, -80, 0)
    if (dbLevel > 0) {
      dbLevel = 0
    }
    synth.volume.rampTo(dbLevel)

    if (closed === true) {
      p5.endShape(p5.CLOSE)
    } else {
      p5.endShape()
    }
  }

  p5.keyPressed = () => {
    if (p5.key === 'p') {
      isClassifying = false
    } else if (p5.key === 'a') {
      synth.setNote('A3')
    } else if (p5.key === 'b') {
      synth.setNote('C3')
    }
  }

  const NNModelLoaded = () => {
    console.log('NNMODEL READY')
    isClassifying = true
  }

  const classify = () => {
    if (poses && poses[0]) {
      updatePitchClass()
      updateOctave()
    }
  }

  const updatePitchClass = () => {
    const x      = poses[0].rightWrist.x
    const y      = poses[0].rightWrist.y
    const inputs = {
      x,
      y,
    }
    NNModel.classify(inputs, (error, result) => {
      if (error) {
        return
      }
      const resultLabel = result[0].label
      const pc          = pitchClasses[parseInt(resultLabel)]
      const note        = `${pc}${octave}`
      if (note !== currNote) {
        currNote = note
        synth.setNote(note)
        updateColors()
      }
    })
  }

  const updateOctave = () => {
    if (isOctaveUpdateAvailable) {
      const leftHandX         = poses[0].leftWrist.x
      const leftHandY         = poses[0].leftWrist.y
      const leftShoulderX     = poses[0].leftShoulder.x
      const leftShoulderY     = poses[0].leftShoulder.y
      const rightHipX         = poses[0].rightHip.x
      const rightHipY         = poses[0].rightHip.y
      const leftShoulderDist  = parseInt(p5.dist(leftHandX, leftHandY, leftShoulderX, leftShoulderY))
      const rightShoulderDist = parseInt(p5.dist(leftHandX, leftHandY, rightHipX, rightHipY))
      if (leftShoulderDist < 60) {
        if (octave > 2) {
          --octave
        }
        onOctaveUpdate()
      } else if (rightShoulderDist < 60) {
        if (octave < 7) {
          ++octave
        }
        onOctaveUpdate()
      }
    }
  }

  const onOctaveUpdate = () => {
    isOctaveUpdateAvailable = false
    setTimeout(() => {
      isOctaveUpdateAvailable = true
    }, 400)
  }

  const updateColors = () => {
    color = p5.color(
      p5.random(255),
      p5.random(100, 200),
      p5.random(100),
      p5.random(200, 255),
    )
  }

  p5.draw = () => {
    shouldRemove()
    if (allModelsReady) {
      p5.translate(video.width, 0)
      p5.scale(-1, 1)
      p5.image(video, 0, 0, video.width, video.height)

      faceapiAction()

      drawSkeleton()

      posenetAction()

      p5.translate(p5.width / 2, p5.height / 2)
      p5.scale(1, -1)
      p5.rotate(p5.PI)
      p5.textSize(64)
      p5.strokeWeight(34)
      p5.stroke(0, 0, 0)
      p5.fill(color)
      p5.text(currNote, -300, -170)
    }
  }

  const shouldRemove = () => {
    if (removeP5) {
      video.remove()
      p5.remove()
      removeP5 = false
    }
  }

  const posenetAction = () => {
    if (isClassifying) {
      classify()
    }
  }

  const faceapiAction = () => {
    faceApiModel.detect(gotResults)

    if (faceapiDetections && faceapiDetections.length) {
      drawLandmarks(faceapiDetections)
    }
  }

  const drawSkeleton = () => {
    if (poses && poses.length) {
      for (const pose of poses) {
        for (const skeleton of skeletons) {
          for (let i = 0; i < skeleton.length; i++) {
            const a = skeleton[i][0]
            const b = skeleton[i][1]
            if (SKELETONS_TO_DRAW.includes(a.part) && SKELETONS_TO_DRAW.includes(b.part)) {
              p5.strokeWeight(6)
              p5.stroke(color)
              p5.line(a.position.x, a.position.y, b.position.x, b.position.y)
            }
          }
          for (let i = 0; i < pose.keypoints.length; i++) {
            const { part, position } = pose.keypoints[i]
            if (BODY_PARTS_TO_DRAW.includes(part)) {
              const { x, y } = position
              if (['rightEye', 'leftEye'].includes(part)) {
                p5.fill(255)
                p5.strokeWeight(20)
                p5.stroke(color)
                p5.ellipse(x, y, 5, 5)
              } else {
                p5.strokeWeight(0.1)
                p5.fill(color)
                p5.stroke(255)
                p5.ellipse(x, y, 25, 25)
              }
            }
          }
        }
      }
    }
  }
}

export function setState (s) {
  if (s) {
    synth.triggerAttack(currNote)
  } else {
    synth.triggerRelease()
  }
}

export function remove () {
  synth.triggerRelease()
  removeP5 = true
}

export function changePitchClasses (newPitchClasses) {
  pitchClasses = newPitchClasses
}

export function updateReadyState () {

}

export function resetNote () {
  octave   = 4
  currNote = `${pitchClasses[0]}${4}`
}
