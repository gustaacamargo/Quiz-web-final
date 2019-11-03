const categoryGame = {
  id: 0,
  name: ''
};

let difficulty = '';

document.querySelector('.category').classList.add('hidden');
document.querySelector('.game').classList.add('hidden');

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
      defineQuestions(response);
      document.querySelector('.category').classList.add('hidden');
      document.querySelector('.game').classList.remove('hidden');
    });
}

function defineCategories() {
  document.querySelector('.difficulty').classList.add('hidden');
  addButtonsCattegory();
  document.querySelector('.category').classList.remove('hidden');
}

function defineQuestions(response) {
  const results = response.data.results;

  console.log(results);

  const buttonsAnswersDOM = document.querySelector('.buttons-game');
  const answersTemp = [];

  const tamanho = results.length;
  const i = Math.floor(Math.random() * tamanho);

  const questionDOM = document.querySelector('.question');
  questionDOM.textContent = results[i].question;

  answersTemp.push(results[i].correct_answer);

  for (let index = 0; index < results[i].incorrect_answers.length; index++) {
    answersTemp.push(results[i].incorrect_answers[index]);
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
        if (answersTemp[numberRandom] === results[i].correct_answer) {
          button.classList.add('correct-answer');
        } else {
          button.classList.add('wrong-answer');
        }
      });

      buttonsAnswersDOM.appendChild(button);
    }
  } while (0 < len);
}
