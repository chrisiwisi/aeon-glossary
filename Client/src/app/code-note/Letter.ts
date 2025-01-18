export type Letter = {
  id: number,
  romanLetter: string,
  imageURL?: string
}

export const INVALID_LETTER: Letter = {
  id: -1,
  romanLetter: '*',
}

export const SPACE_LETTER: Letter = {
  id: 0,
  romanLetter: ' ',
}
