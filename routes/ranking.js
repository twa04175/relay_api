const express = require('express');
const router = express.Router();

const db = require("../module/dbmodule");

/* /get
* 전체 랭킹 정보를 반환 */
router.get('/get', function(req, res, next) {
    db((err,connection) =>{
        connection.query('select * from relay.ranking limit 10;',(error, rows)=>{
            if(error) throw error;
            console.log('Ranking info is : ', rows);
            res.send(rows);
        });
    })
});

/* /update?chain=70&uid=5
*  랭킹 정보 업데이트 */
router.get('/update', function(req, res, next) {
    let chain = parseInt(req.query.chain);
    let user = parseInt(req.query.uid);
    let query = "select * from relay.ranking where max_combo < "+chain+ " limit 1;";

    db((err,connection) =>{
        connection.query(query,(error, rows)=>{
            if(error) throw error;
            //console.log('ranking Pos info is : ', rows);

            if(rows.length == 0){
                res.send("no ranking");
            }else {
                const rank = rows[0].rank;
                for(let i = 10; i>=rank; i--){
                    //console.log(i," : ",rank);
                    if(rank == i){
                        query = "update relay.ranking\n" +
                            "set\n" +
                            "    ip = (select ip from user_info where uid = ?),\n" +
                            "    nickname = (select nickname from user_info where uid = ?),\n" +
                            "    max_combo = ?\n" +
                            "where `rank` = ?;\n";
                        let value = [user, user, chain, rank];
                        connection.query(query, value, (error, rows) =>{
                            connection.release();
                            res.send("update Rank");
                        });
                    }else {
                        query = "update relay.ranking\n" +
                            "set\n" +
                            "    ip = (select rank_alias.ip from (select ip from relay.ranking where `rank` = ?) rank_alias),\n" +
                            "    nickname =  (select rank_alias.nickname from (select nickname from relay.ranking where `rank` = ?) rank_alias),\n" +
                            "    max_combo =  (select rank_alias.max_combo from (select max_combo from relay.ranking where `rank` = ?) rank_alias)\n" +
                            "where `rank` = ?;";
                        let value = [i-1, i-1, i-1, i];
                        connection.query(query, value, (error, rows) =>{
                            //console.log('sort rank')
                            connection.release();
                        });
                    }
                }
            }
        });
    });
});


module.exports = router;
