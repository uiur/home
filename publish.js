const deviceModule = require('aws-iot-device-sdk').device
const exec = require('child_process').exec
const ltsv = require('ltsv')

const device = deviceModule({
  keyPath: '/home/pi/certs/private.pem.key',
  certPath: '/home/pi/certs/certificate.pem.crt',
  caPath: '/home/pi/certs/root-CA.crt',
  clientId: 'pi',
  region: 'ap-northeast-1'
})

function readData(cb) {
  exec('sudo python report.py', (err, stdout, stderr) => {
    if (err) {
      cb(err)
      return
    }

    data = ltsv.parse(stdout)[0]
    Object.keys(data).forEach(key => {
      data[key] = JSON.parse(data[key])
    })

    cb(null, data)
  })
}

device.on('connect', () => {
  readData((err, data) => {
    if (err) {
      console.error(err)
      return
    }

    device.publish('room', JSON.stringify(data))
    device.end()
  })
})
