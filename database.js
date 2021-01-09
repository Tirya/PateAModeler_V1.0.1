// var mysql = require('mysql');
// module.exports = {
//     createConnection(){
//         con = mysql.createConnection({
//             host: "localhost:3300"
//         })
//         if (err) throw err;

//         console.log("Connected!");
//         con.query("CREATE DATABASE if not exists dbDiscord", (err, result) => {
//             if(err) throw err;
//             con.query("USE dbDiscord")
//             console.log("Data base connected");
//         })
//     }
    
// }

    // var con = mysql.createConnection({
    //     host: "localhost:3300"

    // })
    // con.connect(function(err) {
    //     if(err) { throw err; }
    //     console.log("Connected!");
    //     con.query("CREATE DATABASE if not exists dbDiscord", (err, result) => {
    //         if(err) throw err;
    //         con.query("USE dbDiscord")
    //         console.log("Data base connected");
    //     });
    //   });

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "127.0.0.1:3300",
  user: "yourusername",
  password: "yourpassword"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE dbtest", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});