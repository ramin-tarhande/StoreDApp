const DStore = artifacts.require("DStore");
const truffleAssert = require('truffle-assertions'); 

contract("DStore" , async(accounts)=>{

    let instance;
    let admin;
    let oneEther,tenEthers;
    let threeEthers,fiveEthers;
    let oneWei;
    beforeEach("make instance" , async()=>{
         instance = await DStore.new(901);
         admin=accounts[0];
         oneEther=toEther(1);
         tenEthers=toEther(10);
         threeEthers=toEther(3);
         fiveEthers=toEther(5);
         oneWei=web3.utils.toBN(1);
    });

    function toEther(num){
        return web3.utils.toBN(web3.utils.toWei(num.toString(), "ether"));
    }

    describe("add product", async()=>{
        it("add one" , async()=>{

            //Arange
            
            //Act
            const addResult=await instance.add('pen',threeEthers, { from : accounts[1]});
            const getResult = await instance.getAll();

            //Assert
            assert.equal(1 , getResult.length);
            const r=getResult[0];
            assert.equal('pen' , r.description);
            assert.equal(threeEthers , r.price);
            assert.equal(accounts[1] , r.owner);

            assert.equal(true , r.available);
            assert.equal(false , r.deleted);
            //console.log("id="+r.id);
            // console.log(await instance.admin());
            // console.log(accounts[0]);
            // console.log(admin);
        });

        it("event" , async()=>{

            //Arange
            
            //Act
            const addResult=await instance.add('pen',threeEthers);

            //Assert
            await truffleAssert.eventEmitted( addResult , "Added");
        });

        it("add two" , async()=>{

            //Arange
            
            //Act
            await instance.add('pen',threeEthers, { from : accounts[1]});
            await instance.add('notebook',fiveEthers, { from : accounts[2]});
            const getResult = await instance.getAll();

            //Assert
            assert.equal(2 , getResult.length);
            
            let r=getResult[0];
            assert.equal('pen' , r.description);
            assert.equal(threeEthers , r.price);
            assert.equal(accounts[1] , r.owner);
            
            let s=getResult[1];
            assert.equal('notebook' , s.description);
            assert.equal(fiveEthers , s.price);
            assert.equal(accounts[2] , s.owner);

            assert.ok(r.id!=s.id);
        });

        describe("validations", async()=>{
            it("empty description" , async()=>{
                //Arange
        
                //Act
                await truffleAssert.reverts(
                    instance.add('',threeEthers)
                );
            });

            it("price=1 ether" , async()=>{
                //Arange

                //Act
                await instance.add('pen',oneEther);
            });

            it("price<1 ether" , async()=>{
                //Arange
                const price = oneEther.sub(oneWei);
                // console.log(oneEther.toString()); console.log(oneWei.toString()); console.log(price.toString());

                //var u=await instance.checkAdd('pen',price);
                //console.log("u:"+u);
                //console.log(u);

                //Act
                await truffleAssert.reverts(
                    instance.add('pen',price)
                );
            });

            it("price=10 ether" , async()=>{
                //Arange
                
                //Act
                await instance.add('pen',tenEthers);
            });

            it("price>10 ether" , async()=>{
                //Arange
                const price = tenEthers.add(oneWei);
                
                //Act
                await truffleAssert.reverts(
                    instance.add('pen',price)
                );
            });

        }); //validation   

        it("maximum from each address is two" , async()=>{

            await instance.add('pen',threeEthers, { from : accounts[1]});
            await instance.add('notebook',fiveEthers, { from : accounts[1]});
            await truffleAssert.reverts(
                instance.add('whiteboard',fiveEthers, { from : accounts[1]})
            );
        });

    }); //add

    describe("delete product", async()=>{
        it("delete one" , async()=>{

            //Arange
            await instance.add('pen',threeEthers);
            await instance.add('ruler',fiveEthers);

            //Act
            const all = await instance.getAll();
            await instance.deleteProduct(all[0].id, { from : accounts[0]});
            
            //Assert
            const remaining = await instance.getAll();
            assert.equal(1 , remaining.length);
            const r=remaining[0];
            assert.equal('ruler' , r.description);
            assert.equal(fiveEthers , r.price);
        });

        it("delete two" , async()=>{

            //Arange
            await instance.add('pen',threeEthers, { from : accounts[1]});
            await instance.add('ruler',fiveEthers, { from : accounts[1]});
            await instance.add('book',threeEthers, { from : accounts[2]});
            await instance.add('whiteboard',fiveEthers, { from : accounts[2]});


            //Act
            const all = await instance.getAll();
            await instance.deleteProduct(all[0].id, { from : accounts[0]});
            await instance.deleteProduct(all[2].id, { from : accounts[0]});
            
            //Assert
            const remaining = await instance.getAll();
            assert.equal(2 , remaining.length);
            const r=remaining[0];
            assert.equal('ruler' , r.description);
            assert.equal(fiveEthers , r.price);
            const s=remaining[1];
            assert.equal('whiteboard' , s.description);
            assert.equal(fiveEthers , s.price);
        });

        it("event" , async()=>{

            //Arange
            await instance.add('pen',threeEthers);
            
            //Act
            const all = await instance.getAll();
            const result=await instance.deleteProduct(all[0].id, { from : accounts[0]});

            //Assert
            await truffleAssert.eventEmitted( result , "Deleted");
        });

        it("only admin can delete" , async()=>{

            //Arange
            await instance.add('pen',threeEthers, { from : accounts[1]});

            //Act
            const all = await instance.getAll();
            await truffleAssert.reverts(
                instance.deleteProduct(all[0].id, { from : accounts[1]})
            );
        });

    }); //delete


    describe.only("buy", async()=>{
        it("update product" , async()=>{

            //Arange
            await instance.add('pen',threeEthers);
   
            //Act
            const all1 = await instance.getAll();
            await instance.buy(all1[0].id, { from : accounts[1]});
            
            //Assert
            const all2 = await instance.getAll();
            const r=all2[0];
            assert.equal(false , r.available);
            assert.equal(false , r.deleted);
            assert.equal(accounts[1] , r.soldTo);
        });

        it("transfer money" , async()=>{

            //Arange
            const price=threeEthers;
            const owner=accounts[1];
            const buyer=accounts[2];
            await instance.add('pen',price, { from : owner});
            
            const ownerBalBefore = await web3.eth.getBalance(owner);
            const buyerBalBefore = await web3.eth.getBalance(buyer);
   
            //Act
            const all = await instance.getAll();
            const receipt = await instance.buy(all[0].id, { from : buyer, value: price});
            const gasUsed = receipt.receipt.gasUsed;
            console.log(`GasUsed: ${gasUsed}`);
            
            //Assert
            const ownerBalAfter = await web3.eth.getBalance(owner);
            const buyerBalAfter = await web3.eth.getBalance(buyer);
   
            console.log(`price: ${price}`);
            const diffOwner=ownerBalAfter-ownerBalBefore;
            const diffBuyer=buyerBalBefore-buyerBalAfter;
            //console.log(`owner: ${ownerBalBefore}->${ownerBalAfter}`);
            console.log(`diffOwner: ${diffOwner}`);
            console.log(`diffBuyer: ${diffBuyer}`);

            assert.equal(price,diffOwner);
            assert.equal(price+gasUsed,diffBuyer);
        });
        
    }); //buy
}) 