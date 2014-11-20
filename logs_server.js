var http = require('http');
var fs = require('fs');
var url = require('url');
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('logs2.db');

if (!fs.existsSync('logs2.db'))
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
	};
});

app.listen(3000);
process.on('SIGINT', function () { db.close(); });
process.on('SIGTERM', function () { db.close(); });
