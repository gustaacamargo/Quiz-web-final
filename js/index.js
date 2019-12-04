let categoryGame = function(id, name) {
  this.id = id;
  this.name = name;
};

let question = function(unanswered, answerLater) {
  this.unanswered = unanswered;
  this.answerLater = answerLater;
};

let game = function(
  startAnswerLater,
  currentQuestion,
  difficulty,
  score,
  stop,
  errors,
  questionsAnswered
) {
  // this.categoryGame = categoryGame;
  // this.question = question;
  this.startAnswerLater = startAnswerLater;
  this.currentQuestion = currentQuestion;
  this.difficulty = difficulty;
  this.score = score;
  this.stop = stop;
  this.errors = errors;
  this.questionsAnswered = questionsAnswered;
};

game.prototype.clear = function() {
  this.categoryGame = undefined;
  this.question = undefined;
  this.startAnswerLater = false;
  this.currentQuestion = undefined;
  this.difficulty = '';
  this.score = 0;
  this.stop = false;
  this.errors = 0;
  this.questionsAnswered = 0;
};

let categoryQuestions = new categoryGame(undefined, undefined);
let currentQuestion = new question(undefined, undefined);
let currentGame = new game(false, undefined, '', 0, false, 0, 0);

// window.onbeforeunload = function() {
//   localStorage.setItem('categoryGame', JSON.stringify(categoryGame));
//   localStorage.setItem('currentQuestion', JSON.stringify(currentQuestion));
//   localStorage.setItem('currentGame', JSON.stringify(currentGame));
// };

// window.onload = function() {
//   if (categoryGame !== undefined) {
//     categoryGame = JSON.parse(localStorage.getItem('categoryGame'));
//   } else {
//   }

//   if (currentQuestion !== undefined) {
//     currentQuestion = JSON.parse(localStorage.getItem('currentQuestion'));
//   } else {
//   }

//   if (currentGame !== undefined) {
//     currentGame = JSON.parse(localStorage.getItem('currentGame'));
//   } else {
//   }
// };

document.querySelector('.category').classList.add('hidden');
document.querySelector('.game').classList.add('hidden');
document.querySelector('.progress-game').classList.add('hidden');
document.querySelector('.end-game').classList.add('hidden');
document.querySelector('.score').textContent = currentGame.score;

document.querySelector('.answer-later').addEventListener('click', function() {
  currentGame.stop = true;
  answerLaterF();
});

document.querySelector('.easy').addEventListener('click', function() {
  defineCategories();
  currentGame.difficulty = 'easy';
});

document.querySelector('.medium').addEventListener('click', function() {
  defineCategories();
  currentGame.difficulty = 'medium';
});

document.querySelector('.hard').addEventListener('click', function() {
  defineCategories();
  currentGame.difficulty = 'hard';
});

function addButtonsCattegory() {
  buttonsDOM = document.querySelector('.buttons-category');
  axios
    .get(`https://opentdb.com/api_category.php`)
    .then(function(response) {
      const categories = response.data;

      categories.trivia_categories.forEach(category => {
        const button = document.createElement('button');

        button.classList.add(`btn`);
        button.classList.add(`btn-primary`);
        button.classList.add(`category-btn`);

        button.textContent = category.name;
        //buttonsDOM.innerHTML += `<button type="button" class="btn btn-primary ${category.name} category-btn">${category.name}</button>`;
        buttonsDOM.appendChild(button);

        button.addEventListener('click', function(e) {
          categoryQuestions.id = category.id;
          categoryQuestions.name = category.name;
          questions();
        });
      });
    })
    .catch(function(erro) {
      console.error(erro);
    });
}

function questions() {
  axios
    .get(
      `https://opentdb.com/api.php?amount=10&category=${categoryQuestions.id}&difficulty=${currentGame.difficulty}`
    )
    .then(function(response) {
      currentQuestion.unanswered = response.data.results;

      console.log(currentQuestion.unanswered.length);

      currentQuestion.unanswered.forEach(questions => {
        console.log(currentQuestion.question);
      });
      defineQuestions();

      timing();

      document.querySelector('.category').classList.add('hidden');
      document.querySelector('.game').classList.remove('hidden');
      document.querySelector('.progress-game').classList.remove('hidden');
    });
}

