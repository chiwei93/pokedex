'use strict';
import 'regenerator-runtime/runtime';
import 'core-js/stable';
import icons from './images/sprite.svg';

const inputField = document.querySelector('.input-field');
const btnSubmit = document.querySelector('.btn-submit');
const pokedex = document.querySelector('.pokedex');
const overlay = document.querySelector('.overlay');
const body = document.querySelector('body');

//function for creating div element
const createDivElement = function (container, className) {
  const divElement = document.createElement('div');
  divElement.classList.add(className);
  container.appendChild(divElement);
  return divElement;
};

//function for creating p element
const createPElement = function (container, className, text) {
  const pElement = document.createElement('p');
  pElement.classList.add(className);
  container.appendChild(pElement);
  pElement.textContent = text;
  return pElement;
};

//function for creating span element
const createSpanElement = function (container, className) {
  const spanElement = document.createElement('span');
  spanElement.classList.add(className);
  container.appendChild(spanElement);
  return spanElement;
};

//function for creating img element
const createImg = function (container, className, id) {
  const img = document.createElement('img');
  img.src = `https://pokeres.bastionbot.org/images/pokemon/${id}.png`;
  img.classList.add(className);
  container.appendChild(img);
};

//function for creating ul element
const createUlElement = function (container, className) {
  const ulElement = document.createElement('ul');
  ulElement.classList.add(className);
  container.appendChild(ulElement);

  return ulElement;
};

//function for creating li element
const createLiElement = function (container, className, text) {
  const liElement = document.createElement('li');
  liElement.classList.add(className);
  container.appendChild(liElement);
  liElement.textContent = text;
  return liElement;
};

//function for creating Svg
const createSvg = function (container) {
  const html = `
          <svg class="arrow">
              <use xlink:href="${icons}#icon-chevron-right"></use>
          </svg>
      `;

  container.insertAdjacentHTML('beforeend', html);
};

//function for creating pokemonContainer
const createPokemonContainer = function (container, pokemon) {
  const divElement = createDivElement(container, 'pokemon-container');

  createImg(divElement, 'pokemon-image', pokemon.id);

  const pokemonNameContainer = createDivElement(divElement, 'pokemon-name-container');

  const idText = createPElement(pokemonNameContainer, 'pokemon-id', '# ');

  const idNo = createSpanElement(idText, 'id-no');

  idNo.textContent = `${pokemon.id}`.padStart(3, '0');

  const nameEl = createPElement(pokemonNameContainer, 'pokemon-name', pokemon.name);

  pokemon.types.forEach(type => {
    const spanEl = createSpanElement(pokemonNameContainer, 'pokemon-type');
    spanEl.textContent = type;
  });
};

