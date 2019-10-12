const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const main = document.getElementsByTagName("main")[0]

window.addEventListener("DOMContentLoaded", function() {

// Getting Pokemon

    const getTrainers = () => {
        return fetch(TRAINERS_URL)
            .then(response => response.json())
            .then(arrayOfTrainers=> displayTrainers(arrayOfTrainers.data))    
    }

    const getPokemon = (id) => {
        return fetch(`${POKEMONS_URL}/${id}`).then(response => response.json())
    }

    const displayTrainers = (arrayOfTrainersData) => {
        for (const trainerData of arrayOfTrainersData) {
            createTrainerObject(trainerData)
        }
    }

    const createTrainerObject = (trainerData) => {
        let container = createTrainerContainer(trainerData);
        let header = createHeader(trainerData);
        let addPokemonButton = createAddPokemonButton(trainerData);
        let pokemonList = createPokemonList(trainerData);
        main.appendChild(container);
        container.appendChild(header);
        container.appendChild(addPokemonButton);
        container.appendChild(pokemonList);
    }

    const createTrainerContainer = (trainerData) => {
        let container = document.createElement("div");
        container.setAttribute("class", "card");
        container.setAttribute("data-id", `${trainerData.attributes.id}`);
        return container;
    }

    const createHeader = (trainerData) => {
        let header = document.createElement("h2");
        header.innerText = `${trainerData.attributes.name}`;
        return header;
    }

    const createAddPokemonButton = (trainerData) => {
        let button = document.createElement("button");
        button.setAttribute("data-trainer-id", `${trainerData.attributes.id}`);
        button.innerText = 'Add Pokemon';
        button.addEventListener("click", handleAddPokemon)
        return button;
    }

    const createPokemonList= (trainerData) => {
        let pokemonList = document.createElement("ul");
        let pokemonIDArray = getPokemonIDs(trainerData);
        createListItems(pokemonList, pokemonIDArray);
        return pokemonList;
    }

    const getPokemonIDs = (trainerData) => {
        let pokemonArray = trainerData.relationships.pokemons.data;
        let pokemonIDArray = [];
        for (const pokemon of pokemonArray) {
            pokemonIDArray.push(parseInt(pokemon.id));
        }
        return pokemonIDArray;
    }

    const createListItems = (pokemonList, pokemonIDArray) => {
        for (const id of pokemonIDArray) {
            getPokemon(id).then(pokemon => createListItem(pokemon, pokemonList))
        }
    }

    const createListItem = (pokemon, pokemonList) => {
        let listItem = document.createElement("li");
        let releaseButton = createReleaseButton(pokemon)
        listItem.textContent = `${pokemon.data.attributes.nickname} (${pokemon.data.attributes.species})`;
        listItem.appendChild(releaseButton)
        pokemonList.appendChild(listItem);
    }

    const createReleaseButton = (pokemon) => {
        let releaseButton = document.createElement("button")
        releaseButton.setAttribute("class", "release")
        releaseButton.setAttribute("data-pokemon-id", `${pokemon.data.attributes.id}`)
        releaseButton.innerText = "Release"
        releaseButton.addEventListener("click", handleReleasePokemon)
        return releaseButton
    }

// Creating pokemong

    const handleAddPokemon = (event) => {
        trainer_id = parseInt(event.target.dataset.trainerId)
        if (teamHasSpace(trainer_id)) {
            postPokemon(trainer_id);
        } else {
            return window.alert("This team is full!")
        }
    }

    const teamHasSpace = (trainer_id) => {
        let teamContainer = document.querySelector(`div[data-id="${trainer_id}"`);
        let pokemonCount = teamContainer.childNodes[2].childNodes.length;
        if (pokemonCount >= 6) {
            return false;
        } else {
            return true;
        }
    }

    const postPokemon = (trainerId) => {
        return fetch(`${POKEMONS_URL}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "trainer_id": trainerId
            })
        }).then(response => response.json())
          .then(pokemonData => createNewPokemon(pokemonData, trainerId))
          .catch(console.log)
    }

    const createNewPokemon = (pokemonData, trainer_id) => {
        pokemonList = findPokemonList(trainer_id);
        createListItem(pokemonData, pokemonList);
    }

    const findPokemonList = (trainerId) => {
        pokemonList = document.querySelector(`div[data-id="${trainerId}"]`).childNodes[2];
        return pokemonList;
    }

//Deleting Pokemon

    const handleReleasePokemon = (event) => {
        let pokemonID = parseInt(event.target.dataset.pokemonId);
        let listElement = event.target.parentElement
        deletePokemon(pokemonID, listElement);
    }

    const deletePokemon = (pokemonID, listElement) => {
        return fetch(`${POKEMONS_URL}/${pokemonID}`, {
            method: "DELETE"
        }).then(response => response.json())
          .then(listElement.remove())
    }

    getTrainers();

})