function defineCategories() {
  document.querySelector('.difficulty').classList.add('hidden');
  addButtonsCattegory();
  document.querySelector('.category').classList.remove('hidden');
}

function defineQuestions() {
  const buttonsAnswersDOM = document.querySelector('.buttons-game');
  const questionDOM = document.querySelector('.question');

  if (currentQuestion.unanswered.length > 0 || currentQuestion.answerLater !== undefined) {
    buttonsAnswersDOM.textContent = '';
    const answersTemp = [];

    const tamanho = currentQuestion.unanswered.length;
    const i = Math.floor(Math.random() * tamanho);

    if (currentQuestion.unanswered.length > 0) {
      currentGame.currentQuestion = currentQuestion.unanswered[i];
      removeOfArray(currentQuestion.unanswered[i], currentQuestion.unanswered);
    } else {
      currentGame.currentQuestion = currentQuestion.answerLater;
      currentQuestion.answerLater = undefined;
    }

    questionDOM.textContent = '';
    questionDOM.textContent = currentGame.currentQuestion.question;

    answersTemp.push(currentGame.currentQuestion.correct_answer);
    for (let index = 0; index < currentGame.currentQuestion.incorrect_answers.length; index++) {
      answersTemp.push(currentGame.currentQuestion.incorrect_answers[index]);
    }

    let len = answersTemp.length;
    const numbers = [];
    for (let index = 0; index < answersTemp.length; index++) {
      numbers.push(index);
    }

    const numbersGenerated = [];
    do {
      const button = document.createElement('button');

      button.classList.add('btn');
      button.classList.add('btn-primary');
      button.classList.add('category-btn');

      const tamanho = answersTemp.length;
      const numberRandom = Math.floor(Math.random() * tamanho);

      if (!numbersGenerated.includes(numberRandom)) {
        numbersGenerated.push(numberRandom);
        len--;

        button.textContent = answersTemp[numberRandom];

        button.addEventListener('click', function(e) {
          currentGame.questionsAnswered++;
          if (answersTemp[numberRandom] === currentGame.currentQuestion.correct_answer) {
            button.classList.add('correct-answer');
            scoreController('correct');
          } else {
            button.classList.add('wrong-answer');
            scoreController('wrong');
            currentGame.errors++;
            if (currentGame.errors >= 3) {
              endGame();
              document.querySelector('.progress-game').classList.add('hidden');
            }
          }
          if (currentGame.errors < 3) {
            currentGame.stop = true;
            newQuestion();
            document.querySelector('.buttons-later').classList.add('hidden');
          }
        });
        buttonsAnswersDOM.appendChild(button);
      }
    } while (0 < len);
  } else {
    if (currentQuestion.answerLater !== undefined) {
      loadStoredQuestion();
      //COLOCAR NA FUNCAO ACIMA OS PONTOS A SEREM CONTABILIZADOS PARA QUESTOES ARMAZENADAS
      document.querySelector('.new-question').classList.add('hidden');
      document.querySelector('.buttons-later').classList.remove('hidden');
      startIntervalAnswerLater();

      currentGame.stop = false;
      timing();
    } else {
      questionDOM.textContent = 'The questions ended';

      endGame();
    }

    //ESCONDER BOTOES E TIMING
  }
}

