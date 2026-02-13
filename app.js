// the amount of pokemon to fetch per page
const POKEMON_LIMIT = 10;

// the current offset for pagination, starts at 0 for the first page, goes up by 10
let currentOffset = 0;


/**
 * Fetches 10 different pokemon from the pokeapi, based on the current offset. Also fetches details for each pokemon to get their sprites and ids.
 * @returns {Promise<void>} A list of pokemon objects with their details, including name, id, and sprite URL.
 * @throws Will throw an error if the fetch request fails
 */
async function fetchPokemon() {
    try {
        const prev = document.getElementById('prev-btn');
        prev.disabled = currentOffset === 0;
        prev.style.opacity = prev.disabled ? 0.5 : 1;
        prev.style.cursor = prev.disabled ? 'not-allowed' : 'pointer';
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_LIMIT}&offset=${currentOffset}`);
        const data = await response.json();

        const detailPromises = data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return await res.json();
        });

        const pokemonDetails = await Promise.all(detailPromises);

        renderCards(pokemonDetails);

    } catch (error) {
        console.error("Failed to fetch Pokémon from PokéAPI:", error);
        document.getElementById('status-msg').textContent = "Sorry! Error loading Pokémon. Please try again.";
    }
}

/**
 * Uses the pokemon data to create and display cards in the grid layout, each pokemon has an id, name, and URL for the photo
 * @param {*} pokemonList - A list of pokemon data objects, containing name, id, and URL for their photo
 * @returns {void} Renders the pokemon cards in the grid layout on the page
 */
function renderCards(pokemonList) {
    const grid = document.getElementById('pokemon-grid');
    grid.innerHTML = '';

    pokemonList.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        const sprite = pokemon.sprites.front_default;

        card.innerHTML = `
            <span class="id-badge">${pokemon.id.toString()}</span>
            <img src="${sprite}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
        `;

        grid.appendChild(card);
    });
}

//Event listeners for next and previous buttons, updates the current offset and fetches new pokemon
document.getElementById('next-btn').addEventListener('click', () => {
    currentOffset += POKEMON_LIMIT;
    fetchPokemon();
    document.querySelector('.results').scrollTop = 0;
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentOffset >= POKEMON_LIMIT) {
        currentOffset -= POKEMON_LIMIT;
        fetchPokemon();
        document.querySelector('.results').scrollTop = 0;
    }
});

//initial fetch of pokemon
fetchPokemon();