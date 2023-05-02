import {screen} from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom'

import { SearchEngine } from 'portable-search-engine'
jest.mock('portable-search-engine')

// import { init } from '../src/index.js'
let init;


const innerHtml = `<h1>Example usage of the portable search engine</h1>
<label for="text">What would you like to index?</label>
<br/>
<input type="text" name="text" id="text"/>
<button type="submit">Index it!</button>

<label for="query">What would you like to search for?</label>
<br/>
<input type="text" name="query" id="query"/>
<button type="submit">Show me the results!</button>

<div id="results-container"></div>`

beforeEach(async () => {
  //TODO why do all of the examples make e.g. a new div to work in?
  SearchEngine.mockClear();
  document.body.innerHTML = innerHtml;
  init = (await import('../src/index.js')).init
})

describe("init automatically running", () => {
  it("instantiates a SearchEngine instance", () => {
    expect(SearchEngine).toHaveBeenCalled();
  })
})

describe("Indexing", () => {
  it("doesn't index content until we click the button to index it", async () => {
    init();
    const mockSearchEngineInstance = SearchEngine.mock.instances[0];
    expect(mockSearchEngineInstance.index).not.toHaveBeenCalled();
  })

  it("Indexes text into the portable search engine when we click the index button", async () => {
    init();
    
    const text = "Lorem ipsum etc.";
    const user = userEvent.setup();
    
    const indexTextInput = screen.getByLabelText('What would you like to index?');
    const indexButton = screen.getByRole('button', { //TODO why do we use screen?
      name: 'Index it!',
    })
    
    await user.type(indexTextInput, text);
    await user.click(indexButton);
    
    const mockSearchEngineInstance = SearchEngine.mock.instances[0];
    expect(mockSearchEngineInstance.index).toHaveBeenCalled();
  })

  it("Indexes the provided text into the portable search engine", async () => {
    init();
    
    const text = "See, I have provided some text!";
    const user = userEvent.setup();
    
    const indexTextInput = screen.getByLabelText('What would you like to index?');
    const indexButton = screen.getByRole('button', { //TODO why do we use screen?
      name: 'Index it!',
    })

    await user.type(indexTextInput, text);
    await user.click(indexButton);
    
    const mockSearchEngineInstance = SearchEngine.mock.instances[0];
    expect(mockSearchEngineInstance.index).toHaveBeenCalledWith(text);
  })
})

describe("Querying", () => {
  it("requests the query string from the search engine", async () => {
    init();
    
    const query = "boxing";
    const user = userEvent.setup();
    
    const queryTextInput = screen.getByLabelText('What would you like to search for?');
    const queryButton = screen.getByRole('button', { //TODO why do we use screen?
      name: 'Show me the results!',
    })

    await user.type(queryTextInput, query);
    await user.click(queryButton);

    const mockSearchEngineInstance = SearchEngine.mock.instances[0];
    expect(mockSearchEngineInstance.search).toHaveBeenCalledWith(query);
  })

  it("displays the search results on the page", async () => {
    const dummyResults = {
      results: [
        "dancing is an olympic sport now",
        "swimming isn't related to the query here"
      ],
      totalResults: 1234
    }
    SearchEngine.mockImplementationOnce(() => ({
        search: () => dummyResults
      }))
    
    init();
    
    const query = "boxing";
    const user = userEvent.setup();
    
    const queryTextInput = screen.getByLabelText('What would you like to search for?');
    const queryButton = screen.getByRole('button', { //TODO why do we use screen?
      name: 'Show me the results!',
    })
    
    await user.type(queryTextInput, query);
    await user.click(queryButton);

    expect(await screen.findByText(dummyResults.results[0])).toBeVisible()
    expect(await screen.findByText(dummyResults.results[1])).toBeVisible()
  })
})