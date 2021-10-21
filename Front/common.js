var contract;
//const web3 = new Web3("HTTP://127.0.0.1:8545")
const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8545"));

function init() {
    const address = "0x745aE742C7757AD8FBcdc346b4AaF7Dd04Cf3950";
    const abi = [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_tollPercent",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_startId",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "id",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "price",
                  "type": "uint256"
                },
                {
                  "internalType": "address payable",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "internalType": "bool",
                  "name": "sold",
                  "type": "bool"
                },
                {
                  "internalType": "address",
                  "name": "soldTo",
                  "type": "address"
                },
                {
                  "internalType": "bool",
                  "name": "deleted",
                  "type": "bool"
                }
              ],
              "indexed": false,
              "internalType": "struct DStore.Product",
              "name": "product",
              "type": "tuple"
            }
          ],
          "name": "Added",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "id",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "price",
                  "type": "uint256"
                },
                {
                  "internalType": "address payable",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "internalType": "bool",
                  "name": "sold",
                  "type": "bool"
                },
                {
                  "internalType": "address",
                  "name": "soldTo",
                  "type": "address"
                },
                {
                  "internalType": "bool",
                  "name": "deleted",
                  "type": "bool"
                }
              ],
              "indexed": false,
              "internalType": "struct DStore.Product",
              "name": "product",
              "type": "tuple"
            }
          ],
          "name": "Deleted",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "id",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "price",
                  "type": "uint256"
                },
                {
                  "internalType": "address payable",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "internalType": "bool",
                  "name": "sold",
                  "type": "bool"
                },
                {
                  "internalType": "address",
                  "name": "soldTo",
                  "type": "address"
                },
                {
                  "internalType": "bool",
                  "name": "deleted",
                  "type": "bool"
                }
              ],
              "indexed": false,
              "internalType": "struct DStore.Product",
              "name": "product",
              "type": "tuple"
            }
          ],
          "name": "Edited",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "id",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "price",
                  "type": "uint256"
                },
                {
                  "internalType": "address payable",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "internalType": "bool",
                  "name": "sold",
                  "type": "bool"
                },
                {
                  "internalType": "address",
                  "name": "soldTo",
                  "type": "address"
                },
                {
                  "internalType": "bool",
                  "name": "deleted",
                  "type": "bool"
                }
              ],
              "indexed": false,
              "internalType": "struct DStore.Product",
              "name": "product",
              "type": "tuple"
            }
          ],
          "name": "Sold",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "admin",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "getAll",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "id",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "price",
                  "type": "uint256"
                },
                {
                  "internalType": "address payable",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "internalType": "bool",
                  "name": "sold",
                  "type": "bool"
                },
                {
                  "internalType": "address",
                  "name": "soldTo",
                  "type": "address"
                },
                {
                  "internalType": "bool",
                  "name": "deleted",
                  "type": "bool"
                }
              ],
              "internalType": "struct DStore.Product[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "desc",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            }
          ],
          "name": "add",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "desc",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            }
          ],
          "name": "edit",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            }
          ],
          "name": "deleteProduct",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            }
          ],
          "name": "buy",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function",
          "payable": true
        }
      ];

    contract = new web3.eth.Contract(abi, address);
}