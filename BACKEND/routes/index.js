var express = require('express');
var router = express.Router();
var path = require("path");
var XLSX = require('xlsx');

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

module.exports = router;
