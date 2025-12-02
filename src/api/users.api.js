import httpClient from './httpClient'

const BASE_PATH = '/users'

export const getUserProfile = async userId => {
  const response = await httpClient.get(`${BASE_PATH}/${userId}/profile`)
  return response.data
}

export const getUserFollowers = async userId => {
  const response = await httpClient.get(`${BASE_PATH}/${userId}/followers`)
  return response.data
}

export const getUserFollowing = async userId => {
  const response = await httpClient.get(`${BASE_PATH}/${userId}/following`)
  return response.data
}

export const followUser = async userId => {
  const response = await httpClient.post(`${BASE_PATH}/${userId}/follow`)
  return response.data
}

export const unfollowUser = async userId => {
  const response = await httpClient.delete(`${BASE_PATH}/${userId}/unfollow`)
  return response.data
}

export const searchUsers = async searchTerm => {
  const response = await httpClient.get(`${BASE_PATH}/search?query=${searchTerm}`)
  return response.data
}

export const updateUserImage = async (userId, imageBase64) => {
  const response = await httpClient.put(`${BASE_PATH}/${userId}/image`, {
    image: imageBase64,
  })
  return response.data
}

export const getUserImage = async userId => {
  const response = await httpClient.get(`${BASE_PATH}/${userId}/image`)
  return response.data
}