function newQuestion() {
  if (currentGame.errors >= 3) {
    endGame();
    document.querySelector('.progress-game').classList.add('hidden');
  }
  else{
    let newQuestion = false;
    //document.querySelector('.progress-game').classList.add('hidden');
    //
    // document.querySelector('.answer-later').classList.add('hidden');
    // document.querySelector('.answer-now').classList.add('hidden');
    //
    document.querySelector('.new-question').classList.remove('hidden');
    const buttonsAnswersDOM = document.querySelector('.buttons-new');
    const questionDOM = document.querySelector('.info-new');
  
    buttonsAnswersDOM.textContent = '';
    questionDOM.textContent = '';
  
    questionDOM.textContent = 'Want to answer another question?';
  
    const possibilities = ['Yes', 'No'];
    const conditions = [true, false];
    let existStoredQuestion = false;
  
    for (let index = 0; index < possibilities.length; index++) {
      const button = document.createElement('button');
      button.classList.add('btn');
      button.classList.add('btn-primary');
      button.classList.add('category-btn');
  
      if (conditions[index] === true) {
        button.classList.add('btn-success');
  
        button.addEventListener('click', function(e) {
          newQuestion = conditions[index];
  
          if (currentQuestion.answerLater !== undefined) {
            existStoredQuestion = true;
            buttonsAnswersDOM.textContent = '';
            questionDOM.textContent = '';
  
            questionDOM.textContent = 'Do you want to answer the stored question?';
  
            const possibilities = ['Yes', 'No'];
            const conditions = [true, false];
  
            for (let index = 0; index < possibilities.length; index++) {
              const button = document.createElement('button');
              button.classList.add('btn');
              button.classList.add('btn-primary');
              button.classList.add('category-btn');
  
              if (conditions[index] === true) {
                button.classList.add('btn-success');
                button.textContent = possibilities[index];
  
                button.addEventListener('click', function(e) {
                  loadStoredQuestion();
                  //COLOCAR NA FUNCAO ACIMA OS PONTOS A SEREM CONTABILIZADOS PARA QUESTOES ARMAZENADAS
                  document.querySelector('.new-question').classList.add('hidden');
                  document.querySelector('.buttons-later').classList.remove('hidden');
                  startIntervalAnswerLater();
  
                  currentGame.stop = false;
                  timing();
                });
              } else {
                button.classList.add('btn-danger');
  
                button.textContent = possibilities[index];
  
                button.addEventListener('click', function(e) {
                  //
                  // document.querySelector('.answer-later').classList.remove('hidden');
                  // document.querySelector('.answer-now').classList.remove('hidden');
                  //
  
                  defineQuestions();
                  document.querySelector('.new-question').classList.add('hidden');
                  document.querySelector('.buttons-later').classList.remove('hidden');
                  startIntervalAnswerLater();
  
                  currentGame.stop = false;
                  timing();
                });
              }
  
              buttonsAnswersDOM.appendChild(button);
            }
          } else {
            defineQuestions();
            document.querySelector('.new-question').classList.add('hidden');
  
            existStoredQuestion = false;
          }
          if (existStoredQuestion === false) {
            document.querySelector('.buttons-later').classList.remove('hidden');
            startIntervalAnswerLater();
            currentGame.stop = false;
            timing();
          }
        });
      } else {
        button.classList.add('btn-danger');
  
        button.addEventListener('click', function(e) {
          newQuestion = conditions[index];
          document.querySelector('.new-question').classList.add('hidden');
          document.querySelector('.question').textContent = 'You gave up';
  
          endGame();
        });
      }
  
      button.textContent = possibilities[index];
  
      buttonsAnswersDOM.appendChild(button);
    }
  }

  
}

function endGame() {
  document.querySelector('.progress-game').classList.add('hidden');
  document.querySelector('.buttons-game').classList.add('hidden');

  const endGameDOM = document.querySelector('.end-game');
  endGameDOM.innerHTML += `<p class="h5 end-game-top">Score: ${currentGame.score}</p>`;
  endGameDOM.innerHTML += `<p class="h5">Questions answered: ${currentGame.questionsAnswered}</p>`;
  endGameDOM.innerHTML += `<p class="h5">Difficulty: ${currentGame.difficulty}</p>`;
  endGameDOM.innerHTML += `<p class="h5">Category: ${categoryQuestions.name}</p>`;

  document.querySelector('.end-game').classList.remove('hidden');

  localStorage.clear();
}

function startIntervalAnswerLater() {
  let it = setInterval(function() {
    if (currentGame.startAnswerLater === true) {
      document.querySelector('.answer-later').classList.add('hidden');
    }
    if (currentGame.startAnswerLater === false) {
      document.querySelector('.answer-later').classList.remove('hidden');
      clearInterval(it);
    }
  }, 100);
}

