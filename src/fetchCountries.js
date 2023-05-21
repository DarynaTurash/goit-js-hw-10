export function fetchCountries(name) {
    const params = new URLSearchParams({
      fields: 'name,flags,capital,population,languages',
    });
    return fetch(`https://restcountries.com/v3.1/name/${name}?${params}`).then(
      countries => {
        if (!countries.ok) {
          throw new Error(countries.status);
        }
        return countries.json();
      }
    );
  }
