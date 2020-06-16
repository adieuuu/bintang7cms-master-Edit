const router = require('express').Router();
import axios from 'axios'
const API_URL = process.env.API_URL
router.post("/:payload", (req, res) => {
    try {
        let payload = jwt.verify(req.params.payload, process.env.GATEWAY_SECRET);
        if(payload.method == 'post') {
            axios.post(API_URL+"/oauth/token", payload.data)
            .then(success => {
                res.status(200).json({code: 200, success: true})
            })
            .catch(reject => {
                res.status(200).json({code: 404, reject})
            })
            
        } else {
            res.status(200).json({code: 404, message: "Invalid method"})
        }
    } catch (error) {
        res.status(200).json({code: 404, message: "Invalid payload"})
    }
    
})


module.exports = router;