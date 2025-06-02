import { createClient } from '@sanity/client'

// Initialize Sanity client
const client = createClient({
  projectId: 'duuor2ba',
  dataset: 'hanna',
  token: 'skHvUQQmVUV4An3wXvrVJijkj29BLXQZj3i2ZBdAm2ULAcy0fUxms35eU6TQa1TpVJSdYsvdQ1WVu6YNHwhbwwqcN2TdHoQS5MzPRfz31MFdyIhan9ylsBONubsQi9jxrANcYEDFAZTUgRmaMI85sB5gB0dUNf7l9VVJKkbZSguAuOj2mczU',
  useCdn: false,
  apiVersion: '2023-01-01'
})

async function fixSchemaFields() {
  try {
    console.log('🔍 Fetching all poems to fix unknown fields...')
    
    // Fetch all poems including problematic fields
    const poems = await client.fetch(`
      *[_type == "poem"] {
        _id,
        title,
        orderInCategory,
        sortOrder,
        category
      }
    `)
    
    console.log(`📚 Found ${poems.length} poems to check`)
    
    let fixedCount = 0
    
    for (const poem of poems) {
      const updates = {}
      let needsUpdate = false
      
      // Fix sortOrder -> orderInCategory migration
      if (poem.sortOrder && !poem.orderInCategory) {
        updates.orderInCategory = poem.sortOrder
        needsUpdate = true
        console.log(`🔧 Migrating sortOrder to orderInCategory for "${poem.title}"`)
      }
      
      // Remove sortOrder field if it exists (it's not in schema)
      if (poem.sortOrder) {
        // Patch to remove the sortOrder field
        try {
          await client
            .patch(poem._id)
            .unset(['sortOrder'])
            .commit()
          console.log(`🗑️  Removed sortOrder field from "${poem.title}"`)
        } catch (error) {
          console.error(`❌ Error removing sortOrder from "${poem.title}":`, error.message)
        }
      }
      
      // Apply updates if needed
      if (needsUpdate) {
        try {
          await client
            .patch(poem._id)
            .set(updates)
            .commit()
          
          fixedCount++
          console.log(`✅ Fixed "${poem.title}"`)
        } catch (error) {
          console.error(`❌ Error fixing "${poem.title}":`, error.message)
        }
      }
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log(`\n🎉 Field cleanup complete!`)
    console.log(`📊 Summary:`)
    console.log(`   - Total poems checked: ${poems.length}`)
    console.log(`   - Poems fixed: ${fixedCount}`)
    
    console.log(`\n📝 Next steps:`)
    console.log(`   1. Refresh your Sanity Studio page`)
    console.log(`   2. The "Unknown fields found" error should be gone`)
    console.log(`   3. All poems should now have proper orderInCategory fields`)
    
  } catch (error) {
    console.error('❌ Error fixing schema fields:', error.message)
  }
}

// Run the fix
fixSchemaFields() 