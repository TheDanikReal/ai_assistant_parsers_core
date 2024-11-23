import {python as sberbankcore} from "pythonia"

const sberbank = await sberbankcore("./print.py")

const parser = await sberbank.CIDomainParser()
console.log(await parser.process_html(await sberbank.request("https://example.com/")))

sberbankcore.exit()