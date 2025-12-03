import httpClient from './httpClient'

const END_POINT = '/tags'

export const getAllTags = async () => {
  const response = await httpClient.get(`${END_POINT}`)
  return response.data
}
