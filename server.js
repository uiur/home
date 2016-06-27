'use strict'

const deviceModule = require('aws-iot-device-sdk').device
const exec = require('child_process').exec

const device = deviceModule({
  keyPath: '/home/pi/certs/private.pem.key',
  certPath: '/home/pi/certs/certificate.pem.crt',
  caPath: '/home/pi/certs/root-CA.crt',
  region: 'ap-northeast-1',
  clientId: 'piserver'
})

function updateLights(data, callback) {
  exec('curl -X PUT --data \'' + JSON.stringify(data) + '\' http://10.0.1.2/api/UDFYuTwbCfOgWUifr60MaAEBTDMmGAjxEzWkaRyA/groups/1/action', callback)
}

device.on('connect', () => {
  console.log('connected')
  device.subscribe(['room/aircon', 'room/lights'])
})

device.on('message', (topic, payloadBuffer) => {
  const payload = JSON.parse(payloadBuffer.toString())
  console.log(topic, payload)

  switch (topic) {
    case 'room/aircon':
      let irData
      if (payload.on) {
        irData = 'ir/data/aircon-on.json'
      } else {
        irData = 'ir/data/aircon-off.json'
      }

      exec('python ir/play.py ' + irData, err => {
        if (err) console.error(err)
      })

      break

    case 'room/lights':
      updateLights({ on: payload.on }, err => {
        if (err) console.error(err)
      })

      break
  }
})
