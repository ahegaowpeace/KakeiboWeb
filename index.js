const express = require('express')
const bodyParser = require('body-parser')
const $ = require('jquery');
const mysql = require('mysql');
const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 's@@@tETp@3@N',
	database : 'kakeibo'
});

const app = express()
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use(express.static('public'))
app.set("view engine", "ejs");
app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist/"));

app.post('/post', function(req, res) {
	// 挿入ロジック
	nedan = req.body.nedan;
	category = req.body.category;
	time = req.body.time;
	connection.query('INSERT INTO kakeibo_tbl set ?', {nedan:nedan, category:category, time:time}, function (error, results, fields) {
		if (error) throw error;
	});
})

app.get('/ref/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]', function(req, res) {
	// 日別用クエリ
	var date = req.url.substr( 5, 15 );
	var query = "SELECT * FROM kakeibo_tbl WHERE time LIKE \'" + date + "%\'";
	connection.query(query, function (error, results, fields) {
		if (error) throw error;
		res.render("index4.ejs", {data:results});
	});
})

app.get('/ref/[0-9][0-9][0-9][0-9]-[0-9][0-9]', function(req, res) {
	// 月別用円グラフ用クエリ
	var month = req.url.substr( 5, 12 );
	var query ="SELECT SUM(tmp.nedan) AS total, category FROM (SELECT * FROM kakeibo_tbl WHERE time LIKE " + "\'" + month + "%\'" + " ORDER BY category) AS tmp GROUP BY tmp.category";
	connection.query(query, function (error, results, fields) {
		if (error) throw error;
		var zptotal = 0;
		var skhtotal = 0;
		var lfgtotal = 0;
		for ( i=0; results[i]; i++) {
			if (results[i].category == 'lifegood') {
				lfgtotal = results[i].total;
			}
			if (results[i].category == 'syokuhi') {
				skhtotal = results[i].total;
			}
			if (results[i].category == 'zappi') {
				zptotal = results[i].total;
			}
		}
		// ペース計算用日付取得
		var dt = new Date();
		var date = dt.getDate();
		res.render("index3.ejs", {skhtotal:skhtotal, zptotal:zptotal, lfgtotal:lfgtotal, month:month, date:date});
	});
})

app.get('/ref', function(req, res) {
	// 過去月取得クエリ
	var query = "SELECT DISTINCT SUBSTRING(time, 1,7) as month FROM kakeibo_tbl";
	connection.query(query, function (error, results, fields) {
		if (error) throw error;
		var data = results;
		res.render("index2.ejs", {data:data});
	});
})

app.get('/', function(req, res) {
	// 1桁の数字を0埋めで2桁にする
	var toDoubleDigits = function(num) {
		num += "";
		if (num.length === 1) {
			num = "0" + num;
		}
		return num;     
	};
	// 時間取得
	var now = new Date();
	var Year = now.getFullYear();
	var Month = toDoubleDigits(now.getMonth()+1);
	var Hi = toDoubleDigits(now.getDate());
	var Hour = toDoubleDigits(now.getHours());
	var Min = toDoubleDigits(now.getMinutes());
	var today = "\'" + Year + "-" + Month + "-" + Hi + "%" + "\'";
	// 当日分抽出クエリ
	var query = "SELECT * FROM kakeibo_tbl WHERE time LIKE " + today;
	connection.query(query, function (error, results, fields) {
		if (error) throw error;
		var data = results;
		res.render("index.ejs", {data:data});
	});
})

app.listen(process.env.PORT || 3000)
