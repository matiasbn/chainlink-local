# Chainlink local environment
## Dependencies:
- Docker (docker-compose)
## Initial deployment
- Install the packages ```npm i```
- Run ```npm run deploy:local-chainlink```: 

    This script will clean the room for a new deployment, erasing the ganache, postgresql and chainlink directories and files created on run time.
     
    Thien it will deploy the contracts, and run a script to fund the Chainlink node and allow it to fullfill requirements. 
    
    The script is in ```scripts/prepare-node.js```.  

- Create the Job:

    Once the above script finishes, your Chainlink node would be ready to use.
    
    Go to ```http://localhost:6688/``` and use the credentials described at ```chainlink/.api``` file to login.

    Go to Jobs tab and copy/paste the ```httpget.json``` content into it.
    
    Don't forget to copy the Job id into the ```environments.config.js``` file in the ```stacktical-dsla-contracts``` repository, in the ```local.chainlinkJobId``` field.
    
- That's it!:

    Now go and hack some cool stuff using your local Chainlink env :).

## Run last configuration.

If you stopped your last configuration (by using ctrl+c or ```docker-compose down```), is not necessary to redeploy everything. 
You just have to run ```npm run run:local-chainlink``` and everything would be where you left it.

## Considerations:
### Mnemonic:
The mnemonic used for the deployment is present on the .env file, which value is ```TEST_MNEMONIC=myth like bonus scare over problem client lizard pioneer submit female collect```.

Use it when running the tests too, since this mnemonic controls the LINK supply and it has the funded accounts.
### Contracts addresses

All this development is based on the idea that the Chainlink's Oracle and Token contracts are deployed once, since the addresses
are hardcoded everywhere. This is to avoid unnecessary scripting to recover the addresses in here and in the ```stacktical-dsla-contracts``` repository.
Do not try to redeploy the contracts if something happens (you run out of LINK, for example, which is unlikely). In that case, simply re deploy everything