function answerLaterF() {
  if (currentQuestion.answerLater === undefined) {
    currentGame.startAnswerLater = true;
    currentQuestion.answerLater = currentGame.currentQuestion;

    newQuestion();
  } else {
    const questionDOM = document.querySelector('.info-new');

    questionDOM.textContent = '';

    questionDOM.textContent = 'Answer the question already stored before saving another question';
  }
}

function loadStoredQuestion() {
  currentGame.startAnswerLater = false;

  const buttonsAnswersDOM = document.querySelector('.buttons-game');
  const questionDOM = document.querySelector('.question');

  buttonsAnswersDOM.textContent = '';
  const answersTemp = [];
  let i;

  currentGame.currentQuestion = currentQuestion.answerLater;
  currentQuestion.answerLater = undefined;
  //removeOfArray(question.answerLater, question.answerLater);

  questionDOM.textContent = '';
  questionDOM.textContent = currentGame.currentQuestion.question;

  answersTemp.push(currentGame.currentQuestion.correct_answer);

  for (let index = 0; index < currentGame.currentQuestion.incorrect_answers.length; index++) {
    answersTemp.push(currentGame.currentQuestion.incorrect_answers[index]);
  }

  let len = answersTemp.length;
  const numbers = [];
  for (let index = 0; index < answersTemp.length; index++) {
    numbers.push(index);
  }

  const numbersGenerated = [];
  do {
    const button = document.createElement('button');

    button.classList.add('btn');
    button.classList.add('btn-primary');
    button.classList.add('category-btn');

    const tamanho = answersTemp.length;
    const numberRandom = Math.floor(Math.random() * tamanho);

    if (!numbersGenerated.includes(numberRandom)) {
      numbersGenerated.push(numberRandom);
      len--;

      button.textContent = answersTemp[numberRandom];

      button.addEventListener('click', function(e) {
        currentGame.questionsAnswered++;
        if (answersTemp[numberRandom] === currentGame.currentQuestion.correct_answer) {
          button.classList.add('correct-answer');
          currentGame.score = currentGame.score - 2;
          scoreController('correct');
        } else {
          button.classList.add('wrong-answer');
          scoreController('wrong');
        }
        currentGame.stop = true;
        newQuestion();
      });

      buttonsAnswersDOM.appendChild(button);
    }
  } while (0 < len);
}

function scoreController(status) {
  if (currentGame.difficulty === 'easy') {
    if (status === 'correct') {
      currentGame.score += 5;
    } else {
      currentGame.score -= 5;
    }
  } else if (currentGame.difficulty === 'medium') {
    if (status === 'correct') {
      currentGame.score += 8;
    } else {
      currentGame.score -= 8;
    }
  }
  if (currentGame.difficulty === 'hard') {
    if (status === 'correct') {
      currentGame.score += 10;
    } else {
      currentGame.score -= 10;
    }
  }

  let scoreDOM = document.querySelector('.score');
  scoreDOM.textContent = currentGame.score;
}

function timing() {
  let seconds = 0;
  let selector = '';
  let interval = 0;
  if (currentGame.difficulty === 'easy') {
    interval = 100 / 45;
    seconds = 45;
    selector = '#progress-easy';
  } else if (currentGame.difficulty === 'medium') {
    interval = 100 / 30;
    seconds = 30;
    selector = '#progress-medium';
  } else if (currentGame.difficulty === 'hard') {
    interval = 100 / 15;
    seconds = 15;
    selector = '#progress-hard';
  }
  let progress = 0;

  let it = setInterval(function() {
    seconds--;
    progress++;
    document.querySelector(selector).style.width = `${progress * interval}%`;
    const timingDOM = document.querySelector('.timing');
    timingDOM.textContent = `${seconds} seconds left`;
    if (seconds <= 0 || currentGame.stop === true) {
      if (currentGame.stop !== true) {
        scoreController('wrong');
      }
      if (seconds === 0) {
        currentGame.errors++;
      }
      document.querySelector('.buttons-later').classList.add('hidden');
      newQuestion();
      clearInterval(it);
    }
  }, 1000);
}

function removeOfArray(data, array) {
  const index = array.indexOf(data);
  console.log(array);
  console.log(index);

  if (index > -1) {
    array.splice(index, 1);
  }

  console.log(array);
}
