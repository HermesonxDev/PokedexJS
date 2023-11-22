const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail){
    const pokemon = new Pokemon()
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.number = pokeDetail.order
    pokemon.name = pokeDetail.name
    pokemon.types = types
    pokemon.type = type
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getDetails = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 10) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    
    return fetch(url)
        .then((response) => response.json())  //Recebe uma requisição, chama ela de (response) e transforma em (json)
        .then((jsonBody) => jsonBody.results) //Pega o (response) chama de (jsonBody) e depois pega somente o array results
        .then((pokemons) => pokemons.map(pokeApi.getDetails)) //Pega o array results e chama de (pokemons), faz um map para cada pokemon do array, depois um fetch para a url de cada pokemon do array
        .then((detailsRequest) => Promise.all(detailsRequest)) //Pega o array url de cada pokemon e chama de (detailsRequest), depois espera todos os arrays serem carregados com o Promise.All()
        .then((pokemonsDetails) => pokemonsDetails)
}