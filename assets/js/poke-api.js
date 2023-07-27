// Cria um objeto vazio chamado pokeApi
const pokeApi = {};

// Define uma função chamada convertPokeApiDetailToPokemon que recebe um objeto pokeDetail como parâmetro
// A função é responsável por converter os detalhes de um Pokemon da API em um objeto Pokemon personalizado
function convertPokeApiDetailToPokemon(pokeDetail) {
  // Cria uma instância de Pokemon usando a classe Pokemon (supõe-se que ela já esteja definida em outro lugar)
  const pokemon = new Pokemon();

  // Define os atributos do Pokemon com base nos detalhes retornados pela API
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;

  // Extrai os tipos do Pokemon dos detalhes retornados pela API e os atribui ao objeto Pokemon
  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;
  pokemon.types = types;
  pokemon.type = type;

  // Obtém a URL da imagem do Pokemon e a atribui ao objeto Pokemon como seu atributo "photo"
  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

  // Retorna o objeto Pokemon personalizado
  return pokemon;
}

// Define uma função chamada getPokemonDetail no objeto pokeApi
// A função recebe um objeto Pokemon como parâmetro e retorna uma Promise que resolverá para um novo objeto Pokemon personalizado
pokeApi.getPokemonDetail = (pokemon) => {
  // Faz uma requisição à URL do Pokemon para obter mais detalhes usando fetch
  return (
    fetch(pokemon.url)
      .then((response) => response.json())
      // Após obter os detalhes, chama a função convertPokeApiDetailToPokemon para criar o objeto Pokemon personalizado
      .then(convertPokeApiDetailToPokemon)
  );
};

// Define uma função chamada getPokemons no objeto pokeApi
// A função recebe os parâmetros offset e limit, com valores padrão de 0 e 5, respectivamente
pokeApi.getPokemons = (offset = 0, limit = 5) => {
  // Cria a URL para fazer uma requisição à API para obter a lista de Pokemons com base nos parâmetros offset e limit
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  // Faz uma requisição à URL usando fetch
  return (
    fetch(url)
      .then((response) => response.json())
      // Extrai a lista de Pokemons da resposta JSON e a retorna como resultado da Promise
      .then((jsonBody) => jsonBody.results)
      // Para cada Pokemon na lista, chama a função getPokemonDetail para obter seus detalhes personalizados
      .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
      // Como a função getPokemonDetail retorna uma Promise para cada Pokemon, o método Promise.all aguarda todas as Promises serem resolvidas
      // e retorna um array com os detalhes personalizados de todos os Pokemons
      .then((detailRequests) => Promise.all(detailRequests))
      // Finalmente, retorna a lista completa de Pokemons personalizados
      .then((pokemonsDetails) => pokemonsDetails)
  );
};
