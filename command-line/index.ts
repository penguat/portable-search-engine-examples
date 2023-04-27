import { SearchEngine } from "portable-search-engine";
import * as readline from 'node:readline/promises';

import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

let command = "";

let engine = new SearchEngine();

await (async () => {
  while(command != "exit") {
    if (command == "add") {
      let document = await rl.question("What text would you like to add?\n");
      engine.index(document);
      console.log("Got it!")
    }
    else if (command == "search") {
      let query = await rl.question("What would you like to search for?\n");
      let results = engine.search(query);
      console.log(results.results)
    }

    command = await rl.question("What's your command? add/search/exit?\n")
  }
})();

rl.close()