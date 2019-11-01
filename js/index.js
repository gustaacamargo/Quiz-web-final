let objetoTeste = {
  id: 0,
  name: ''
};

document.querySelector('.category').classList.add('hidden');

document.querySelector('.easy').addEventListener('click', function() {
  document.querySelector('.difficulty').classList.add('hidden');
  addButtonsCattegory();
  document.querySelector('.category').classList.remove('hidden');
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
          objetoTeste.id = category.id;
          objetoTeste.name = category.name;
        });
      });
    })
    .catch(function(erro) {
      console.error(erro);
    });
}
