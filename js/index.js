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
      const questionDOM = document.querySelector('.question');
      questionDOM.textContent = response.data.results[0].question;

      document.querySelector('.category').classList.add('hidden');
      document.querySelector('.game').classList.remove('hidden');
    });
}

function defineCategories() {
  document.querySelector('.difficulty').classList.add('hidden');
  addButtonsCattegory();
  document.querySelector('.category').classList.remove('hidden');
}
