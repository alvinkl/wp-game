var temp = document.querySelector('.time');
var button = document.querySelector("button");
var words = document.querySelector(".words");
var timerDiv = document.querySelector(".time");
var scoreDiv = document.querySelector(".score");
var points = 0;
var spans = [];
var typed;
var seconds = 60;
var timer;
var userid;
var spark = new Audio("http://k003.kiwi6.com/hotlink/qdpr7bioht/spark.mp3");
var ind = 0;
var wordCounter = 0;
var reset = document.getElementById('restart');
var next = document.getElementsByClassName('next');

button.addEventListener("click", function(e){
    // GET WORDS
    $.get('url', (words) => {
        const list = words;
        var arrList = list.split('\n').map(tag => tag.trim()).filter(i => i !== '');
        countdown();
    	generateWord();
    	button.disabled = true;
    })
});

function countdown() {
	points = 0;
	timer = setInterval(function(){
		button.disabled = true;
    	seconds--;
    	temp.innerHTML = seconds;
    	if (seconds === 0) {
            let score += points + seconds;
            // PASSING SCORE BEFORE SHOWING MODAL
            $.ajax({
              method: 'POST',
              url: '',
              data: {
                score: score
              }
            })
              .done(() => {
                $('#modal').modal('show');
                document.getElementsByClassName('modal-title')[0].innerHTML = 'Great Job!'
                document.getElementById('modaltxt').innerHTML = 'Try Again';
                document.getElementById('total').innerHTML += score;
              })

            reset.disabled = false;
            reset.style.display = 'inline';

            next[0].disabled = true;
            next[0].style.display = 'none';
            next[1].disabled = true;
            next[1].style.display = 'none';

    		scoreDiv.innerHTML = "0";
    		words.innerHTML = "";
    		button.disabled = false;
    		clearInterval(timer);
    		seconds = 60;
    		timerDiv.innerHTML = "60";
    		button.disabled = false;
	    }
	}, 1000);
}

function generateWord() {
	words.innerHTML = "";
	var wordArray = arrList[(ind < arrList.length)? ind++ : ind].trim();
	for (var i = 0; i < wordArray.length; i++) { //building the words with spans around the letters
		var span = document.createElement("span");
		span.classList.add("span");
		span.innerHTML = wordArray[i];
		words.appendChild(span);
	}
	spans = document.querySelectorAll(".span");
}


function typing(e) {

    if (e.key === '<') typed = '&lt;';
    else if (e.key === '>') typed = '&gt;';
    else typed = e.key;

	for (var i = 0; i < spans.length; i++) {
		if (spans[i].innerHTML === typed) { // if typed letter is the one from the word
			if (spans[i].classList.contains("bg")) { // if it already has class with the bacground color then check the next one
				continue;
			} else if (spans[i].classList.contains("bg") === false && spans[i-1] === undefined || spans[i-1].classList.contains("bg") !== false ) { // if it dont have class, if it is not first letter or if the letter before it dont have class (this is done to avoid marking the letters who are not in order for being checked, for example if you have two "A"s so to avoid marking both of them if the first one is at the index 0 and second at index 5 for example)
				spans[i].classList.add("bg");
				break;
			}
		}
	}
    check();
}

function check() {
    var checker = 0;
    for (var j = 0; j < spans.length; j++) { //checking if all the letters are typed
        if (spans[j].className === "span bg") {
            checker++;
        }
        if (checker === spans.length) { // if so, animate the words with animate.css class
            spark.pause();
            spark.currentTime = 0;
            spark.play();
            words.classList.add("animated");
            words.classList.add("fadeOut");
            points++; // increment the points
            checker = 0;
            scoreDiv.innerHTML = points; //add points to the points div
            document.removeEventListener("keydown", typing, false);
            setTimeout(function(){
                words.className = "words"; // restart the classes
                if (ind < arrList.length) {
                    generateWord(); // give another word
                    document.addEventListener("keydown", typing, false);
                }
            }, 400);
            wordCounter++;
        }
    }
    if (wordCounter >= arrList.length) {
        clearInterval(timer);
        $('#modal').modal('show');
        document.getElementsByClassName('modal-title')[0].innerHTML = 'Good Job!';
        document.getElementById('modaltxt').innerHTML = 'Pumpin up for next challenge!';
        document.getElementById('total').innerHTML += points + seconds;


        next[0].disabled = false;
        next[0].style.display = 'inline';
        next[1].disabled = false;
        next[1].style.display = 'inline';

        reset.disabled = true;
        reset.style.display = 'none';

    }
}

document.addEventListener("keydown", typing, false);
