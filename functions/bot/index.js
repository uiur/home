var AWS = require('aws-sdk')
var qs = require('querystring')
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

  context.succeed({
    text: 'こんにちは〜'
  })
}
