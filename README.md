# homebridge-http-switcher

First install the "Switcher Water Heater WebAPI" from:
https://hub.docker.com/r/tomerfi/switcher_webapi

Then add to the config.json:

 ``` 
{
    "accessory": "HttpSwitcher",
    "name": "Boiler",
    "icon": 0,                                      //Optional, default is 0 --> Faucet Icon
    "timeout": 3000,                                //Optional, default is 5000 ms
    "statusUrl": "http://[YOUR DOCKER IP]:8000",
    "DefaultDuration": "3600"                       //Optional, default is 3600 second 
}
 ``` 
