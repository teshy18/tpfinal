const {sign}= require('jsonwebtoken')

const createAccessToken = userId=>{
    return sign( {userId} , process.env.ACCESS_TOKEN_SECRET, {
        expiresIn:'10m'
    })
}


const createRefreshToken = userId=>{
    return sign( {userId} , process.env.REFRESH_TOKEN_SECRET, {
        expiresIn:'7d'
    })
}

const sendAccessToken = ( req, res ,accessToken ) => {
    res.send({
        email: req.body.email,
        accessToken
    })
} 

const sendRefreshToken = ( res,  refreshToken ) => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, 
        path: '/refresh_token'
    })

}

module.exports = {
    createAccessToken,
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken
}