$(document).ready(function(){

  //progress bar
  const  bullets  =  [...document.querySelectorAll('.bullet')];
  const MAX_STEPS = 4;
  let currentStep = 1;  

  "use strict";
  
  var questions = [{
    question: "Which of these numbers are divisibile by 3?",
    choices: ['1', '2', '3', '4', '5', '6', '7', '8'],
    correctAnswer: 3
  }, {
    question: "Which of these numbers are even numbers?",
    choices: ['1', '2', '3', '4', '5', '6', '7', '8'],
    correctAnswer: 2
  }, {
    question: "Which of these numbers are not even numbers?",
    choices: ['1', '2', '3', '4', '5', '6', '7', '8'],
    correctAnswer: 1
  }, {
    question: "Which of these numbers are divisible by 1?",
    choices: ['1', '2', '3', '4', '5', '6', '7', '8'],
    correctAnswer: 1
  },
  ];
  
  var questionCounter = 0; //broj pitanja
  var selections = []; //odabiri
  var quiz = $('.content');
  
  displayNext();
  
  
  // 'next' button
  $('#next').on('click', function (e) {
    e.preventDefault();
  
    bullets[currentStep  -  1].classList.add('completed');
    

    if(quiz.is(':animated')) {        
      return false;
    }
    choose();

    // ako nema odabira, pojavljuje se poruka
    if (isNaN(selections[questionCounter])) {
      $('#warning').text('You have to choose an answer!');
    } else {
      questionCounter++;
      currentStep  +=  1;
      displayNext();
	  $('#warning').text('');
    }
  });
  
  // 'prev' button
  $('#prev').on('click', function (e) {
    e.preventDefault();
    bullets[currentStep  -  2].classList.remove('completed');
    
    if(quiz.is(':animated')) {
      return false;
    }
    choose();
    questionCounter--;
    currentStep  -=  1;
    displayNext();
  });
  
  // 'start over' button
  $('#start').on('click', function (e) {
    e.preventDefault();
    
    if(quiz.is(':animated')) {
      return false;
    }
    questionCounter = 0;
    location.reload();
    selections = [];
    displayNext();
    $('#start').hide();
  });

  $('#result').on('click', function (e) {
    e.preventDefault();
    bullets[currentStep  -  1].classList.remove('completed');

    if(quiz.is(':animated')) {
      return false;
    }
    choose();
    if (isNaN(selections[questionCounter])) {
        $('#warning').text('You have to choose an answer!');
      } else {
        questionCounter++;
        currentStep  +=  1;
        displayNext();
        $('#warning').text('');
      }
    $('#result').show();
  });

  function createQuestionElement(index) {
    var qElement = $('<div>', {
      id: 'question'
    });
    
    var header = $('<h2>Question ' + (index + 1) + ':</h4>');
    qElement.append(header);
    
    var question = $('<p>').append(questions[index].question);
    qElement.append(question);
    
    var radioButtons = createRadios(index);
    qElement.append(radioButtons);

	var warningText = $('<p id="warning">');
	qElement.append(warningText);
	
	return qElement;

  }
  
  function createRadios(index) {
    var radioList = $('<ul>');
    var item;
    var input = '';
    for (var i = 0; i < questions[index].choices.length; i++) {
      item = $('<li>');
      input = '<input type="checkbox" class="checkmark" name="answer" value=' + i + ' />';
      input += questions[index].choices[i];
      item.append(input);
      radioList.append(item);
    }
    return radioList;
  }
  
  function choose() {
    selections[questionCounter] = +$('input[name="answer"]:checked').val();
  }
  
  function displayNext() {
    
    quiz.fadeOut(function() {
      $('#question').remove();
      
      if(questionCounter < questions.length){
        var nextQuestion = createQuestionElement(questionCounter);
        quiz.append(nextQuestion).fadeIn();
        if (!(isNaN(selections[questionCounter]))) {
          $('input[value='+selections[questionCounter]+']').prop('checked', true);
        }
        
        // previous button
        if(questionCounter === 1){
          $('#prev').show();
          $('#result').hide();
          $('#start').show();
        } else if(questionCounter === 0){
          $('#result').hide();
          $('#prev').hide();
          $('#next').show();
          $('#start').hide();
        } else if(questionCounter === 3) {
          $('#prev').show();
          $('#next').hide();
          $('#result').show();
          $('#start').show();
        }
      }else {
        var scoreElem = displayScore();
        quiz.append(scoreElem).fadeIn();
        $('#next').hide();
        $('#prev').hide();
        $('#result').hide();
        $('#start').show();
      }
    });
  }
  
  //daje rezultat
  function displayScore() {
    var score = $('<h3>',{id: 'question'});
    
    var numCorrect = 0;
    for (var i = 0; i < selections.length; i++) {
      if (selections[i] === questions[i].correctAnswer) {
        numCorrect++;
      }
    }
	// rezultati
	var percentage = numCorrect / questions.length;

	if (percentage >= 0.9){
    	score.append('Great job! You got ' + numCorrect + ' / ' +
      questions.length + ' questions right!');
	}
	
	else if (percentage >= 0.7){
    	score.append('You did good. You got ' + numCorrect + ' / ' +
      questions.length + ' questions right!');
	}
	
	else if (percentage >= 0.5){
    	score.append('Better luck next time. You got ' + numCorrect + ' / ' +
      questions.length + ' questions right.');
	}
	
	else {
    	score.append('Maybe you should try a little harder. You only got ' + numCorrect + ' / ' +
      questions.length + ' right. Want to try again?');
	}
    return score;
  }
});