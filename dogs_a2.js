const breedButton = document.getElementById('breedButtons');
const breedInfo = document.getElementById('breedInformation');
const nameOfBreed = document.getElementById('breedName');
const descOfBreed = document.getElementById('breedDesc');
const lifespanOfBreed = document.getElementById('breedLife');
const lifespanOfBreed1 = document.getElementById('breedLife1');


let allBreeds = [];

async function randomDogGenerator() {
    const carouselContainer = document.getElementById('dogCarousel');
let container = document.getElementById('dogSlider')
  const res = await fetch('https://dog.ceo/api/breeds/image/random/10');
  const images = await res.json();
  console.log(images);
  images.message.forEach((item) => {
    let image = document.createElement("img");
    image.width = 200;
    image.height = 200;
    image.src = item;
    container.appendChild(image);
  });

  simpleslider.getSlider();
}

async function loadDogBreeds() {
  const res = await fetch('https://dogapi.dog/api/v2/breeds');
  allBreeds = await res.json();
  console.log(allBreeds);

  allBreeds.data.forEach(breed => {
    const btn = document.createElement('button');
    btn.textContent = breed.attributes.name;
    btn.value = breed.attributes.name;
    btn.id = breed.attributes.name;

    btn.classList.add('breedButton');
    btn.addEventListener('click', () => showBreedInfo(breed));
    breedButton.appendChild(btn);
  });

  setupVoiceCommands();
}

function showBreedInfo(breed) {
    nameOfBreed.textContent = breed.attributes.name;
    descOfBreed.textContent = breed.attributes.description || 'No description available';
    lifespanOfBreed.textContent = breed.attributes.life.min || 'Unknown';
    lifespanOfBreed1.textContent = breed.attributes.life.max
    breedInfo.style.display = 'block';

}   
    

function setupVoiceCommands() {
    if (window.annyang) {
        const commands = {
          'load dog breed *breed': function (spokenBreed) {
            const match = allBreeds.find(b => b.name.toLowerCase() === spokenBreed.toLowerCase());
            if (match) {
              showBreedInfo(match);
            } else {
                alert(`Could not find breed: ${nameOfBreed}`)
            }
          }
        };
}


    annyang.addCommands(commands);

    document.getElementById('audio-start').addEventListener('click', () => annyang.start());
    document.getElementById('audio-stop').addEventListener('click', () => annyang.abort());
  }


randomDogGenerator();
loadDogBreeds();