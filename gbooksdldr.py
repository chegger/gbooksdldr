import sys
import requests


def getParsedHTMLFromURL(url):
    return requests.get(url)


if __name__ == '__main__':

    #Input URL has to be a valid URL of form "https://something.somethingelse.tld", without quotation marks
    r = getParsedHTMLFromURL(sys.argv[1])
    print(r.text)
