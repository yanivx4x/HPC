var http = require('http')
var url = "http://www.hoops.co.il/?p=";

for (var i=0;i<10;i++){
var options = {
    "method": "GET",
    "hostname": "www.hoops.co.il",
    "port": null,
    "path": "/?p=" + i.toString()
  };
  
  var req = http.request(options, function (res) {
    var chunks = [];
  
    res.on("data", function (chunk) {
      chunks.push(chunk);
    });
  
    res.on("end", function () {
      var body = Buffer.concat(chunks);
      var tt = body.toString().indexOf("שגיאה 404 - העמוד אינו קיים!");
      console.log(tt);
      if(tt == -1) {
          console.log(body.toString())
      }
    });
  });
  
  req.end();
}