require('dotenv').config()
const fs = require('fs')
const fetch = require('node-fetch')
const yamlFront = require('yaml-front-matter')

const mediumApiUrl = 'https://api.medium.com/v1'

const {
  MEDIUM_TOKEN
} = process.env

if (!MEDIUM_TOKEN) {
  console.log('Missing Medium credentials.')
  process.exit(1)
}

/**
 * Logs any errors that medium's api may have returns and terminates.
 *
 * @param {object} response Response from medium's api
 */
function handleMediumErrors (response) {
  if (response.errors) {
    console.log('  Medium error occurred')
    response.errors.forEach(e => console.log('   ', e.message))
    process.exit(1)
  }
}

/**
 * Removes excess of line breaks from the content
 * Return the content updated.
 *
 * @param {string} content The post content.
 *
 * @returns {string} The updated content.
 */
function handleLineBreaks (content) {
  return content.replace(/[\n]{3,}/gm, '\n\n')
}

/**
 * Returns the user information of the token holder
 *
 * @async
 *
 * @returns {object} Medium API response for the user.
 */
async function getUserInfo () {
  // Publish to medium.
  const res = await fetch(`${mediumApiUrl}/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MEDIUM_TOKEN}`
    }
  })
  const content = await res.json()
  handleMediumErrors(content)
  return content.data
}

/**
 * Uploads the given post to Medium.
 *
 * @async
 * @param {object} post Post to upload formatted according to Medium's API.
 *
 * @returns {object} Medium API response.
 */
async function uploadPost (post, userId) {
  // Publish to medium.
  console.log(`Posting ${post.title} to ${mediumApiUrl}/users/${userId}/posts`)
  const res = await fetch(`${mediumApiUrl}/users/${userId}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MEDIUM_TOKEN}`
    },
    body: JSON.stringify(post)
  })
  const content = await res.json()
  handleMediumErrors(content)
  return content.data
}

//
//
// MAIN
//
async function main () {
  // Make the redirect files.
  const file = process.argv[2]

  if (!file) {
    console.log('path to markdown file is missing')
    process.exit(1)
  }

  const user = await getUserInfo()
  console.log(user)

  let idx = 1
  console.log(`Handling post of ${file}:`)
  const post = yamlFront.safeLoadFront(fs.readFileSync(file, 'utf8'))
  let content = post.__content
  content = handleLineBreaks(content)
  const date = new Date(post.date);
  // Prepare data for Medium.
  const mediumPost = {
    title: post.title,
    contentFormat: 'markdown',
    publishedAt: date.toISOString(),
    content
  }

  const uploadResult = await uploadPost(mediumPost, user.id)
  console.log('  Post uploaded.', file, '=>', uploadResult.url)
  console.log('')
}

// Start
main()
