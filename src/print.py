import re
import requests

from bs4 import BeautifulSoup

from ai_assistant_parsers_core.parsers.utils.clean_blocks import clean_one_by_find, clean_one_by_select
from ai_assistant_parsers_core.parsers import SimpleSelectDomainBaseParser
from ai_assistant_parsers_core.common_utils.universal_clean_html import universal_clean_html


class CIDomainParser(SimpleSelectDomainBaseParser):
    def __init__(self) -> None:
        super().__init__(
            allowed_domains_paths=["example.com"],
            select_arguments=[".pad.group"],
        )

    def process_html(self, html_content: str) -> BeautifulSoup:
        # Use BeautifulSoup to parse the HTML content
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Clean the parsed HTML using the custom cleaning methods
        self._clean_parsed_html(soup)
        
        # Return the cleaned HTML
        return soup

    def _clean_parsed_html(self, soup: BeautifulSoup) -> None:
        # Блок "Статьи по теме..."
        clean_one_by_select(soup, ".heading:has(> .fa.fa-hand-o-right)")
        clean_one_by_select(soup, ".related-posts")

        # Счётчик просмотров
        clean_one_by_find(soup, dict(string=re.compile(r"Просмотров: [\d ]+")))
        clean_one_by_find(soup, dict(string=re.compile(r"More information...")))
        universal_clean_html(soup)


parser = CIDomainParser()
response = requests.get("https://example.com/")
response.raise_for_status()
processed_soup = parser.process_html(response.text)
    
# Print the processed HTML to the console
print(processed_soup.prettify())