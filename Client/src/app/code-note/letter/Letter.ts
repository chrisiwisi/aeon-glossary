export type Letter = {
  id: number,
  romanLetter: string,
  imageURL?: string,
  order: string | null
}

export const INVALID_LETTER: Letter = {
  id: -1,
  romanLetter: '*',
  order: null
}

export const SPACE_LETTER: Letter = {
  id: 0,
  romanLetter: ' ',
  order: null
}
