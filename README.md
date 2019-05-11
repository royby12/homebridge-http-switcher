# homebridge-http-switcher

First install the "Switcher Water Heater WebAPI" from:
https://hub.docker.com/r/tomerfi/switcher_webapi

Then add to the config.json:

 ``` 
{
    "accessory": "HttpSwitcher",
    "name": "Boiler",
    "icon": 0,
    "timeout": 3000,
    "statusUrl": "http://localhost:8000",
    "DefaultDuration": "3600"
}
 ``` 
