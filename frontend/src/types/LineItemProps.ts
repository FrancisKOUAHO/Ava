export interface LineItem {
  name?: string
  price?: number
  unity?: string
  quantity?: number
  lineTotal?: number
  lineTotalTva?: number
  tva?: number

  [key: string]: any
}
