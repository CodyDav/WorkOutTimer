var $setClock = $("#setClock");
var $clockDis = $("#display");

var $woMinutes = $("#woMin");
var $woSeconds = $("#woSec");
var $resMinutes = $("#resMin");
var $resSeconds = $("#resSec");

var $plusBtn = $(".plus");
var $minusBtn = $(".minus");
var $startBtn = $("#start");

//Create variables for the setInterval functions
var workoutTimer;
var isWorkout = true;

var sound = new Howl({
	src : ["sound/veil.mp3"],
	rate : 2
});

init();

function init() {
	//Initialize default times
	$woMinutes.text(5);
	$resSeconds.text(30);
}

function getTimeRemaining(endtime) {
	var t = endtime - Date.parse(new Date());
	var secondsRemain = Math.floor((t / 1000) % 60);
	var minutesRemain = Math.floor((t / 1000 / 60) % 60);

	return {
		"total" : t,
		"minutes" : minutesRemain,
		"seconds" : secondsRemain
	};
}


function updateClock(endtime) {
	var t = getTimeRemaining(endtime);
	$clockDis.text(("0" + t.minutes).slice(-2) + ":" + ("0" + t.seconds).slice(-2));
	// console.log(t.seconds);

	if (t.seconds <= 5 && t.seconds !== 0) {
		sound.play();
	}

	if (t.total < 0){
		sound.stop();
		clearInterval(workoutTimer);
		initClock();
	}
}	

function initClock(woMin, woSec, resMin, resSec) {
	if((woMin === 0 && woSec === 0) || (resMin === 0 && resSec === 0)){
		alert("Session time must be greater than 0")

	} else {
		var workoutEndTime = new Date(Date.parse(new Date()) + (woMin * 60 * 1000) + (woSec * 1000));
		var resetEndTime = new Date(Date.parse(new Date()) + (resMin * 60 * 1000) + (resSec * 1000));

		if(isWorkout) {
			updateClock(workoutEndTime);
			workoutTimer = setInterval(function() {updateClock(workoutEndTime);}, 1000);
			isWorkout = false;
		} else {
			isWorkout = true;
			updateClock(resetEndTime);
			workoutTimer = setInterval(function() {updateClock(resetEndTime);}, 1000);
		}
	}	
	
}

function validate(num){
	return Number(num);
}

function reset(){
	clearInterval(workoutTimer);
	$clockDis.text("");
	isWorkout = true;
}

// Events
$startBtn.click(function(){
	
	// console.log(endTime);
	if($(this).text() == "Start!") {
		//Workout Times
		var woMin = validate($woMinutes.text());
		var woSec = validate($woSeconds.text());

		//Break Times
		var resMin = validate($resMinutes.text());
		var resSec = validate($resSeconds.text());
		
		$setClock.slideUp(500, function(){
			$startBtn.text("Reset!");
			initClock(woMin, woSec, resMin, resSec);
		});
	} else {
		$setClock.slideDown(500);
		$(this).text("Start!");
		reset();
	}
	
});

$plusBtn.click(function(){
	var val = Number($(this).prev("p").text());
	val++;
	$(this).prev("p").text(val);
});

$minusBtn.click(function(){
	var val = Number($(this).next("p").text());

	if(val !== 0) {
		val--;
		$(this).next("p").text(val);
	}
});