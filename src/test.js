import { python, py, PyClass } from 'pythonia';
python.setFastMode(true); // Optimize data handling across the JS-Python bridge

// Import necessary Python modules via the bridge
const BeautifulSoup = await python('bs4');
const { clean_one_by_find, clean_one_by_select } = await python('ai_assistant_parsers_core.parsers.utils.clean_blocks');
const { universal_clean_html } = await python('ai_assistant_parsers_core.common_utils.universal_clean_html');
const requests = await python('requests');
console.log("imported")
class CIDomainParser extends PyClass {
  constructor() {
    super(); // Initialization
    this.allowedDomainsPaths = ["example.com"];
    this.selectArguments = [".pad.group"];
  }

  async process_html(html_content) {
    // Use BeautifulSoup to parse the HTML content
    const soup = await new BeautifulSoup(html_content, 'html.parser');

    // Clean the parsed HTML using the custom cleaning methods
    await this._clean_parsed_html(soup);

    // Return the cleaned HTML
    return soup;
  }

  async _clean_parsed_html(soup) {
    // Execute specific cleaning procedures just like in the Python code
    await clean_one_by_select(soup, ".heading:has(> .fa.fa-hand-o-right)");
    await clean_one_by_select(soup, ".related-posts");

    // Use regex for find operations
    await clean_one_by_find(soup, { string: new RegExp('Просмотров: [\\d ]+') });
    await clean_one_by_find(soup, { string: new RegExp('More information...') });

    // Universal clean-up
    await universal_clean_html(soup);
  }
}

// Demonstration of usage
//(async function exampleUsage() {
const parser = new CIDomainParser();
const response = await requests.get('https://example.com');
console.log(response.toString())
//const text = await response.text()
//python.exit()
const cleanedSoup = await parser.process_html("<div> test </div>");
console.log("done")

  // Do something with cleanedSoup, for example, logging or further processing
  //console.log(cleanedSoup.toString());
//})();

python.exit(); // Exit Python environment when done