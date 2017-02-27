var $setClock = $("#setClock");
var $clockDis = $("#display");
var $clockDisH3 = $("#clockDisplay h3");

var $woMinutes = $("#woMin");
var $woSeconds = $("#woSec");
var $resMinutes = $("#resMin");
var $resSeconds = $("#resSec");
var $cycleNumber = $("#cycleNum");

var $plusBtn = $(".plus");
var $minusBtn = $(".minus");
var $startBtn = $("#start");

//Create variables for the setInterval functions
var workoutTimer;
var isWorkout = true;

//Another Variables
var cycles;
var cycleInProgress = 1;
var sound = new Howl({
	src : ["sound/veil.mp3"],
	rate : 2
});


//Initialize default variables
init();

function init() {
	//Initialize default times
	$woMinutes.text(5);
	$resSeconds.text(30);
	$cycleNumber.text(1);
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

function initClock() {
	//Workout Times
	var woMin = validate($woMinutes.text());
	var woSec = validate($woSeconds.text());

	//Break Times
	var resMin = validate($resMinutes.text());
	var resSec = validate($resSeconds.text());

	if((woMin === 0 && woSec === 0) || (resMin === 0 && resSec === 0)){
		alert("Session time must be greater than 0")

	} else {
		var workoutEndTime = new Date(Date.parse(new Date()) + (woMin * 60 * 1000) + (woSec * 1000));
		var resetEndTime = new Date(Date.parse(new Date()) + (resMin * 60 * 1000) + (resSec * 1000));

		if(isWorkout) {
			if(cycles === 0) {
				reset();
			} else {
				cycles--;
				$clockDisH3.text("Cycle Number: " + cycleInProgress);
				cycleInProgress++;

				updateClock(workoutEndTime);
				workoutTimer = setInterval(function() {updateClock(workoutEndTime);}, 1000);
				isWorkout = false;
			}

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
	//Clear Inteval
	clearInterval(workoutTimer);

	//Reseting the values for the clock display
	$clockDis.text("");
	$clockDisH3.text("");

	isWorkout = true;
	$setClock.slideDown(500);
	$startBtn.text("Start!");
	cycleInProgress = 1;
}

// Events
$startBtn.click(function(){
	
	// console.log(endTime);
	if($(this).text() == "Start!") {
		cycles = validate($cycleNumber.text());

		$setClock.slideUp(500, function(){
			$startBtn.text("Reset!");
			initClock();
		});

	} else {
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
	if($(this).next("p").attr("id") === "cycleNum") {
		if(val !== 1) {
			val--;
			$(this).next("p").text(val);
		}
	} else {
		if(val !== 0) {
			val--;
			$(this).next("p").text(val);
		}
	}
	
});