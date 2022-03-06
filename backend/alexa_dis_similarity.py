from numpy import array
from string import ascii_lowercase
from pyquery import PyQuery

'''Get Alexa top 50 sites'''
def __get_alexa_top_50():
    pq = PyQuery(get('https://www.alexa.com/topsites').content)
    items = pq('.site-listing .DescriptionCell p a')
    sites = [i.text().lower() for i in items.items()]
    return sites
alexa_50 = __get_alexa_top_50()


class alexa_similarity:
    def __init__(self, url):
        self.alexa50 = alexa_50
        self.url = url

    '''Remove none numeric or alphabetic characters from URL strings'''
    def clean_url(self, url):
        url = ''.join([i for i in url.lower() if i.isalpha() or i.isalpha()])
        return url

    '''Get list of common characters between two URL strings'''
    def similar_string_score(self, string1:str, string2: str):
        string1, string2 = string1.lower(), string2.lower()
        return list(set(string1) & set(string2))

    '''count the frequency occurance of common charaters in both strings'''
    def count_freq_similar(self, string1: str, string2: str):
        sims = self.similar_string_score(string1, string2)
        if len(sims) == 0:
          return 0
        sim1 = [string1.count(i) for i in sims]
        sim2 = [string2.count(i) for i in sims]
        a = sum(abs(array(sim1) - array(sim2)))
        return a

    '''Get the ascii positional index of a letter'''
    def get_pos(self, char: str):
        try:
            pos = ascii_lowercase.index(char.lower()) if char.isalpha else char
            return int(pos)
        except:
            return 0

    '''Estimate alpha numeric distribution difference'''
    def andd(self, string1: str, string2: str):
        corpus = list(map(self.clean_url, [string1, string2]))
        shorter, longer = min(corpus, key=len), max(corpus, key=len)
        diff = len(longer) - len(shorter)
        corpus[corpus.index(shorter)] = shorter + ('0' * diff)
        diffs = [abs(self.get_pos(corpus[0][i]) - self.get_pos(corpus[1][i])) for i in range(0, len(longer))]
        return sum(diffs)/len(diffs)

    '''Estimate how dis similar 2 URLs are'''
    def alexa_dis_similarity(self):
        self.url = self.clean_url(self.url)
        x = {i: self.count_freq_similar(self.url, self.clean_url(i)) for i in self.alexa50}
        x = {k: v for k, v in x.items() if v < 5}
        print(x)
        if len(x) > 0:
            diffs = [self.andd(self.url, self.clean_url(k)) for k in list(x.keys())]
            return sum(diffs)/len(diffs)
        else:
            return 0