//function for creating the pokemon Info container
const createPokemonInfoContainer = function (container, pokemon) {
  const pokemonInfoContainer = createDivElement(container, 'pokemon-info-container');

  //creating the description container
  const descriptionContainer = createDivElement(pokemonInfoContainer, 'description-container');

  descriptionContainer.textContent = 'Description';

  const descriptionText = createSpanElement(descriptionContainer, 'description-text');

  descriptionText.textContent = pokemon.description;

  //creating the about container
  const aboutContainer = createDivElement(pokemonInfoContainer, 'about-container');

  createPElement(aboutContainer, 'about-heading', 'About');

  const aboutTextPrimary = createUlElement(aboutContainer, 'about-text-primary-list');

  createLiElement(aboutTextPrimary, 'about-text-primary-item', 'Height');
  createLiElement(aboutTextPrimary, 'about-text-primary-item', 'Weight');
  createLiElement(aboutTextPrimary, 'about-text-primary-item', 'Abilities');

  const aboutTextSecondary = createUlElement(aboutContainer, 'about-text-secondary-list');

  createLiElement(aboutTextSecondary, 'about-text-secondary-item', pokemon.height);
  createLiElement(aboutTextSecondary, 'about-text-secondary-item', pokemon.weight);
  createLiElement(aboutTextSecondary, 'about-text-secondary-item', pokemon.abilities.join(' , '));

  //creating the stat container
  const statsContainer = createDivElement(pokemonInfoContainer, 'stats-container');

  createPElement(statsContainer, 'stats-heading', 'Base Stats');

  //creating each stat (loop over the pokemon.stats array)
  for (let i = 0; i < pokemon.stats.length; i++) {
    const individualStatContainer = createDivElement(statsContainer, 'stat-container');

    const statName = createSpanElement(individualStatContainer, 'stat-text-primary');

    statName.textContent = pokemon.statsNames[i];

    const statBarContainer = createDivElement(individualStatContainer, 'stat-bar-container');

    const statValue = createSpanElement(statBarContainer, 'stat-text-secondary');

    statValue.textContent = pokemon.stats[i];

    const fullStatBar = createDivElement(statBarContainer, 'stat-bar-outer');

    const statBar = createDivElement(fullStatBar, 'stat-bar');

    statBar.style.width = `${pokemon.stats[i] / 3}%`;
  }

  //creating the evolution container (only create if the pokemon.evolutionChain length is more than 1)
  if (pokemon.evolutionChain.length > 1) {
    const evolutionContainer = createDivElement(pokemonInfoContainer, 'evolution-container');

    createPElement(evolutionContainer, 'evolution-heading', 'Evolution');

    //creating the evolution image container
    const evolutionImageContainer = createDivElement(evolutionContainer, 'evolution-image-container');

    //loop over the evolutionChain to create image and arrows
    for (let i = 0; i < pokemon.evolutionChain.length; i++) {
      const evolution = createDivElement(evolutionImageContainer, 'evolution');

      createImg(evolution, 'evolution-image', pokemon.evolutionId[i]);

      const evolutionName = pokemon.evolutionChain[i].replace(
        pokemon.evolutionChain[i][0],
        pokemon.evolutionChain[i][0].toUpperCase()
      );

      createPElement(evolution, 'evolution-name', evolutionName);

      //do not create an arrow if it is the last image
      if (i === pokemon.evolutionChain.length - 1) return;

      createSvg(evolutionImageContainer);
    }
  }
};

//function for creating promises
const getJSON = function (name) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => {
    if (!res.ok) throw new Error(`Evolution Chain Not Found (${res.status})`);

    return res.json();
  });
};

//function for getting JSON
const json = async function (url, errorMessage) {
  const res = await fetch(url);

  if (!res.ok) throw new Error(`${errorMessage} (${res.status})`);

  return res.json();
};

//function for creating error message
const createErrorMessage = function (container, error) {
  createPElement(container, 'error', error);
};

const createBackground = function (pokemon) {
  for (let i = 0; i < pokemon.types.length; i++) {
    switch (pokemon.types[i]) {
      case 'Electric':
        body.style.backgroundColor = 'khaki';
        break;

      case 'Water':
        body.style.backgroundColor = 'lightskyblue';
        break;

      case 'Fire':
        body.style.backgroundColor = 'sandybrown';
        break;

      case 'Grass':
        body.style.backgroundColor = 'springgreen';
        break;

      case 'Psychic':
        body.style.backgroundColor = 'violet';
        break;

      case 'Poison':
        body.style.backgroundColor = 'mediumorchid';
        break;

      case 'Ice':
        body.style.backgroundColor = 'powderblue';
        break;

      case 'Dragon':
        body.style.backgroundColor = 'mediumslateblue';
        break;

      case 'Dark':
        body.style.backgroundColor = 'saddlebrown';
        break;

      case 'Fairy':
        body.style.backgroundColor = 'thistle';
        break;

      case 'Normal':
        body.style.backgroundColor = 'beige';
        break;

      case 'Fighting':
        body.style.backgroundColor = 'indianred';
        break;

      case 'Flying':
        body.style.backgroundColor = 'plum';
        break;

      case 'Ground':
        body.style.backgroundColor = 'moccasin';
        break;

      case 'Rock':
        body.style.backgroundColor = 'goldenrod';
        break;

      case 'Bug':
        body.style.backgroundColor = 'olivedrab';
        break;

      case 'Ghost':
        body.style.backgroundColor = 'rebeccapurple';
        break;

      case 'Steel':
        body.style.backgroundColor = 'slategrey';
        break;

      default:
        body.style.backgroundColor = 'none';
        break;
    }

    return;
  }
};

