var jwt = require('jsonwebtoken')

function traVe(req,res,next){
    let token =  req.body.token;
    if(token){
        let verify = jwt.verify(token,"caothaito0");
        res.local = verify
        next();
    }else{
        res.json('ban phai gui ma token')
    }
}



function checkAdmin(req,res,next){
    let token =  req.body.token
    if(token){
        let verify = jwt.verify(token,"caothaito0");
        res.local = verify
        if(verify.type == 1){
            next()
        }else{
            res.json('ban khong co quyen truy cap vao')
        }
    }
}


function checkUser(req,res,next){
    let token =  req.body.token
    if(token){
        let verify = jwt.verify(token,"caothaito0");
        res.local = verify
        if(verify.type == 3){
            next()
        }else{
            res.json('ban khong co quyen truy cap vao')
        }
    }
}




module.exports={traVe,checkAdmin,checkUser}