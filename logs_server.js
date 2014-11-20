var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require("path");
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('logs.db');

if (!fs.existsSync('logs.db'))
{
	db.run('create table logs(timestamp datetime primary key, username text, msg text)');
};

var app = http.createServer(function (req, res) {
	var stmt;
	var data = '';
	var queryData = url.parse(req.url, true).query;

	res.setHeader('Context-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET');

	if (queryData.display !== undefined)
	{
		stmt = 'select * from logs';
		db.all(stmt, function(err, rows) {
			data = rows;
			res.end(JSON.stringify(data));
		});
	}
	else if (queryData.add !== undefined)
	{
		var timestamp = new Date().getTime();
		stmt = db.prepare('insert into logs (timestamp, username, msg) values(? , ?, ?)');
		stmt.run(timestamp, queryData.username, queryData.msg);
		stmt.finalize();
		res.end(JSON.stringify({ time: timestamp}));
	} else {
		var my_path = url.parse(req.url).pathname;
		var full_path = path.join(process.cwd(), my_path);
		fs.exists(full_path, function (exists) {
			if (!exists) {
				res.writeHeader(404, {"Content-Type": "text/plain"});  
				res.write("404 Not Found\n");  
				res.end();
			} else {
				fs.readFile(full_path, "binary", function(err, file) {  
					if (err) {  
						res.writeHeader(500, {"Content-Type": "text/plain"});  
						res.write(err + "\n");  
						res.end();  
			     		} else {
						res.writeHeader(200);  
					        res.write(file, "binary");  
					        res.end();
					}
				});
			}
		});
	};
});

app.listen(3000);
process.on('SIGINT', function () { db.close(); });
process.on('SIGTERM', function () { db.close(); });
