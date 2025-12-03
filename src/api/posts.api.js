import httpClient from './httpClient'

const END_POINT = '/posts'

export const createPost = async data => httpClient.post(`${END_POINT}`, data)
export const fetchPosts = async (tags = []) => {
  const params = new URLSearchParams()
  if (tags.length > 0) tags.forEach(tag => params.append('tags', tag))

  const queryString = params.toString()
  const url = queryString ? `${END_POINT}?${queryString}` : END_POINT
  const response = await httpClient.get(url)
  return response.data
}

export const likePost = async postId => {
  const response = await httpClient.post(`${END_POINT}/${postId}/like`)
  return response.data
}

export const unlikePost = async postId => {
  const response = await httpClient.post(`${END_POINT}/${postId}/unlike`)
  return response.data
}

export const getPostComments = async postId => {
  const response = await httpClient.get(`${END_POINT}/${postId}/comments`)
  return response.data
}

export const createComment = async (postId, content) => {
  const response = await httpClient.post(`${END_POINT}/${postId}/comments`, { content })
  return response.data
}

export const deleteComment = async (postId, commentId) => {
  const response = await httpClient.delete(`${END_POINT}/${postId}/comments/${commentId}`)
  return response.data
}

export const deletePost = async postId => {
  const response = await httpClient.delete(`${END_POINT}/${postId}`)
  return response.data
}

export const editPostContent = async (postId, content) => {
  const response = await httpClient.patch(`${END_POINT}/${postId}`, { content })
  return response.data
}
