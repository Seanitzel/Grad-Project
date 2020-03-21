import { Synth } from 'tone'

let p5
let removeP5

let video
let recording     = false
let targetLabel   = 'o'
let isClassifying = false
let faceapiDetections

let posenetModel, faceApiModel, NNModel

let allModelsReady = false

let poses, skeletons

let dbLevel     = -80
const currNote  = 'C3'
let mouthTop    = -Infinity
let mouthBottom = Infinity
let prevX       = 0
let prevY       = 0

const maxDist = 70

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
        const results = data.filter(res => res.pose.score > 0.3)
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
    // synth.triggerAttack('C3')
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
    p5.stroke(161, 95, 251)
    p5.strokeWeight(2)

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
    dbLevel    = p5.map(dist, 10, 40, -80, 0)
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
    if (p5.key === 'r') {
      recording = !recording
    } else if (p5.key === 'c') {
      targetLabel = 'm'
    } else if (p5.key === 's') {
      NNModel.saveData('data')
    } else if (p5.key === 'l') {
      NNModel.save('model')
      // NNModel.loadData('data.json', dataLoaded)
      // NNModel.normalizeData()
      // NNModel.train({epochs: 60}, trainingCallback, finishedTraining)
    } else if (p5.key === 'p') {
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

  // const dataLoaded = () => {
  //   NNModel.normalizeData()
  //   NNModel.train({ epochs: 60 }, trainingCallback, finishedTraining)
  // }

  const trainingCallback = (epoch, loss) => {
    console.log(epoch, loss)
  }

  const finishedTraining = () => {
    console.log('finished training')
    // NNModel.save()
    // isClassifying = !isClassifying
  }

  const classify = () => {
    if (poses && poses[0]) {
      const x      = poses[0].rightWrist.x
      const y      = poses[0].rightWrist.y
      const inputs = {
        x,
        y,
      }
      NNModel.classify(inputs, (error, result) => {
        if (error) {
          console.log(error)
          return
        }
        const dist = parseInt(p5.dist(prevX, prevY, x, y))
        if (dist > maxDist) {
          prevX = x
          prevY = y
          if (result[0].label === 'o') {
            synth.setNote('C4')
          } else {
            synth.setNote('C3')
          }
        }
      })
    }
  }

  p5.mouseClicked = () => {
    classify()
  }

  p5.draw = () => {
    shouldRemove()
    if (allModelsReady) {
      p5.translate(video.width, 0)
      p5.scale(-1, 1)
      p5.image(video, 0, 0, video.width, video.height)

      p5.fill(100, 255, 100)
      p5.ellipse(prevX, prevY, 20, 20)

      faceapiAction()

      drawSkeleton()

      posenetAction()
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
    if (!isClassifying) {
      if (poses && poses.length) {
        for (const pose of poses) {
          p5.fill(100, 255, 100)
          p5.ellipse(pose.rightWrist.x, pose.rightWrist.y, 30, 30)
          if (recording) {
            const x      = poses[0].rightWrist.x
            const y      = poses[0].rightWrist.y
            const inputs = {
              x,
              y,
            }
            const target = { label: targetLabel }
            console.log(target)
            console.log(inputs, target)
            NNModel.addData(inputs, target)
          }
        }
      }
    } else {
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
            p5.strokeWeight(2)
            p5.stroke(0)

            p5.line(a.position.x, a.position.y, b.position.x, b.position.y)
          }
          for (let i = 0; i < pose.keypoints.length; i++) {
            const x = pose.keypoints[i].position.x
            const y = pose.keypoints[i].position.y
            p5.fill(0)
            p5.stroke(255)
            p5.ellipse(x, y, 16, 16)
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
