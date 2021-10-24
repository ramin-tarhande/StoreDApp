async function initBuy(tableBody,balanceFd){
    await initCommon(balanceFd);

    await showItems(tableBody);

    subscribeForEvents(()=>showItems(tableBody));
}

async function showItems(tableBody) {
    const account=await getAccount();
    const products = await contract.methods.getAll().call({ from: account });

    //console.log(products);

    var html='';
    for(let i=0;i<products.length;i++){
        let p=products[i];
        
        //console.log(x);
        const ether = web3.utils.fromWei(p.price, 'ether');
        const lastCell=createLastCell(account,p);
        html+= `
            <tr> 
            <td>${p.description}</td>
            <td>${ether}</td>
            <td><small>${p.owner}<small></td>
            <td>${p.id}</td>
            <td>${lastCell}</td>
            </tr>
            `;

        
    }

    tableBody.html(html);
}
function createLastCell(account,p){
    if(account==p.owner){
        return '<label class="text-muted">mine</label>';
    }
    else if(p.sold){
        return '<label class="text-danger">sold</label>';
    }
    else{
        return `<button type="button" class="btn btn-success" onclick="buy(${p.id})">Buy</button>`
    }
}

function buy(id){
    
    window.location.href = `./buy-product.html?id=${id}`;
};
