const db = require ('../db.js');

//create a product
exports.createProduct = async (req,res0) =>{
    try{
        const {name, categoryId, supplierId, buyingPrice, sellingPrice, quantity, description,  barcode } = req.body
        const image = req.file ? req.file.filename : null;
        const [results] = await db.query("select * from products where barcode =?", [barcode])
        if( results.length >0 ){
             return res.status(409).json({error: "Product already exist"})
        }
        if( buyingPrice >sellingPrice){
            return res.status(400).json({error: "Selling Price must be greater than Buying Price"})
        }
        if ( quantity < 0 ){
             return res.status(400).json({error: "Quantity must be greater than zero"})
        }
        const [sql] = await db.query( "insert into products (name, category_id, supplier_id, buying_price, selling_price, quantity, description, image, barcode) values (?,?,?,?,?,?,?,?,?)",
             [name, categoryId, supplierId, buyingPrice, sellingPrice, quantity, description, image, barcode ])
        return res.status(201).json({success: true, message: "Product Created Successfully"})


    }catch(err){
         return res.status(500).json({error: err.message})
    }
}


//delete a product
exports.deleteProduct = async (req, res) =>{
    try{ 
        const {id} = req.params
        const [results] = await db.query ("select * from products where id =?", [id])
        if( results.length === 0){
            return res.status(404).json({error: "Products Not Found"})
        }
        const [sql] = await db.query("delete from products where id =?", [id])
        return res.status(200).json({success: true, message: "Product deleted successfullu"})
    }catch(err){
        return res.status(500).json({error: err.message})
    }
}

//update a product
exports.updateProduct = async (req,res) =>{
    try{
        const {id} = req.params
        const {name, categoryId, supplierId, buyingPrice, sellingPrice, quantity, description, barcode } = req.body
        const image = req.file ? req.file.filename : results[0].image;
        const [results] = await db.query ("select * from products where id =?", [id])
        const [barcodeResults] = await db.query ("select * from products where barcode =? and id != ?", [barcode, id])
        if( results.length === 0){
            return res.status(404).json({error: "Products Not Found"})
        }
         if (barcodeResults.length > 0){
            return res.status(409).json({error: "Product with this barcode already exist"})
        }
        if( buyingPrice >sellingPrice){
            return res.status(400).json({error: "Selling Price must be greater than Buying Price"})
        }
        if ( quantity < 0 ){
             return res.status(400).json({error: "Quantity must be greater than zero"})
        }
        const [sql] = await db.query("update products set name =?, category_id=?, supplier_id=?, buying_price=?, selling_price=?, quantity=?, description=?, image=?, barcode=? where id=? ",
                        [name, categoryId, supplierId, buyingPrice, sellingPrice, quantity, description, image, barcode, id])
        return res.status(200).json({success: true, message: "Product updated  successfullu"})
        
    } catch(err){
        return res.status(500).json({error: err.message})
    }
}

//view all products
exports.viewAllProduct = async (req, res) =>{
    try{
        const {categoryId, supplierId, startDate, endDate, search} = req.query
        let params = []
        let sql = "select * from products where 1=1 "
        if( categoryId){
            sql += " and category_id =?"
            params.push(categoryId)
        }
        if(supplierId){
            sql += " and supplier_id =?"
            params.push(supplierId)
        }
        if(startDate){
            sql += " and created_at >= ?"
            params.push(startDate)
        }
        if(endDate){
            sql += " and created_at <= ?"
            params.push(endDate)
        }
        if(search){
            sql  += " and (name like ? or barcode like ?)"
            params.push(`%${search}%`,`%${search}%`)
        }
        const [results] = await db.query(sql, params)
        return res.status(200).json({success: true, products: results})


    } catch(err){
        return res.status(500).json({error: err.message})
    }
}

//view one product
exports.viewOneProduct = async(req, res) =>{
    try{
        const {id} = req.params
        const [results] = await db.query ('select * from products where id =?', [id])
        if(results.length === 0){
            return res.status(404).json({error: "Product Not Found"})        
        }
        return res.status(200).json({success: true, product: results[0]})
    }catch(err){
        return res.status(500).json({error: err.message})
    }
}