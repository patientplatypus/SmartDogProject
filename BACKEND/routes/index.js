var express = require('express');
var app = express();
var router = express.Router();
var path = require("path");
var XLSX = require('xlsx');
var oracledb = require('oracledb');


var oracledb = require('oracledb');

var connAttrs = {
    "user":"sdsoci",
    "password":"Divcomp1!",
    "connectString":"129.146.0.159/apexdev"
}

router.get('/oracledb', function (req, res) {
   "use strict";
   oracledb.getConnection(connAttrs, function (err, connection) {
    if (err) {
       // Error connecting to DB
       res.set('Content-Type', 'application/json');
       res.status(500).send(JSON.stringify({
           status: 500,
           message: "Error connecting to DB",
           detailed_message: err.message
       }))
    }
    else{
      console.log('Successfully connected to Oracle Database');
      connection.execute(
        `SELECT * FROM REQ_IN_WAIT`,
        function(err, result){
          if (err){console.log("THERE WAS AN ERROR CONNECTING TO ORACLEDB")}
          // var jsonRet = JSON.parse(result.rows)
          console.log(result.rows)
        }
      )
    }
  })
});

/* GET home page. */

// https://stackoverflow.com/questions/30859901/parse-xlsx-with-node-and-create-json
// how to conver the worksheets to excel taken from above (must import xlsx package)
// xlsx directory found here: https://www.npmjs.com/package/xlsx
function GetDataHelper(path){
    var workbook = XLSX.readFile(path);
    console.log('value of workbook: ', workbook);
    var sheet_name_list = workbook.SheetNames;
    var dataToReturn = [];
    sheet_name_list.forEach(function(y) {
        var worksheet = workbook.Sheets[y];
        var headers = {};
        var data = [];
        for(z in worksheet) {
            if(z[0] === '!') continue;
            //parse out the column, row, and value
            var col = z.substring(0,1);
            var row = parseInt(z.substring(1));
            var value = worksheet[z].v;

            //store header names
            if(row == 1) {
                headers[col] = value;
                continue;
            }

            if(!data[row]) data[row]={};
            data[row][headers[col]] = value;
        }
        //drop those first two rows which are empty
        data.shift();
        data.shift();
        // console.log(data);
        dataToReturn.push(data)
    })
    return dataToReturn
}



router.post('/workbook', function(req, res, next) {
  console.log('inside workbook route');
  console.log('value of req.Body.workbookName', req.body.workbookName);

  var absolutepath = path.resolve(__dirname) + "/data/" + req.body.workbookName + ".xlsx";
  // console.log('absolutepath: ', absolutepath);

  var returndata = GetDataHelper(absolutepath)
  // console.log('value of returndata; ', returndata);
  res.status("200").send(returndata)
});



router.get('/requisition', function (req, res, next) {
   "use strict";

        var connAttrs = {
            "user":"sdsoci",
            "password":"Divcomp1!",
            "connectString":"129.146.0.159/apexdev"
        }
   oracledb.getConnection(connAttrs, function (err, connection) {
           console.log("ORACLE DB 500");
           console.log("ERROR: "+ err);
       if (err) {
           // Error connecting to DB
           res.set('Content-Type', 'application/json');
           res.status(500).send(JSON.stringify({
               status: 500,
               message: "Error connecting to DB",
               detailed_message: err.message
           }))
        }
        else{
          console.log('Successfully connected to Oracle Database');
          connection.execute(
            `SELECT *
             FROM REQ_IN_WAIT`,
            function(err, result)
            {
              if (err) { console.error(err.message); return; }
              console.log(result.rows);  // print all returned rows
              res.status("200").send(result.rows);
            }
          );
        }
    })
});

// router.get('/requisition', function(req, res, next) {
//     console.log("requisition route called on backend");
//     res.status("200").send("hi");
// });

module.exports = router;
