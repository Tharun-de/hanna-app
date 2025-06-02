import { createClient } from '@sanity/client'
import fs from 'fs'

// Initialize Sanity client with your project details
const client = createClient({
  projectId: 'duuor2ba',
  dataset: 'hanna',
  token: 'skHvUQQmVUV4An3wXvrVJijkj29BLXQZj3i2ZBdAm2ULAcy0fUxms35eU6TQa1TpVJSdYsvdQ1WVu6YNHwhbwwqcN2TdHoQS5MzPRfz31MFdyIhan9ylsBONubsQi9jxrANcYEDFAZTUgRmaMI85sB5gB0dUNf7l9VVJKkbZSguAuOj2mczU',
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
  console.log('Parsing poems from text...')
  
  // Try different splitting methods to handle various formats
  let poemBlocks = []
  
  // Method 1: Split by double line breaks
  if (text.includes('\n\n')) {
    poemBlocks = text.split(/\n\s*\n/).filter(block => block.trim())
  }
  // Method 2: Split by lines starting with numbers (if numbered)
  else if (text.match(/^\d+\./m)) {
    poemBlocks = text.split(/(?=^\d+\.)/m).filter(block => block.trim())
  }
  // Method 3: Split by titles in ALL CAPS
  else if (text.match(/^[A-Z\s]+$/m)) {
    poemBlocks = text.split(/(?=^[A-Z\s]+$)/m).filter(block => block.trim())
  }
  // Method 4: Split by very long lines (assuming paragraph breaks)
  else {
    poemBlocks = text.split(/\n\s*\n/).filter(block => block.trim())
  }
  
  console.log(`Found ${poemBlocks.length} poem blocks`)
  
  return poemBlocks.map((block, index) => {
    const lines = block.trim().split('\n').filter(line => line.trim())
    let title, content
    
    // Remove numbering if present (e.g., "1. Title" -> "Title")
    let firstLine = lines[0].trim().replace(/^\d+\.\s*/, '')
    
    // Check if first line looks like a title
    if (lines.length > 1 && (
      firstLine.length < 80 || 
      firstLine === firstLine.toUpperCase() ||
      !firstLine.includes('.')
    )) {
      title = firstLine
      content = lines.slice(1).join('\n').trim()
    } else {
      // Use first few words as title
      title = firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine
      content = block.trim()
    }
    
    // Clean up the content
    content = content.replace(/^\d+\.\s*/, '') // Remove numbering from content too
    
    return {
      _type: 'poem',
      title: title,
      slug: {
        _type: 'slug',
        current: createSlug(title) + '-' + (index + 1) // Add index to ensure uniqueness
      },
      content: content,
      author: 'Hanna',
      isPublic: true,
      publishedAt: new Date().toISOString(),
      // Note: You'll need to create categories first or comment this out
      // category: { _type: 'reference', _ref: 'your-category-id' }
    }
  })
}

// Main import function
async function importPoems() {
  try {
    console.log('Starting poem import process...')
    
    // Check if the poems text file exists
    if (!fs.existsSync('poems-data.txt')) {
      console.error('❌ File "poems-data.txt" not found!')
      console.log('📝 Please create a file called "poems-data.txt" with your poems.')
      return
    }
    
    // Read the poems from the text file
    const poemsText = fs.readFileSync('poems-data.txt', 'utf8')
    
    if (!poemsText.trim()) {
      console.error('❌ The poems-data.txt file is empty!')
      return
    }
    
    const poems = parsePoems(poemsText)
    
    if (poems.length === 0) {
      console.error('❌ No poems could be parsed from the text!')
      return
    }
    
    console.log(`📚 Found ${poems.length} poems to import`)
    
    // Show preview of first poem
    console.log('\n📖 Preview of first poem:')
    console.log(`Title: "${poems[0].title}"`)
    console.log(`Content preview: "${poems[0].content.substring(0, 100)}..."`)
    console.log('')
    
    // Import poems in batches
    const batchSize = 5
    let imported = 0
    
    for (let i = 0; i < poems.length; i += batchSize) {
      const batch = poems.slice(i, i + batchSize)
      console.log(`📤 Importing batch ${Math.floor(i/batchSize) + 1} (${batch.length} poems)...`)
      
      try {
        const results = await Promise.all(
          batch.map(poem => client.create(poem))
        )
        imported += results.length
        console.log(`✅ Successfully imported ${results.length} poems`)
      } catch (batchError) {
        console.error(`❌ Error importing batch:`, batchError.message)
        // Continue with next batch
      }
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    console.log(`\n🎉 Import complete! Successfully imported ${imported}/${poems.length} poems`)
    
  } catch (error) {
    console.error('❌ Error importing poems:', error.message)
    
    if (error.message.includes('token')) {
      console.log('\n🔑 You need to create a Sanity token:')
      console.log('1. Go to https://www.sanity.io/manage')
      console.log('2. Select your project')
      console.log('3. Go to API > Tokens')
      console.log('4. Create a new token with "Editor" permissions')
      console.log('5. Replace YOUR_SANITY_TOKEN_HERE in this script')
    }
  }
}

// Run the import
importPoems() 