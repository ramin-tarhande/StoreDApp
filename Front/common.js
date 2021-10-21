var contract;
//const web3 = new Web3("HTTP://127.0.0.1:8545")
var web3;

//const Web3 = require("web3"); 
async function initJJ() { 
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
  
  await initJJ();
  
  
  //web3 = new Web3("HTTP://127.0.0.1:8545")
  //initMetamask();
  //initContract();
  //ethereum.request({ method: 'eth_requestAccounts' });
  //connect();
}
/*
function initWeb3(){
  try {            
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  } catch (error) {
    alert(error)
  }
}
*/
/*
function connect() {
  console.log('Calling connect()')
  ethereum
  .request({ method: 'eth_requestAccounts' })
  .then(handleAccountsChanged)
  .catch((err) => {
  if (err.code === 4001) {
      // EIP-1193 userRejectedRequest error
      // If this happens, the user rejected the connection request.
      console.log('Please connect to MetaMask.');
      $('#status').html('You refused to connect Metamask')
  } else {
      console.error(err);
  }
  });
}

function handleAccountsChanged(accounts) {

}*/


function initMetamask() {
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    web3 = new Web3(window.ethereum);
    //web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8545"));
    //window.ethereum.enable();
  }
  else {
    //alert("please install your metamask.");
    window.location.replace("http://127.0.0.1:8080/src/metamsk.html");
  }
}

function initContract() {
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

  console.log('before contract');
  contract = new web3.eth.Contract(abi, address);
  console.log('after contract');
}