const ApiError = require("../utils/apiError")


 const sendErrorForDev=(err, res)=>{
    res.status(err.statusCode).json({status:err.status,
        error:err,
        message: err.message,
        stack: err.stack,
        })
 }

 const sendErrorForProd = (err,res)=>{
    res.status(err.statusCode).json({status:err.status,
        error:err,
        message: err.message,
        stack: err.stack,
        })
 }
  const handlejwtinvalidSignature=()=>new ApiError('Invalid token, please login again...',401)
  const handlejwtExpired=()=>new ApiError('Invalid token, please login again...',401)

 const globalError =(err,req,res,next)=>{
    err.statusCode = err.statusCode||500
    err.status= err.status||'error'
    if (process.env.NODE_EVN == 'development'){
        sendErrorForDev(err,res)
    }else{
        if(err.name == 'JsonWebTokenError') err=handlejwtinvalidSignature
        if(err.name == 'TokenExpiredError') err=handlejwtExpired
        sendErrorForProd(err,res)
    }
 }
 module.exports = globalError