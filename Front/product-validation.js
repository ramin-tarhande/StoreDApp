function validate(description,price,error) {

    if(description==="")
    {
        error.html(`invalid description`);
        return false;
    }

    if(!Number(price))
    {
        //console.log('price :>> ', price);
        error.html(`invalid price`);
        return false;
    }
    return true;
}

function showFailureHelp(error,add) {
    const extra=add?'<li>maximum number of products per accounts is not exceeded</li>':'';
    error.html(`<small>
    operation failed. check that:
    <ul>
    <li>price is in allowed range</li>
    ${extra}
    </ul>
    </small>`);
}

