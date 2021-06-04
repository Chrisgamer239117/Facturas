let mysql=require('../../db/mysql');
let invoice=require('../models/invoice');
module.exports = {
   create:(req,res)=>{
      //{date, total, amount, products[id_product, quantity, cost]}
      console.log(req.body);
      let rfc = req.body.rfc;
      let total=req.body.total;
      let tax=req.body.tax;
      let productos=req.body.detalles;
      let mensaje={};
      mysql.beginTransaction((error)=>{
            if(error){
               res.json(error);
            }
            else{
               mysql.query('insert into invoice (date,payment,tax,customer_rfc) values(?,?,?,?)',['2021/05/11',total,tax,rfc],(err,rows,fields)=>{
                  if(err){
                     mysql.rollback((error)=>{
                           res.json(err);
                        })
                  }else{
                     console.log('Se inserto el ', rows.insertId)
                     /*let values='';
                     for(let i=0;i<productos.length;i++){
                        values +=`(${rows.insertId},${productos[i].id},${productos[i].quantity},${productos[i].cost})`
                        if(i!=productos.length-1)
                           values += ',';
                  }
                  console.log(values);*/
                  productos.forEach(prod=>{
                  mysql.query('insert into invoice_detail (invoice_id, product_id, quantity, cost) values (?,?,?,?)',[rows.insertId,prod.id,prod.quantity,prod.cost],(err,rows,fields)=>{
                     if(err){
                     mysql.rollback((error)=>{
                        res.json(err);
                     })       
                  }else{
                     mensaje={status:'ok',mensaje:'se inserto la factura',folio:rows.insertId}
                     mysql.commit((err)=>{
                        if(err){
                           res.json(err)
                        }else{
                           res.json(mensaje)
                        }
                     })
                  }
               })
            });
         }
      })
   }
})
     /* mysql.query('insert into invoice (date,payment,tax,customer_rfc) values(?,?,?,?)',['2021/05/11',total,tax,rfc],(err,rows,fields)=>{
         if(!err){
            console.log('se inserto el: ',rows.insertId)
            //----------------------------------------------------------------------------------------------------
            let values='';
            for(let i=0;i<productos.length;i++){
               values +=`(${rows.insertId},${productos[i].id},${productos[i].quantity},${productos[i].cost})`
               if(i!=productos.length-1)
                  values += ',';
            }
            ///----------------------------------------------------------------------------------------------------
            productos.forEach(prod=>{
              mysql.query('insert into invoice_detail (invoice_id, product_id, quantity, cost) values (?,?,?,?)'
               [rows.insertId,prod.id,prod.quantity,prod.cost],(err,rows,fields)=>{
                  if(err)
                     res.json(err);
               })
            });
            res.json({status:'ok',mensaje:'se inserto la factura',folio:rows.insertId});
         }
         else
            res.json(err);
      })*/
   
      //console.log(JSON.parse(req.body));
      //JSON.parse(req.body.products).forEach(prod => {
      //res.json({texto:'mensaje'});
      /*mysql.query('insert into order SET ?',req.body,(err,rows,fields)=>{
         if(!err)
            res.json(rows);
         else
            res.json(err);
      })*/
   },
   list:(req,res)=>{
      mysql.query('select * from order',(err,rows,fields)=>{
         if (!err)
            res.json(rows);
         else
            res.json(err);
      })
   },
   find:(req,res)=>{
      mysql.query('select * from order o inner join order_details d on o.id=d.order_id where o.id=?',req.params.id,(err,rows,fields)=>{
         if (!err)
            res.json(rows);
         else
            res.json(err);
      })
   }
}
