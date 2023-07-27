// Seleciona o elemento com o ID "pokemonList" e o atribui à variável "pokemonList"
const pokemonList = document.getElementById("pokemonList");

// Seleciona o elemento com o ID "loadMoreButton" e o atribui à variável "loadMoreButton"
const loadMoreButton = document.getElementById("loadMoreButton");

// Define a quantidade máxima de registros de Pokemon
const maxRecords = 151;

// Define o limite de registros a serem carregados de uma vez
const limit = 10;

// Inicializa a variável "offset" que representa o deslocamento na lista de Pokemons (começa em 0)
let offset = 0;

// Função que recebe um objeto Pokemon e retorna o HTML formatado como uma lista
function convertPokemonToLi(pokemon) {
  // Utiliza template literals (``) para formatar o HTML do Pokemon
  // Cada Pokemon é representado como um <li> (item de lista) com suas informações
  return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

// Função para carregar os itens de Pokemon com base no deslocamento (offset) e limite
function loadPokemonItens(offset, limit) {
  // Chama a função getPokemons da API pokeApi com os parâmetros offset e limit
  // O retorno é uma Promise que será resolvida com a lista de Pokemons (pokemons)
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    // Utiliza o método map para converter cada Pokemon em uma string HTML formatada
    // e, em seguida, utiliza o método join para concatenar todas as strings em uma única string
    const newHtml = pokemons.map(convertPokemonToLi).join("");

    // Adiciona o HTML gerado à lista de Pokemons (pokemonList)
    pokemonList.innerHTML += newHtml;
  });
}

// Carrega os primeiros Pokemons na página, chamando a função loadPokemonItens com os valores iniciais de offset e limit
loadPokemonItens(offset, limit);

// Adiciona um ouvinte de evento de clique no botão "loadMoreButton"
loadMoreButton.addEventListener("click", () => {
  // Incrementa o offset para buscar mais Pokemons na próxima página
  offset += limit;

  // Calcula a quantidade de registros que haverá na próxima página
  const qtdRecordsWithNextPage = offset + limit;

  // Verifica se a quantidade total de registros com a próxima página excede o número máximo de registros
  if (qtdRecordsWithNextPage >= maxRecords) {
    // Se exceder, calcula o novo limite para carregar apenas o restante de Pokemons
    const newLimit = maxRecords - offset;

    // Carrega os Pokemons restantes com o novo limite
    loadPokemonItens(offset, newLimit);

    // Remove o botão "loadMoreButton" porque todos os Pokemons foram carregados
    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    // Se não exceder, carrega mais Pokemons normalmente com o limite definido
    loadPokemonItens(offset, limit);
  }
});
