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
    event Edited(Product product);

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

    modifier checkMaximumBuyingFromAddress(){
        
        uint count=0;
        Product storage p;
        for (uint i = 0; i < array.length; i++) {
            p=array[i];
            if(!p.deleted && p.sold && p.soldTo==msg.sender){
                count++;
            }
        }
        require(count<=1,"MAXIMUM BUYING FROM EACH ADDRESS IS TWO");
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

        Product memory p=Product(curId, desc, price, payable(msg.sender), false,address(0),false);

        array.push(p);

        curId++;

        emit Added(p);
    }

    function edit(uint id, string memory desc, uint price) public  
        expectsValidProperties(desc, price){

        Product storage p=getProduct(id);

        require(p.owner==msg.sender,"ONLY OWNER OF A PRODUCT CAN EDIT IT");

        p.description=desc;
        p.price=price;
        
        emit Edited(p);
    }


   function getProduct(uint id) private view expectsValidId(id) returns(Product storage) {
       
       Product storage p=array[id-startId];
       return p; 
   }

   function deleteProduct(uint id) public expectsAdmin {
       Product storage p=getProduct(id);
       p.deleted=true;

       emit Deleted(p);
   }

    function buy(uint id) public payable checkMaximumBuyingFromAddress() {

        Product storage p=getProduct(id);

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

}