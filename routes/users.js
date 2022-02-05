const express = require('express');
const router = express.Router();

const db = require("../module/dbmodule");

/* /join?name=유저닉네임&
* 유저의 정보를 저장하고 유저가 입장할 방의 정보를 반환하는 함수 */
router.get('/join', function(req, res, next) {
  const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;

  let query = "select * from relay.room_info where state = 0 limit 1;";
  let value;

  db((err,connection) =>{
    //입장가능한 방의 번호 획득
    connection.query(query,(error, rows)=>{
      if(error) throw error;

      if(rows.length == 0){
        query = "insert into relay.room_info () values ();";
        connection.query(query, (error, rows)=>{
          if(error) throw error;
          query = "select * from relay.room_info where state = 0 limit 1;";
          connection.query(query, (error, rows) => {
            const room_num = rows[0].rid;
            let empty_num;

            let data = rows.map(q => {
              return [q.user_1, q.user_2, q.user_3, q.user_4, q.user_5, q.user_6, q.user_7, q.user_8, q.user_9, q.user_10 ];
            });

            for(let i = 1; i<=data[0].length; i++){
              if(data[0][i-1] === null){
                empty_num = i;
                console.log(i +" is null");
                break;
              }
            }

            query = "insert into user_info(room, ip, nickname, state) value (?, ?, ?, 0);";
            value = [room_num, ip, req.query.name];
            //방 번호를 통한 유저 생성
            connection.query(query, value, (error, rows) =>{
              const uid = rows.insertId;
              //방 정보에 유저 정보 업데이트
              if(empty_num == 10){
                query = "update relay.room_info set user_10 = ?, state = 1 where rid = ?;";
                value = [uid, room_num];
              }else {
                query = "update relay.room_info set user_? = ? where rid = ?;";
                value = [empty_num, uid, room_num];
              }

              console.log(query);
              connection.query(query, value, (error, rows) =>{
                connection.release()
                res.send({
                  rid: room_num,
                  uid: uid,
                });
              });
            });
          });
        });
      }else {
        const room_num = rows[0].rid;
        let empty_num;

        let data = rows.map(q => {
          return [q.user_1, q.user_2, q.user_3, q.user_4, q.user_5, q.user_6, q.user_7, q.user_8, q.user_9, q.user_10 ];
        });

        for(let i = 1; i<=data[0].length; i++){
          if(data[0][i-1] === null){
            empty_num = i;
            console.log(i +" is null");
            break;
          }
        }

        query = "insert into user_info(room, ip, nickname, state) value (?, ?, ?, 0);";
        value = [room_num, ip, req.query.name];
        //방 번호를 통한 유저 생성
        connection.query(query, value, (error, rows) =>{
          const uid = rows.insertId;
          //방 정보에 유저 정보 업데이트
          if(empty_num == 10){
            query = "update relay.room_info set user_10 = ?, state = 1 where rid = ?;";
            value = [uid, room_num];
          }else {
            query = "update relay.room_info set user_? = ? where rid = ?;";
            value = [empty_num, uid, room_num];
          }

          console.log(query);
          connection.query(query, value, (error, rows) =>{
            connection.release()
            res.send({
              rid: room_num,
              uid: uid,
            });
          });
        });
      }
    });
  })
});

module.exports = router;
