let InvProducts=[];
let products= new Map();
let total=0;
//---------------------------------------------------------------------------------------------
const btnGetProducts=document.getElementById('btnGetProducts');

btnGetProducts.addEventListener('click',()=>{
    products.clear();
    fetch('http://localhost:1339/api/product')
    .then(res => res.json())
    .catch(error => console.log(error))
    .then(json => {
        let cadena='';
        json.forEach(producto=>{
            cadena+=`<option value="${producto.id}">${producto.name} $${producto.cost}</option>`;
            products.set(producto.id, producto);
        })
        document.getElementById('mnuproducts').innerHTML = cadena; 
    })
});
//---------------------------------------------------------------------------------------------
const btnadd=document.getElementById('btnadd');

btnadd.addEventListener('click',()=>{
    let name, quantity, cost;
    name=document.getElementById('txtname').value;
    quantity=document.getElementById('txtquantity').value;
    cost=document.getElementById('txtcost').value;

    var data={name:name, quantity:quantity,     cost:cost};
    fetch('http://localhost:1339/api/product',{
        method:'POST',
        body:JSON.stringify(data),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res => res.json())
    .catch(error => console.log(error))
    .then(json => console.log(json))
});      
//---------------------------------------------------------------------------------------------
const btnAdd2Invoice=document.getElementById('btnAdd2Invoice');

btnAdd2Invoice.addEventListener('click',()=>{
    let menu = document.getElementById('mnuproducts').value;
    let quantity = document.getElementById('txtinvquantity').value;
    let costo = products.get(parseInt(menu)).cost;
    //console.log(menu,quantity,costo);
    total += costo*quantity
    let record={id:menu, quantity:quantity,cost:costo}
    InvProducts.push(record);
    document.getElementById('detalleFactura').innerHTML += 
    `<p>${record.id} ${record.quantity} ${record.cost}</p>`;
});

//---------------------------------------------------------------------------------------------
const btnSaveInvoice=document.getElementById('btnSaveInvoice');

btnSaveInvoice.addEventListener('click',()=>{
    let rfc=document.getElementById('txtRFC').value;
    let data={rfc:rfc, total:total, tax:total*0.16, detalles:InvProducts}
    console.log(data);
    fetch('http://localhost:1339/api/invoice',{
        method:'POST',
        body:JSON.stringify(data),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res => res.json())
    .catch(error => console.log(error))
    .then(json => console.log(json))
});
 