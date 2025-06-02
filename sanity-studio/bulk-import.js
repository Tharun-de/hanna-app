const { createClient } = require('@sanity/client')
const fs = require('fs')

// Initialize Sanity client
const client = createClient({
  projectId: 'your-project-id', // Replace with your project ID
  dataset: 'production', // or your dataset name
  token: 'your-token', // You'll need to create a token with write permissions
  useCdn: false,
  apiVersion: '2023-01-01'
})

// Function to create a slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Function to parse poems from text
function parsePoems(text) {
  // Split by double line breaks to separate poems
  const poemBlocks = text.split(/\n\s*\n/).filter(block => block.trim())
  
  return poemBlocks.map((block, index) => {
    const lines = block.trim().split('\n')
    let title, content
    
    // Check if first line looks like a title (short, maybe capitalized)
    if (lines[0].length < 100 && lines.length > 1) {
      title = lines[0].trim()
      content = lines.slice(1).join('\n').trim()
    } else {
      // Use first few words as title
      const firstLine = lines[0].trim()
      title = firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine
      content = block.trim()
    }
    
    return {
      _type: 'poem',
      title: title,
      slug: {
        _type: 'slug',
        current: createSlug(title)
      },
      content: content,
      author: 'Hanna', // Change this to your name
      isPublic: true,
      publishedAt: new Date().toISOString(),
      // You might want to set a default category
      // category: { _type: 'reference', _ref: 'category-id' }
    }
  })
}

// Main import function
async function importPoems() {
  try {
    // Read the poems from a text file
    const poemsText = fs.readFileSync('poems-data.txt', 'utf8')
    const poems = parsePoems(poemsText)
    
    console.log(`Found ${poems.length} poems to import`)
    
    // Import poems in batches
    const batchSize = 10
    for (let i = 0; i < poems.length; i += batchSize) {
      const batch = poems.slice(i, i + batchSize)
      console.log(`Importing batch ${Math.floor(i/batchSize) + 1}...`)
      
      const results = await client.createOrReplace(batch)
      console.log(`Successfully imported ${results.length} poems`)
    }
    
    console.log('All poems imported successfully!')
    
  } catch (error) {
    console.error('Error importing poems:', error)
  }
}

// Run the import
importPoems() 