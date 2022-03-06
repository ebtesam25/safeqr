import asyncio
import vt
import re

class VirusTotal:
    def __init__(self, apikey) -> None:
        self.apikey = apikey

    async def analyze_url(self, url):
        async with vt.Client(self.apikey) as client:
            result = await client.scan_url_async(url, wait_for_completion=True)
            return result.id
        
    def analyze_url2(self, url):
        with vt.Client(self.apikey) as client:
            result = client.scan_url(url, wait_for_completion=True)
            return result.id

    async def get_analyze(self, id):
        async with vt.Client(self.apikey) as client:
            result = await client.get_json_async(f"/analyses/{id}")
            return result
    def get_analyze2(self, id):
        with vt.Client(self.apikey) as client:
            result = client.get_json(f"/analyses/{id}")
            return result

def geturl(s):
    urls = re.findall('https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+', s)
    if len(urls) > 0:
        return urls[0]
    return "no valid url found"

async def main2():
    virustotal = VirusTotal("100faff390becea72e324fe38dd56e8b7f64d933bc5050eae7a45fe3dbdeb9ef")
    id = await virustotal.analyze_url("https://github.com")
    result = await virustotal.get_analyze(id)
    print(result)
    
def main():
    virustotal = VirusTotal("100faff390becea72e324fe38dd56e8b7f64d933bc5050eae7a45fe3dbdeb9ef")
    id = virustotal.analyze_url2("https://hotwire.com")
    result = virustotal.get_analyze2(id)
    print(result)
    
    print ("****************")
    
    print (result['data']['attributes']['stats'])
    
    
    

if __name__ == "__main__":
    # asyncio.run(main())
    main()
