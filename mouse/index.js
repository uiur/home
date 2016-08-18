const request = require('axios')
const Mouse = require('node-mouse')
const m = new Mouse()

const groupUrl = 'http://10.0.1.2/api/UDFYuTwbCfOgWUifr60MaAEBTDMmGAjxEzWkaRyA/groups/0'

let lightState = { on: false }
m.on('mouseup', e => {
  console.log(e)

  lightState.on = !lightState.on

  const isLeftClick = e.button === 0
  if (isLeftClick) {
    request.put(`${groupUrl}/action`, lightState).then(res => {
      console.log(res.data)
    }).catch(err => console.error(err))
  }
})
