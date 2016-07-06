'use strict'

var AWS = require('aws-sdk')
var qs = require('querystring')
var exec = require('child_process').exec
var axios = require('axios')
var token, kmsEncyptedToken

kmsEncyptedToken = 'CiAt+TsuI6Hi2oKVHYHhBfa+QRilif61RHGjpi7zsgQPmBKfAQEBAgB4Lfk7LiOh4tqClR2B4QX2vkEYpYn+tURxo6Yu87IED5gAAAB2MHQGCSqGSIb3DQEHBqBnMGUCAQAwYAYJKoZIhvcNAQcBMB4GCWCGSAFlAwQBLjARBAxJX8JQ7gipo3J/PZgCARCAM8h8QdsPyCiPhB76MJerdkvJ6gst4uEG5CAjU7/vQDpg9PzGlnjmSKrIc7D8bN46Nc11pg=='


exports.handle = function (event, context) {
  if (token) {
    // Container reuse, simply process the event with the key in memory
    processEvent(event, context)
  } else if (kmsEncyptedToken && kmsEncyptedToken !== '<kmsEncryptedToken>') {
    var encryptedBuf = new Buffer(kmsEncyptedToken, 'base64')
    var cipherText = {CiphertextBlob: encryptedBuf}

    var kms = new AWS.KMS()
    kms.decrypt(cipherText, function (err, data) {
      if (err) {
        console.log('Decrypt error: ' + err)
        context.fail(err)
      } else {
        token = data.Plaintext.toString('ascii')
        processEvent(event, context)
      }
    })

  } else {
    context.fail('Token has not been set.')
  }
}

function publish (topic, payload) {
  return axios.post(`https://84ry1pi5zb.execute-api.ap-northeast-1.amazonaws.com/prod/publish?topic=${topic}`, payload)
}

function reply (context, text) {
  context.succeed({
    username: 'Jules',
    icon_url: 'https://i.gyazo.com/thumb/200_crop/_84bd6b7081e2b45db17a6588be19a075-jpg.jpg',
    text: text
  })
}

var processEvent = function (event, context) {
  var body = event.body
  var params = qs.parse(body)
  var requestToken = params.token
  if (requestToken !== token) {
    console.error('Request token (' + requestToken + ') does not match exptected')
    context.fail('Invalid request token')
  }

  var user = params.user_name
  var channel = params.channel_name
  var commandText = params.text
  var triggerWord = params.trigger_word

  var text = commandText.replace(new RegExp(`^${triggerWord}\s*`), '')

  var topic
  var payload
  if ((/でんきつけて/).test(text)) {
    topic = 'lights'
    payload = { on: true }
  } else if ((/でんきけして/).test(text)) {
    topic = 'lights'
    payload = { on: false }
  } else if ((/エアコンつけて/).test(text)) {
    topic = 'aircon'
    payload = { on: true }
  } else if ((/エアコンけして/).test(text)) {
    topic = 'aircon'
    payload = { on: false }
  } else if ((/こんにちは/).test(text)) {
    reply(context, text)
    return
  }


  if (topic.length > 0 && payload !== undefined) {
    publish(topic, payload)
      .then(() => {
        reply(context, 'ok')
      })
      .catch(err => {
        console.error(err)
      })
  }
}
