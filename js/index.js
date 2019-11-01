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
        buttonsDOM.innerHTML += `<button type="button" class="btn btn-primary ${category.name} category-btn">${category.name}</button>`;
      });
      console.log(categories);
    })
    .catch(function(erro) {
      console.error(erro);
    });
}
