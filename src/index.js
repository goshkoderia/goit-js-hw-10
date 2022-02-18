import './css/styles.css';
import { debounce } from 'lodash';
import {fetchCountries} from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputBtn = document.querySelector('input[type=text]');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const resetMarkup = ref=>(ref.innerHTML='');

const enterNameCountry = event=>{
    
    const textInput = event.target.value.trim();
    if(!textInput){
        resetMarkup(countryList);
        resetMarkup(countryInfo);
        return;
    }

    fetchCountries(textInput)
    .then(data=>{
        if (data.length > 10){
            Notify.info('Too many matches found. Please enter a more specific name');
            return;
        }
        renderMarkup(data)        
    })
    .catch(error => {
        resetMarkup(countryInfo);
        resetMarkup(countryList);
        Notify.failure('Oops, there is no country with that name');
    })
    
};
const renderMarkup = data => {
  if (data.length === 1) {
    resetMarkup(countryList);
    const markupInfo = createInfo(data);
    countryInfo.innerHTML = markupInfo;
  } else {
    resetMarkup(countryInfo);
    const markupList = createList(data);
    countryList.innerHTML = markupList;
  }
};

const createList = data=>{
    return data
    .map(
        ({name,flags})=>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40"><span>${name.official}</span></li>`
    ).join('');
}
const createInfo = data=> {
    return data.map(({name, capital, population, flags, languages})=>
        `<h1><img src="${flags.png}" alt="${name.official}" width="60" heigth="40">${name.official}</h1>
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Languages: ${Object.values(languages)}</p>`
    )
}

inputBtn.addEventListener('input', debounce(enterNameCountry, DEBOUNCE_DELAY));

