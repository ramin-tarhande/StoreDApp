var contract;
var web3;

async function initMetamask() { 
    if (window.ethereum) {
  
      console.log('create web3');
      web3 = new Web3(window.ethereum); 
      console.log('web3 created');
      console.log('request accounts');
      //await window.ethereum.request('eth_requestAccounts'); 
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      //const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      //console.log('request done');
      var accounts = await web3.eth.getAccounts();
      console.log(accounts);
    } 
    else{

    }
  }

async function init() {
  
  await initMetamask();

  initContract();

  const canDelete = await contract.methods.canDelete().call();
  console.log('canDelete :>> ', canDelete);

  const contractBalance = await contract.methods.getContractBalance().call();
  console.log('contractBalance :>> ', contractBalance);

  const isAdmin = await contract.methods.isAdmin().call();
  console.log('isAdmin :>> ', isAdmin);

  const admin = await contract.methods.getAdmin().call();
  console.log('admin :>> ', admin);
}

function initContract() {
  const address = "0x19eF01795f42f4d313E6851e60268a6987A7F859";
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
      "name": "isAdmin",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getAdmin",
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
      "inputs": [],
      "name": "getMyProducts",
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
      "inputs": [],
      "name": "canDelete",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
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
    },
    {
      "inputs": [],
      "name": "getContractBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];

  console.log('connect to contract');
  contract = new web3.eth.Contract(abi, address);
  console.log(contract);
}