const DStore = artifacts.require("DStore");
const truffleAssert = require('truffle-assertions'); 
const toBN = web3.utils.toBN;

contract("DStore" , async(accounts)=>{

    let instance;
    let admin;
    let oneEther,tenEthers;
    let threeEthers,fiveEthers;
    let oneWei;

    beforeEach("make instance" , async()=>{
         instance = await DStore.new(10,901);
         admin=accounts[0];
         oneEther=toEther(1);
         tenEthers=toEther(10);
         threeEthers=toEther(3);
         fiveEthers=toEther(5);
         oneWei=web3.utils.toBN(1);
    });

    function toEther(num){
        return toBN(web3.utils.toWei(num.toString(), "ether"));
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

            assert.equal(false , r.sold);
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

                //Act
                await truffleAssert.reverts(
                    instance.add('pen',price)
                );
            });

            it("price=10 ethers" , async()=>{
                //Arange
                
                //Act
                await instance.add('pen',tenEthers);
            });

            it("price>10 ethers" , async()=>{
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
            await instance.deleteProduct(all[0].id, {from: admin});
            
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
            await instance.deleteProduct(all[0].id, {from: admin});
            await instance.deleteProduct(all[2].id, {from: admin});
            
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
            const result=await instance.deleteProduct(all[0].id, {from: admin});

            //Assert
            await truffleAssert.eventEmitted( result , "Deleted");
        });

        it("only admin can delete" , async()=>{

            //Arange
            await instance.add('pen',threeEthers, { from : accounts[1]});

            //Act
            const all = await instance.getAll();
            await truffleAssert.reverts(
                instance.deleteProduct(all[0].id, {from : accounts[1]})
            );
        });

    }); //delete

    describe("buy", async()=>{
        it("update product" , async()=>{

            //Arange
            const price=threeEthers;
            await instance.add('pen',price, { from : accounts[0] });
   
            //Act
            const all1 = await instance.getAll();
            await instance.buy(all1[0].id, { from : accounts[1], value: price});
            
            //Assert
            const all2 = await instance.getAll();
            const r=all2[0];
            assert.equal(true , r.sold);
            assert.equal(false , r.deleted);
            assert.equal(accounts[1] , r.soldTo);
        });

        async function getGasTotal(receipt){
            const gasUsed = receipt.receipt.gasUsed;
            const tx = await web3.eth.getTransaction(receipt.tx);
            const gasPrice = tx.gasPrice;
            const total=toBN(gasPrice*gasUsed);
            return total;
        }

        async function getAccountBalance(account){
            const v=await web3.eth.getBalance(account);
            const bn=toBN(v);
            return bn;
        }

        function logAb(title,x){
            console.log(`${title}:`);
            console.log(`  ${x.initial.toString()} (initial)`);
            console.log(`  ${x.final.toString()} (final)`);
            console.log(`  ${x.diff.toString()} (diff)`);
        }

        it("money transfer" , async()=>{

            //Arange
            const price=threeEthers;
            const owner=accounts[2];
            const buyer=accounts[3];
            await instance.add('pen',price, { from : owner});
            
            let ownerBalance=new Object();
            let buyerBalance=new Object();
            let contractBalance=new Object();

            contractBalance.initial = await getAccountBalance(instance.address);
            ownerBalance.initial = await getAccountBalance(owner);
            buyerBalance.initial = await getAccountBalance(buyer);
            
            //Act
            const all = await instance.getAll();
            const receipt = await instance.buy(all[0].id, { from : buyer, value: price});
                        
            //Assert
            contractBalance.final = await getAccountBalance(instance.address);
            ownerBalance.final = await getAccountBalance(owner);
            buyerBalance.final = await getAccountBalance(buyer);

            contractBalance.diff=contractBalance.final.sub(contractBalance.initial);
            ownerBalance.diff=ownerBalance.final.sub(ownerBalance.initial);
            buyerBalance.diff=buyerBalance.initial.sub(buyerBalance.final);
            
            //logAb('ownerBalance',ownerBalance);
            //logAb('buyerBalance',buyerBalance);
            //logAb('contractBalance',contractBalance);
   
            const gasTotal=await getGasTotal(receipt);

            const ownerGain=price.muln(9).divn(10);
            const contractGain=price.muln(1).divn(10);
            const buyerPay=price.add(gasTotal);

            assert.equal(contractGain.toString(),contractBalance.diff.toString(),'contract diff');
            assert.equal(ownerGain.toString(),ownerBalance.diff.toString(),'owner diff');
            assert.equal(buyerPay.toString(),buyerBalance.diff.toString(),'buyer diff');
        });
   
        it("product owner cannot buy it" , async()=>{

            //Arange
            const price=threeEthers;
            await instance.add('pen',price,{ from : accounts[1] });
   
            //Act
            const all = await instance.getAll();
            await truffleAssert.reverts(
                instance.buy(all[0].id, { from : accounts[1], value: price})
            );

        });

        it("invalid price value" , async()=>{

            //Arange
            await instance.add('pen',threeEthers,{ from : accounts[0] });
   
            //Act
            const all = await instance.getAll();
            await truffleAssert.reverts(
                instance.buy(all[0].id, { from : accounts[1], value: fiveEthers})
            );

        });
     
        it("maximum buying from each address" , async()=>{

            //Arange
            await instance.add('pen',threeEthers, {from : accounts[0]});
            await instance.add('ruler',fiveEthers, {from : accounts[0]});
            await instance.add('whiteboard',tenEthers, {from : accounts[1]});
   
            //Act
            const all = await instance.getAll();
            const buyer=accounts[2];
            await instance.buy(all[0].id, {from : buyer, value: threeEthers});
            await instance.buy(all[1].id, {from : buyer, value: fiveEthers});

            await truffleAssert.reverts(
                instance.buy(all[2].id, {from : buyer, value: tenEthers})
            );

        });

        it("cannot buy sold product" , async()=>{

            //Arange
            const price=threeEthers;
            await instance.add('pen',price, { from : accounts[0] });
   
            //Act
            const all = await instance.getAll();
            await instance.buy(all[0].id, { from : accounts[1], value: price});
            await truffleAssert.reverts(
                instance.buy(all[0].id, { from : accounts[1], value: price})
            );

        });

        it("event" , async()=>{

            //Arange
            const price=threeEthers;
            await instance.add('pen',price, {from : accounts[0]});
   
            //Act
            const all = await instance.getAll();
            const result= await instance.buy(all[0].id, { from : accounts[1], value: price});
   
            //Assert
            await truffleAssert.eventEmitted( result , "Sold");
        });

    }); //buy

    describe("edit", async()=>{
        
        it("basic" , async()=>{
            //Arange
            await instance.add('pen',threeEthers);
   
            //Act
            const all1 = await instance.getAll();
            await instance.edit(all1[0].id, 'pencil',fiveEthers);
            
            //Assert
            const all2 = await instance.getAll();
            const r=all2[0];
            assert.equal('pencil' , r.description);
            assert.equal(fiveEthers , r.price);
        });

        it("validation" , async()=>{
            //Arange
            await instance.add('pen',threeEthers);

            //Act
            const all1 = await instance.getAll();

            await truffleAssert.reverts(
                instance.edit(all1[0].id, '',fiveEthers)
            );
        });

        it("event" , async()=>{
            //Arange
            await instance.add('pen',threeEthers);
   
            //Act
            const all = await instance.getAll();
            const result= await instance.edit(all[0].id, 'pencil',fiveEthers);
            
            //Assert
            await truffleAssert.eventEmitted( result , "Edited");
        });

        it("only owner can edit" , async()=>{
            //Arange
            await instance.add('pen',threeEthers, {from : accounts[1]});
   
            //Act
            const all = await instance.getAll();
            await truffleAssert.reverts(
                instance.edit(all[0].id, 'pencil',fiveEthers, {from : accounts[2]})
            );
        });
    }); //edit

}) 