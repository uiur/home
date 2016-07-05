# home
Code for raspberry pi at home

## IR remote controller
Turn on/off an air controller using [irMagician](http://www.omiya-giken.com/?page_id=837).
```sh
python ir/play.py ir/data/aircon-on.json
python ir/play.py ir/data/aircon-off.json
```

## Deploy
```sh
crontab crontab
supervisorctl restart server
```

## Dependencies
* https://github.com/adafruit/Adafruit_Python_GPIO
* https://github.com/uiureo/tsl2561
* [apex](https://github.com/apex/apex) for AWS Lambda functions
