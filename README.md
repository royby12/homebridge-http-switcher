# homebridge-http-switcher

#### Homebridge plugin to control Switcher V2 via REST APIs.

## Installation

1. Install [homebridge](https://github.com/nfarina/homebridge#installation-details).

2. Install the "[Switcher Water Heater WebAPI](https://hub.docker.com/r/tomerfi/switcher_webap)" from:

3. Install the Plugin
 ```
sudo npm install -g git+https://github.com/royby12/homebridge-http-switcher.git
 ```

## Configuration Examples

#### Simple configuration (minimal):

 ```json 
{
    "accessory": "HttpSwitcher",
    "name": "Boiler",
    "statusUrl": "http://[YOUR DOCKER IP]:8000",
}
 ``` 
#### Advanced configuration:

 ```json 
{
    "accessory": "HttpSwitcher",
    "name": "Boiler",
    "icon": 0,                                      //Optional, default is 0 --> Faucet Icon
    "timeout": 3000,                                //Optional, default is 5000 ms
    "statusUrl": "http://[YOUR DOCKER IP]:8000",
    "DefaultDuration": "3600"                       //Optional, default is 3600 second 
}
 ``` 
