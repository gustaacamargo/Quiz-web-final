const categoryGame = {
  id: 0,
  name: ''
};

const question = {
  unanswered: [],
  answerLater: []
};

let startAnswerLater = false;

let currentQuestion;

let difficulty = '';
let score = 0;
let playTimes = 0;
let stop = false;

question.answerLater = undefined;
document.querySelector('.category').classList.add('hidden');
document.querySelector('.game').classList.add('hidden');
document.querySelector('.progress-game').classList.add('hidden');
document.querySelector('.score').textContent = score;

document.querySelector('.answer-later').addEventListener('click', function() {
  stop = true;
  answerLaterF();
});

document.querySelector('.easy').addEventListener('click', function() {
  defineCategories();
  difficulty = 'easy';
});

document.querySelector('.medium').addEventListener('click', function() {
  defineCategories();
  difficulty = 'medium';
});

document.querySelector('.hard').addEventListener('click', function() {
  defineCategories();
  difficulty = 'hard';
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
          categoryGame.id = category.id;
          categoryGame.name = category.name;
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
    .get(`https://opentdb.com/api.php?amount=10&category=${categoryGame.id}&difficulty=${difficulty}`)
    .then(function(response) {
      question.unanswered = response.data.results;

      console.log(question.unanswered.length);

      question.unanswered.forEach(questions => {
        console.log(questions.question);
      });
      defineQuestions();

      timing();
      if (question.answerLater === undefined) {
        document.querySelector('.answer-now').classList.add('hidden');
      }
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

  if (question.unanswered.length > 0) {
    buttonsAnswersDOM.textContent = '';
    const answersTemp = [];

    const tamanho = question.unanswered.length;
    const i = Math.floor(Math.random() * tamanho);

    currentQuestion = question.unanswered[i];
    removeOfArray(question.unanswered[i], question.unanswered);

    questionDOM.textContent = '';
    questionDOM.textContent = currentQuestion.question;

    answersTemp.push(currentQuestion.correct_answer);
    for (let index = 0; index < currentQuestion.incorrect_answers.length; index++) {
      answersTemp.push(currentQuestion.incorrect_answers[index]);
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
          if (answersTemp[numberRandom] === currentQuestion.correct_answer) {
            button.classList.add('correct-answer');
            scoreController('correct');
          } else {
            button.classList.add('wrong-answer');
            scoreController('wrong');
          }
          stop = true;
          newQuestion();
        });

        buttonsAnswersDOM.appendChild(button);
      }
    } while (0 < len);
  } else {
    questionDOM.textContent = 'End';
    //ESCONDER BOTOES E TIMING
  }
}

function newQuestion() {
  let newQuestion = false;
  //document.querySelector('.progress-game').classList.add('hidden');
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

        if (question.answerLater !== undefined) {
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
                stop = false;
                timing();
              });
            } else {
              button.classList.add('btn-danger');

              button.textContent = possibilities[index];

              button.addEventListener('click', function(e) {
                defineQuestions();
                document.querySelector('.new-question').classList.add('hidden');
                stop = false;
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
          stop = false;
          timing();
        }
      });
    } else {
      button.classList.add('btn-danger');

      button.addEventListener('click', function(e) {
        newQuestion = conditions[index];
        document.querySelector('.new-question').classList.add('hidden');
        endGame();
      });
    }

    button.textContent = possibilities[index];

    buttonsAnswersDOM.appendChild(button);
  }
}

function endGame() {
  //TODO implementation
}

function answerLaterF() {
  startAnswerLater = true;
  question.answerLater = currentQuestion;

  let it = setInterval(function() {
    if (startAnswerLater === true) {
      document.querySelector('.answer-now').classList.remove('hidden');
    }
    if (startAnswerLater === false) {
      document.querySelector('.answer-now').classList.add('hidden');
      clearInterval(it);
    }
  }, 500);

  newQuestion();
}

function loadStoredQuestion() {
  startAnswerLater = false;

  const buttonsAnswersDOM = document.querySelector('.buttons-game');
  const questionDOM = document.querySelector('.question');

  buttonsAnswersDOM.textContent = '';
  const answersTemp = [];
  let i;

  currentQuestion = question.answerLater;
  question.answerLater = undefined;
  //removeOfArray(question.answerLater, question.answerLater);

  questionDOM.textContent = '';
  questionDOM.textContent = currentQuestion.question;

  answersTemp.push(currentQuestion.correct_answer);

  for (let index = 0; index < currentQuestion.incorrect_answers.length; index++) {
    answersTemp.push(currentQuestion.incorrect_answers[index]);
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
        if (answersTemp[numberRandom] === currentQuestion.correct_answer) {
          button.classList.add('correct-answer');
          score = score - 2;
          scoreController('correct');
        } else {
          button.classList.add('wrong-answer');
          scoreController('wrong');
        }
        stop = true;
        newQuestion();
      });

      buttonsAnswersDOM.appendChild(button);
    }
  } while (0 < len);
}

function scoreController(status) {
  if (difficulty === 'easy') {
    if (status === 'correct') {
      score = score + 5;
    } else {
      score = score - 5;
    }
  }

  let scoreDOM = document.querySelector('.score');
  scoreDOM.textContent = score;
}

function timing() {
  let seconds = 0;
  let selector = '';
  if (difficulty === 'easy') {
    seconds = 45;
    selector = '#progress-easy';
  } else if (difficulty === 'medium') {
    seconds = 30;
    selector = '#progress-medium';
  } else if (difficulty === 'hard') {
    seconds = 15;
    selector = '#progress-hard';
  }
  let progress = 0;

  let it = setInterval(function() {
    seconds--;
    progress++;
    document.querySelector(selector).style.width = `${progress}%`;
    const timingDOM = document.querySelector('.timing');
    timingDOM.textContent = `${seconds} seconds left`;
    if (seconds <= 0 || stop === true) {
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
