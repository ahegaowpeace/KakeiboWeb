num_bth = document.querySelectorAll('.num_bth');
// 計算過程を表示する場所
let output_sub = document.getElementById('output_sub');
// 計算結果を表示する場所
const output_total = document.getElementById('output_total');
const bs = document.getElementById('bs')
let total = 0;
let category = "";

// 数字・記号押下
num_bth.forEach(index => {
	index.addEventListener('click', () => {
		if (index.dataset.indexId !== 'bs') {
			if(total === 0) {
				total = index.dataset.indexId;
			}else{
				total += index.dataset.indexId;
			}
			output_sub.textContent = total;
		}
	})
})

// イコール押下
const equal_btn = document.getElementById('equal_btn');
equal_btn.addEventListener('click',() =>{
	output_total.textContent = eval(total);
});
//BSボタン（バックスペース）を押した時の処理
bs.addEventListener('click', () => {
	// 一文字目から、最後から二文字目までをtotalに代入（最後の一文字を除きtotalに代入する）
	total = output_sub.textContent.slice(0, -1);
	output_sub.textContent = total;
})
// Cボタン（リセットボタン）を押した時の処理
const clear = document.getElementById('clear')
clear.addEventListener('click', () => {
	reset();
})
// リセットを行う関数
function reset() {
	total = 0; 
	output_sub.textContent = 0;
	output_total.textContent = 0;
}

// カテゴリクリック時
ctg_btn = document.querySelectorAll('.ctglist');
ctg_btn.forEach(index => {
	index.addEventListener('click', () => {
		el = document.getElementById(index.dataset.indexId);
		el.style.borderColor = "red";
		category = index.dataset.indexId;
	})
})

// 送信クリック時
var url = "http://192.168.3.33:3000/post";
// var url = "/post";
push_btn = document.getElementById('push');
push_btn.addEventListener('click', () => {
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
	var time = Year + "-" + Month + "-" + Hi + " " + Hour + ":" + Min;
	console.log(time);

	nedan = eval(total);
	$.post(url,
		{
			'nedan': nedan,
			'category': category,
			'time': time
		}
	);
	alert('送信しました');
})
