import { SearchEngine } from 'portable-search-engine'

export const init = () => {
  const search = new SearchEngine();
  const indexButton = document.querySelector("#text+button");
  const indexTextBox = document.getElementById("text")

  indexButton.addEventListener("click", () => {
    search.index(indexTextBox.value);
  })

  const queryButton = document.querySelector("#query+button");
  const queryTextInput = document.getElementById("query");
  const resultsContainer = document.getElementById("results-container");

  queryButton.addEventListener("click", () => {
    console.log("query button")
    
    const results = search.search(queryTextInput.value) || {results: []}; //TODO this || isn't great!
    const list = document.createElement("ol");
    
    results.results.forEach(result => {
      const li = document.createElement("li");
      li.textContent = result;
      list.appendChild(li);
    })

    resultsContainer.appendChild(list);
  })
}

init();