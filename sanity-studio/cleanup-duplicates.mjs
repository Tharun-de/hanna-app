import { createClient } from '@sanity/client'

// Initialize Sanity client
const client = createClient({
  projectId: 'duuor2ba',
  dataset: 'hanna',
  token: 'skHvUQQmVUV4An3wXvrVJijkj29BLXQZj3i2ZBdAm2ULAcy0fUxms35eU6TQa1TpVJSdYsvdQ1WVu6YNHwhbwwqcN2TdHoQS5MzPRfz31MFdyIhan9ylsBONubsQi9jxrANcYEDFAZTUgRmaMI85sB5gB0dUNf7l9VVJKkbZSguAuOj2mczU',
  useCdn: false,
  apiVersion: '2023-01-01'
})

async function cleanupDuplicates() {
  try {
    console.log('🔍 Fetching all poems from Sanity...')
    
    // Fetch all poems
    const poems = await client.fetch(`
      *[_type == "poem"] {
        _id,
        title,
        content,
        _createdAt
      } | order(_createdAt asc)
    `)
    
    console.log(`📚 Found ${poems.length} total poems`)
    
    // Group poems by title to find duplicates
    const poemGroups = {}
    
    poems.forEach(poem => {
      const key = poem.title.toLowerCase().trim()
      if (!poemGroups[key]) {
        poemGroups[key] = []
      }
      poemGroups[key].push(poem)
    })
    
    // Find duplicates
    const duplicateGroups = Object.entries(poemGroups).filter(([_, group]) => group.length > 1)
    
    console.log(`🔍 Found ${duplicateGroups.length} poem titles with duplicates`)
    
    if (duplicateGroups.length === 0) {
      console.log('✅ No duplicates found! Your collection is clean.')
      return
    }
    
    let totalDeleted = 0
    
    // Process each group of duplicates
    for (const [title, duplicates] of duplicateGroups) {
      console.log(`\n📝 Processing "${title}" (${duplicates.length} copies)`)
      
      // Keep the first one (oldest), delete the rest
      const toKeep = duplicates[0]
      const toDelete = duplicates.slice(1)
      
      console.log(`   ✅ Keeping: ${toKeep._id} (created: ${toKeep._createdAt})`)
      
      // Delete duplicates
      for (const poem of toDelete) {
        try {
          await client.delete(poem._id)
          console.log(`   🗑️  Deleted: ${poem._id} (created: ${poem._createdAt})`)
          totalDeleted++
        } catch (error) {
          console.error(`   ❌ Error deleting ${poem._id}:`, error.message)
        }
      }
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    console.log(`\n🎉 Cleanup complete!`)
    console.log(`📊 Summary:`)
    console.log(`   - Original poems: ${poems.length}`)
    console.log(`   - Duplicates deleted: ${totalDeleted}`)
    console.log(`   - Unique poems remaining: ${poems.length - totalDeleted}`)
    
    // Fetch final count to verify
    const finalCount = await client.fetch(`count(*[_type == "poem"])`)
    console.log(`   - Verified final count: ${finalCount}`)
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message)
  }
}

// Run the cleanup
cleanupDuplicates() 