//function for getting the pokemon info from the pokemon api
const getPokemon = async function (name) {
  try {
    let typeArray = [];
    let abilitiesArray = [];
    let statsArray = [];
    const statsName = ['HP', 'Attack', 'Defense', 'Sp.Atk', 'Sp.Def', 'Speed'];
    let evolutionChain = [];
    let promises = [];
    let pokemon = {};

    //search for the pokemon object from the pokemon api
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

    //if can't find the pokemon, create an error
    if (!res.ok) throw new Error(`Pokemon Not Found (${res.status})`);

    const data = await res.json();

    //loop through the type array to get the type of the pokemon
    data.types.forEach(obj => {
      const typeValue = obj.type.name.replace(obj.type.name[0], obj.type.name[0].toUpperCase());
      typeArray.push(typeValue);
    });

    //loop through the abilities array to get the ability of the pokemon
    data.abilities.forEach(obj => {
      const ability = `${obj.ability.name}`.replace(obj.ability.name[0], obj.ability.name[0].toUpperCase());
      abilitiesArray.push(ability);
    });

    //loop throught the stats array to get the stat
    data.stats.forEach(obj => {
      statsArray.push(obj.base_stat);
    });

    //create property and set the value obtained from above
    pokemon.id = data.id;
    pokemon.name = data.name.replace(data.name[0], data.name[0].toUpperCase());
    pokemon.types = typeArray;
    pokemon.speciesURL = data.species.url;
    pokemon.height = data.height / 10;
    pokemon.weight = data.weight / 10;
    pokemon.abilities = abilitiesArray;
    pokemon.stats = statsArray;
    pokemon.statsNames = statsName;

    //render the pokemonContainer using the property above
    createPokemonContainer(pokedex, pokemon);

    createBackground(pokemon);

    //getting species data
    const dataSpecies = await json(pokemon.speciesURL, 'Species Not Found');

    //update the pokemon object
    pokemon.description = `${dataSpecies.flavor_text_entries[3].flavor_text}`.replace(/\n/g, ' ');

    pokemon.evolutionURL = dataSpecies.evolution_chain.url;

    //getting the evolution data
    const dataEvo = await json(pokemon.evolutionURL, 'Evolution Not Found');

    const chainObj = dataEvo.chain;

    const name1 = chainObj.species.name;

    evolutionChain.push(name1);

    if (chainObj.evolves_to.length > 0) {
      const chain1 = dataEvo.chain.evolves_to[0];

      const name2 = chain1.species.name;
      evolutionChain.push(name2);

      if (chain1.evolves_to.length > 0) {
        const name3 = chain1.evolves_to[0].species.name;

        evolutionChain.push(name3);
      }
    }

    //set the evolutionChain property to the pokemon object
    pokemon.evolutionChain = evolutionChain;

    //loop through the array to create an array of promises
    evolutionChain.forEach(chain => {
      promises.push(getJSON(chain));
    });

    //run all the promises in parallel
    const datas = await Promise.all(promises);

    //get the id of each of the pokemon
    const evolutionId = datas.map(data => data.id);

    //update the pokemon object
    pokemon.evolutionId = evolutionId;

    //render the pokemon info container
    createPokemonInfoContainer(pokedex, pokemon);

    //check if the evolution container has been rendered
    if (pokemon.evolutionChain.length > 1) {
      const img = pokedex.querySelectorAll('img');

      //if true, add an event listener to the last image to listen to when it finish loading
      img[img.length - 1].addEventListener('load', function () {
        //remove the overlay when finish
        overlay.classList.remove('active');
      });
    } else {
      //if the evolution container is not created, then remove the overlay after 2s
      setTimeout(() => {
        overlay.classList.remove('active');
      }, 2000);
    }
  } catch (err) {
    //catch any error
    //create the error message
    createErrorMessage(pokedex, err);

    //remove the overlay
    overlay.classList.remove('active');
  }
};

//adding an event listener to listen for click on the submit btn
btnSubmit.addEventListener('click', function (e) {
  e.preventDefault();

  //empty the pokedex container
  pokedex.innerHTML = '';

  //obtain the input value from the input field
  const input = inputField.value.toLowerCase();

  //check if the input field is empty or not
  if (!input) return;

  //add the overlay with loading spinner
  overlay.classList.add('active');

  //get pokemon from api
  getPokemon(input);

  //empty the input field
  inputField.value = '';

  inputField.blur();
});
