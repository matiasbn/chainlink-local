# Chainlink local environment
## Dependencies:
- Docker
- Ganache UI
- Truffle
## Steps
### Run the local network:
- Run ganache with the next config:
  - Server:
    ![image](https://user-images.githubusercontent.com/25488802/101961352-5043bc80-3be8-11eb-9124-88a83e5b6bf2.png)
  - Accounts & Keys: You can use this=> ```metal shop business roast tail cram gather soft unfold enable rifle belt```. Remember to use the same mnemonic when executing the tests on the main contracts.
    ![image](https://user-images.githubusercontent.com/25488802/101961452-82edb500-3be8-11eb-9de2-5930aada2ddf.png)

### Deploy the contracts:
- Install the dependencies ```npm i```
- Deploy or re deploy the Chainlink Oracle contract and the LINK Token contract, by using ```npm run deploy```or ```npm run deploy:reset```accordingly.
- Save the contracts addresses:
  
  ![image](https://user-images.githubusercontent.com/25488802/101962291-900ba380-3bea-11eb-927f-6e6a946866e7.png)

### Run the Chainlink Node:
- Create a PostgreSQL instance by running ```docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=chainlink -d -p 5432:5432 postgres```
- Change directory: ```cd ./chainlink_node_config```
- Change the chainlink-env file:
  - On the ETH_URL line, change 192.168.0.5 for your ip:
    - MAC: ```ipconfig getifaddr en0```
    - Linux: TODO
  - On the DATABASE_URL line, change 172.17.0.2 for your PostgreSQL database ip:
    - ```docker inspect --format '{{ .NetworkSettings.IPAddress }} postgres```
  - On the LINK_CONTRACT_ADDRESS, change the address for the one of your deployed LINK Token contract.
- Run ```sh start.sh```:
  - It is going to ask for a password. Choose one and then repeat it.
  - Later, is going to ask for an email. Choose any email (not necessarily real) and create a password too.
- Now the node is running. Run go to ```http://localhost:6688/``` to check the control dashboard. Enter the email and the password you entered before: 

![image](https://user-images.githubusercontent.com/25488802/101963364-48d2e200-3bed-11eb-8465-faa67abac055.png)

### Suscribe your node to the Oracle 
- Go to this [remix gist](https://remix.ethereum.org/#gist=03a079b9055f42d993d0066d6f454c6f&optimize=true&version=soljson-v0.4.24+commit.e67f0147.js&runs=200&evmVersion=null).
- Go to: 

   ![image](https://user-images.githubusercontent.com/25488802/101963569-ca2a7480-3bed-11eb-9d44-967c729c61da.png)

- Compile the contract:
  ![image](https://user-images.githubusercontent.com/25488802/101963659-0362e480-3bee-11eb-99c9-4ba64ad057a3.png)

- Interact with the contract: you can choose Injected Web3 environment and use Metamask. Remember to use the same mnemonic for every transaction, because is the one with funds and LINKs tokens.
  - Choose the "At Address" option. Paste the address of your deployed Oracle contract: ![image](https://user-images.githubusercontent.com/25488802/101963812-6f454d00-3bee-11eb-8654-1d599389d323.png)
  - Open the contract, and call the setFullfillmentPermission function:
  ![image](https://user-images.githubusercontent.com/25488802/101963869-9dc32800-3bee-11eb-8357-5b93d2cb0eee.png)
  - Use with the next parameters:
    - _node: Your node address. It is in the dashboard/configuration/ACCOUNT_ADDRESS: ![image](https://user-images.githubusercontent.com/25488802/101964091-f397d000-3bee-11eb-8842-be219b36974d.png)

    - _allowed: true, to let the node fullfil requirements.

### Fund your node with Ether:
 Simply send some ether to the previous address. You can use Metamask to do this. IT IS IMPORTANT. If the node is not funded, then it can't do transactions and fullfil the requests.
 
### Create the HTTP Get task:
- Copy the JSON inside the ```httpget.json``` file on the root of this repository.
- Go to the Chainlink dashboard at ```http://localhost:6688/```.
- Go to Jobs/New Job and paste the JSON.
- Change the ```CHAINLINK_ORACLE_CONTRACT_ADDRESS``` value for the address of your local Oracle.
- Save the Job

### Run the tests on stacktical-dsla-contracts
- Remember to use the same mnemonic every time you interact with the Oracle. This is with the .env file and the ```TEST_MNEMONIC``` field.
- Copy the necessary values to the environments.config.js file accordingly e.g. the JobID that you just created goes on the ```chainlinkJobId```field on the 'local' env.
- Run ```npm run test``` to test locally.
- Verify the interactions e.g. Ganache UI, Chainlink Dashboard:

![image](https://user-images.githubusercontent.com/25488802/101964773-45d9f080-3bf1-11eb-8753-0d41fddd15f1.png)

