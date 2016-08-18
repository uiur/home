const request = require('axios')
const Mouse = require('node-mouse')
const InputEvent = require('input-event')
const throttle = require('lodash.throttle')

const mouseDevice = new Mouse()

const input = new InputEvent('/dev/input/event0')
const eventDevice = new InputEvent.Mouse(input)

const groupUrl = 'http://10.0.1.2/api/UDFYuTwbCfOgWUifr60MaAEBTDMmGAjxEzWkaRyA/groups/0'

mouseDevice.on('click', e => {
  console.log(e)

  const isLeftClick = e.button === 0
  if (isLeftClick) {
    request.get(groupUrl).then(res => {
      let lightState = { on: res.data.on }
      lightState.on = !lightState.on

      return request.put(`${groupUrl}/action`, lightState)
    })
      .then(res => console.log(res.data))
      .catch(console.error)
  }
})

let delta = 0
eventDevice.on('wheel', e => {
  console.log(e)

  const direction = e.value === 1 ? 1 : -1
  delta += direction * 10
})

eventDevice.on('wheel', throttle(e => {
  request.get(groupUrl).then(res => {
    let bri = res.data.action.bri + delta
    bri = Math.max(0, Math.min(255, bri))
    delta = 0

    request.put(`${groupUrl}/action`, { bri: bri })
      .then(res => res.data)
      .then(console.log)
      .catch(console.error)
  })
}, 200))
