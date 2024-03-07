## Setup Environment

1. Install Node.js from the internet
2. Install all node modules by running the `npm install` command in the `Comms-js` directory
3. Create a `.env` file in the `Comms-js` directory
4. Add the following firebase api key details, company name and login credentials for the company of choice:
    - APIKEY
    - AUTHDOMAIN
    - DATABASEURL
    - PROJECTID
    - STORAGEBUCKET
    - MESSAGINGSENDERID
    - APPID
    - EMAIL
    - PASSWORD
    - CID

## Run in background (Windows only)
1. Execute all instruction in the `Setup Environment`
2. Add the receiver and sender service as Windows services by running the `node startup.js` command in the `Comms-js` directory
3. Open up `Services` in Windows and check if the `Tromatic Next Receiver` and `Tromatic Next Sender` are running correctly
4. For both of the services press the left mouse button and go to properties, set startup type to `Automatic (Delayed Start)`