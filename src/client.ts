import { ICardName } from './cardName'

const origin = 'https://yugioh.fandom.com'

const endpoints = {
  imageserving: origin + '/api.php?format=json&action=imageserving&wisTitle=',
  search: origin + '/wiki/Special:Search?ns0=1&search='
}

interface IImageservingResponse {
  image?: {
    imageserving?: string
  }
}

export async function getImageUrl(cardName: ICardName): Promise<string | null> {
  const title: string | null = cardName.en || (cardName.ja ? await _searchTitle(cardName.ja) : null)
  if (title) {
    const url = await _fetchImageUrl(title)
    if (url) {
      return url
    }
  }
  return null
}

export async function _fetchImageUrl(title: string): Promise<string | null> {
  const url = endpoints.imageserving + encodeURIComponent(title)
  const response = await fetch(url)
  if (response.ok) {
    const json: IImageservingResponse = await response.json()
    if (json.image && json.image.imageserving) {
      return json.image.imageserving
    }
  }
  return null
}

const excludeTitlePatterns = [/^List of /, /^(Chapter|Episode) Card Galleries:/, / \((?!card).*\)$/]

export async function _searchTitle(name: string): Promise<string | null> {
  const url = endpoints.search + encodeURIComponent(name)
  const response = await fetch(url)
  if (response.ok) {
    const text = await response.text()
    const doc = new DOMParser().parseFromString(text, 'text/html')
    const $els = doc.querySelectorAll('.result h1 .result-link')
    for (const $el of $els) {
      const title = $el.textContent
      if (title && excludeTitlePatterns.every(pattern => !title.match(pattern))) {
        return title
      }
    }
  }
  return null
}
