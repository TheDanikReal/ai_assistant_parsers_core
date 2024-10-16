from selenium.webdriver.remote.webdriver import WebDriver

from ..abc import ABCFetcher


class SeleniumFetcher(ABCFetcher):
    def __init__(self, webdriver: WebDriver) -> None:
        self._webdriver = webdriver

    async def fetch(self, url: str) -> str:
        self._webdriver.get(url)
        return self._webdriver.page_source
