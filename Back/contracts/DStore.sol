// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract DStore {

    struct Product {
        uint id;
        string description;
        uint price;
        address payable owner;
        bool available;
        address soldTo;
        bool deleted;
    }

    event Added(Product product);
    event Deleted(Product product);
    event Sold(uint id,address buyer);

    uint startId;
    uint curId;
    Product[] array;
    address public admin;
    uint tollPercent;

    constructor(uint _tollPercent,uint _startId){
        startId=_startId;
        curId = startId;
        admin=msg.sender;
        tollPercent=_tollPercent;
    }

    modifier expectsValidId(uint id){
        
        bool validId=id>=startId && id<startId+array.length;
        require(validId,"VALID ID EXPECTED");
        _;
    }

    modifier expectsAdmin(){
        require(msg.sender==admin,"ONLY ADMIN CAN DO THIS");
        _;
    }

    modifier expectsValidProperties(string memory desc, uint price){
        
        bytes memory descBytes = bytes(desc);
        require(descBytes.length>0,"EMPTY DESCRIPTION NOT ALLOWED");

        require(price>=1 ether && price<=10 ether,"PRICE CAN BE BETWEEN 1 AND 10 ETHERS");
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
        require(count<=1,"MAXIMUM PRODUCTS ALLOWED FROM EACH ADDRESS IS TWO");
        _;
    }

    function getAll() public view returns (Product[] memory) {
        uint actualCount=0;
        for (uint i = 0; i < array.length; i++) {
            if(!array[i].deleted){
                actualCount++;
            }
        }

        Product[] memory col=new Product[](actualCount);
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
    
    function add(string memory desc, uint price) public  
        expectsValidProperties(desc, price)
        checkMaximumAddedFromAddress(){

        Product memory product=Product(curId, desc, price, payable(msg.sender), true,address(0),false);

        array.push(product);

        curId++;

        emit Added(product);
    }

   function getProduct(uint id) private view expectsValidId(id) returns(Product storage) {
       
       Product storage product=array[id-startId];
       return product; 
   }

   function deleteProduct(uint id) public expectsAdmin {
       Product storage product=getProduct(id);
       product.deleted=true;

       emit Deleted(product);
   }

    function buy(uint id) public payable {

        Product storage product=getProduct(id);
        uint price=product.price;
        
        uint ownerGain=price*(100-tollPercent)/100;
        product.owner.transfer(ownerGain);

        //not needed(& doesn't work this way); it's done automatically 
        //uint contractGain=price*tollPercent/100;
        //payable(address(this)).transfer(contractGain);
        
        product.soldTo=msg.sender;
        product.available=false;
    }

}