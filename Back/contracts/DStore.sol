// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract DStore {

    struct Product {
        uint id;
        string description;
        uint price;
        address payable owner;
        bool sold;
        address soldTo;
        bool deleted;
    }

    event Added(Product product);
    event Deleted(Product product);
    event Sold(Product product);
    event Updated(Product product);

    uint startId;
    uint curId;
    Product[] array;
    address public admin;
    uint tollPercent;

    uint minPrice;
    uint maxPrice;
    
    uint maxAddPerAddress;
    uint maxBuyPerAddress;

    constructor(uint _minPrice,uint _maxPrice,uint _tollPercent,
        uint _maxAddPerAddress,uint _maxBuyPerAddress,uint _startId){
    
        minPrice=_minPrice;
        maxPrice=_maxPrice;
        startId=_startId;
        curId = startId;
        tollPercent=_tollPercent;
        maxAddPerAddress=_maxAddPerAddress;
        maxBuyPerAddress=_maxBuyPerAddress;

        admin=msg.sender;
    }

    modifier expectsValidId(uint id){
        
        bool validId=id>=startId && id<startId+array.length;
        require(validId,"VALID ID EXPECTED");
        _;
    }

    modifier expectsAdmin(){
        require(isAdmin(),"ONLY ADMIN CAN DO THIS");
        _;
    }

    function isAdmin() public view returns (bool) {
        return msg.sender==admin;
    }

    function getAdmin() public view returns (address) {
        return admin;
    }

    modifier expectsValidProperties(string memory desc, uint price){
        
        bytes memory descBytes = bytes(desc);
        require(descBytes.length>0,"EMPTY DESCRIPTION NOT ALLOWED");

        require(price>=minPrice*(1 ether) && price<=maxPrice*(1 ether),
            "PRICE SHOULD BE IN THE RANGE DEFINED");
        _;
    }

    modifier checkMaximumAddedFromAddress(){
        
        uint count=0;
        Product storage p;
        for (uint i = 0; i < array.length; i++) {
            p=array[i];
            if(!p.deleted && p.owner==msg.sender){
                count++;
            }
        }
        require(count<maxAddPerAddress,"CANNOT EXCEED MAXIMUM PRODUCTS PER ADDRESS");
        _;
    }

    modifier checkMaximumBuyingFromAddress(){
        
        uint count=0;
        Product storage p;
        for (uint i = 0; i < array.length; i++) {
            p=array[i];
            if(!p.deleted && p.sold && p.soldTo==msg.sender){
                count++;
            }
        }
        require(count<maxBuyPerAddress,"CANNOT EXCEED MAXIMUM BUYINGS PER ADDRESS");
        _;
    }

    function getAll() public view returns (Product[] memory) {
        uint effectiveCount=0;
        for (uint i = 0; i < array.length; i++) {
            if(!array[i].deleted){
                effectiveCount++;
            }
        }

        Product[] memory col=new Product[](effectiveCount);
        Product memory p;
        uint j=0;
        for (uint i = 0; i < array.length; i++) {
            p=array[i];
            if(!p.deleted){
                col[j]=p;
                j++;
            }
        }
        return col;
    }
    
    function getMyProducts() public view returns (Product[] memory) {
        
        uint count=0;
        for (uint i = 0; i < array.length; i++) {
            if(!array[i].deleted && array[i].owner==msg.sender){
                count++;
            }
        }

        Product[] memory col=new Product[](count);
        Product memory p;
        uint j=0;
        for (uint i = 0; i < array.length; i++) {
            p=array[i];
            if(!p.deleted && p.owner==msg.sender){
                col[j]=p;
                j++;
            }
        }
        return col;
    }

    function add(string memory desc, uint price) public  
        expectsValidProperties(desc, price)
        checkMaximumAddedFromAddress(){

        Product memory p=Product(curId, desc, price, payable(msg.sender), false,address(0),false);

        array.push(p);

        curId++;

        emit Added(p);
    }

    function update(uint id, string memory desc, uint price) public  
        expectsValidProperties(desc, price){

        Product storage p=find(id);

        require(p.owner==msg.sender,"ONLY OWNER OF A PRODUCT CAN UPDATE IT");

        p.description=desc;
        p.price=price;
        
        emit Updated(p);
    }

   function get(uint id) public view expectsValidId(id) returns(Product memory) {
       
       Product memory p=array[id-startId];
       return p; 
   }

   function find(uint id) private view expectsValidId(id) returns(Product storage) {
       
       Product storage p=array[id-startId];
       return p; 
   }

   function deleteProduct(uint id) public expectsAdmin {
       Product storage p=find(id);
       p.deleted=true;

       emit Deleted(p);
   }

   function canDelete() public view returns(bool) {
       return isAdmin();
   }

   function buy(uint id) public payable checkMaximumBuyingFromAddress() {

        Product storage p=find(id);

        require(!p.sold,"CANNOT BUY A SOLD PRODUCT");
        require(p.owner!=msg.sender,"OWNER OF A PRODUCT CANNOT BUY IT");
        require(p.price==msg.value,"INVALID PRICE VALUE SPECIFIED");

        uint price=p.price;

        uint ownerGain=price*(100-tollPercent)/100;

        p.owner.transfer(ownerGain);

        //not needed(& doesn't work this way); it's done automatically 
        //uint contractGain=price*tollPercent/100;
        //payable(address(this)).transfer(contractGain);
        
        p.soldTo=msg.sender;
        p.sold=true;

        emit Sold(p);
    }

   function getContractBalance() public view returns(uint) {
       return address(this).balance;
   }
}