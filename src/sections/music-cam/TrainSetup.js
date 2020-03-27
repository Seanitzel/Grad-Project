let p5
let removeP5

let video
let recording       = false
let targetLabel     = '0'
const isClassifying = false

let posenetModel, NNModel, allModelsReady

let poses, skeletons

let prevX = 0
let prevY = 0

const maxDist = 70

export default function (_p5, parent) {
  p5 = _p5

  p5.setup = async () => {
    const canvas = p5.createCanvas(640, 480)
    canvas.parent(parent)
    video = p5.createCapture(p5.VIDEO)

    video.hide()
    posenetModel = ml5.poseNet(video, () => {
      console.log('posenetModelReady')
      allModelsReady = true
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
    const nNModelOptions = {
      inputs:  ['x', 'y'],
      outputs: ['label'],
      task:    'classification',
      debug:   true,
    }
    NNModel              = ml5.neuralNetwork(nNModelOptions)
  }

  p5.keyPressed = () => {
    if (p5.key === 'r') {
      recording = !recording
    } else if (parseInt(p5.key) >= 0) {
      targetLabel = p5.key
    } else if (p5.key === 's') {
      NNModel.saveData('data')
    } else if (p5.key === 'l') {
      NNModel.loadData('rh_data.json', dataLoaded)
      // NNModel.normalizeData()
      // NNModel.train({ epochs: 60 }, trainingCallback, finishedTraining)
    } else if (p5.key === 'd') {
      NNModel.save('model')
    }
  }

  const dataLoaded = () => {
    NNModel.normalizeData()
    NNModel.train({ epochs: 180 }, trainingCallback, finishedTraining)
  }

  const trainingCallback = (epoch, loss) => {
    // console.log(epoch, loss)
  }

  const finishedTraining = () => {
    console.log('finished training')
    NNModel.save()
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

  p5.draw = () => {
    shouldRemove()
    if (allModelsReady) {
      p5.translate(video.width, 0)
      p5.scale(-1, 1)
      p5.image(video, 0, 0, video.width, video.height)

      p5.fill(100, 255, 100)
      p5.ellipse(prevX, prevY, 20, 20)

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
            console.log(inputs, target)
            NNModel.addData(inputs, target)
          }
        }
      }
    } else {
      classify()
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

export function remove () {
  removeP5 = true
}
