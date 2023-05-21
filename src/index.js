
import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce'
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
 
refs.input.addEventListener('input', debounce(searchCountries, DEBOUNCE_DELAY));

function searchCountries(evt) {
  clearMarkUp();

  let country = evt.target.value.trim();
  if (evt.target.value === "") {
      return
  }
  else {
    fetchCountries(country)
      .then(countries => {
        if (countries.length <= 10 && countries.length > 1) {
          countries.forEach(({flags, name}) =>
            createListMarkUp(flags.png, name.official)
          );
        } else if (countries.length === 1) {
          createMarkUpForOneCountry({
            flaglink: countries[0].flags.png,
            name: countries[0].name.official,
            population: countries[0].population,
            capital: countries[0].capital,
            languages: Object.values(countries[0].languages).join(', '),
          });
        } else if (countries.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
      })
      .catch((error) => {
        if (error.message === '404') {
          Notify.failure('Oops, there is no country with that name');
        }
        else {
           Notify.failure(error.message);
        }
      })
       
  }
    
}

function createListMarkUp(flagLink, country) {
    const markUp = `<li class="list-item">
        <img src="${flagLink}" alt="" width="30" height="">
        <p>${country}</p>
      </li>`;
    refs.countryList.insertAdjacentHTML('beforeend', markUp);  
}

function createMarkUpForOneCountry({flaglink, name, population, capital, languages}) {
  const markUp = `<div class="plate-wrap">
    <h1><img src="${flaglink}" width="30" height="30">  ${name}</h1>
      <ul>
        <li><span>Capital:</span> ${capital}</li>
        <li><span>Population:</span> ${population}</li>
        <li><span>Languages:</span> ${languages}</li>
    </ul></div>`;
    refs.countryInfo.innerHTML = markUp;
}
function clearMarkUp() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}






