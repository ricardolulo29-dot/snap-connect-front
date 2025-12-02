import httpClient from './httpClient'

const END_POINT = '/chats'

export const getChats = async () => {
  const response = await httpClient.get(`${END_POINT}`)
  return response.data
}

export const getChatMessages = async chatId => {
  console.log('Fetching messages for chatId:', chatId)
  const response = await httpClient.get(`${END_POINT}/${chatId}/messages`)
  return response.data
}

export const sendMessage = async (chatId, content) => {
  const response = await httpClient.post(`${END_POINT}/${chatId}/messages`, { content })
  return response.data
}

export const createChat = async userId => {
  const response = await httpClient.post(`${END_POINT}`, { userId })
  return response.data
}

export const markMessagesAsRead = async chatId => {
  const response = await httpClient.patch(`${END_POINT}/${chatId}/read`)
  return response.data
}
