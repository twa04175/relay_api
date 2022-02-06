var express = require('express');
var router = express.Router();
const db = require("../module/dbmodule");

/* GET RoomInfo page. */
router.get('/get', function(req, res, next) {
    let query = "select * from relay.room_info where rid = ?;";
    const rid = [req.query.rid];

    db((err,connection) =>{
        connection.query(query,rid,(error, rows)=>{
            if(error) throw error;
            res.send(rows);
        });
    })
});


module.exports = router;
