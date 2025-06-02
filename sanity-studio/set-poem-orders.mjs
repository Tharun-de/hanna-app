import { createClient } from '@sanity/client'

// Initialize Sanity client
const client = createClient({
  projectId: 'duuor2ba',
  dataset: 'hanna',
  token: 'skHvUQQmVUV4An3wXvrVJijkj29BLXQZj3i2ZBdAm2ULAcy0fUxms35eU6TQa1TpVJSdYsvdQ1WVu6YNHwhbwwqcN2TdHoQS5MzPRfz31MFdyIhan9ylsBONubsQi9jxrANcYEDFAZTUgRmaMI85sB5gB0dUNf7l9VVJKkbZSguAuOj2mczU',
  useCdn: false,
  apiVersion: '2023-01-01'
})

async function setPoemOrders() {
  try {
    console.log('🔍 Fetching all poems grouped by category...')
    
    // Fetch all poems with their categories
    const poems = await client.fetch(`
      *[_type == "poem" && defined(category)] {
        _id,
        title,
        "categoryTitle": category->title,
        "categoryId": category->_id,
        orderInCategory,
        _createdAt
      } | order(categoryTitle asc, _createdAt asc)
    `)
    
    console.log(`📚 Found ${poems.length} poems with categories`)
    
    // Group poems by category
    const categorizedPoems = {}
    poems.forEach(poem => {
      const categoryKey = poem.categoryTitle || 'uncategorized'
      if (!categorizedPoems[categoryKey]) {
        categorizedPoems[categoryKey] = []
      }
      categorizedPoems[categoryKey].push(poem)
    })
    
    console.log(`\n📂 Found poems in ${Object.keys(categorizedPoems).length} categories:`)
    
    // Show current state and set default orders
    let totalUpdated = 0
    
    for (const [categoryName, categoryPoems] of Object.entries(categorizedPoems)) {
      console.log(`\n📝 Category: "${categoryName}" (${categoryPoems.length} poems)`)
      
      // Check if poems already have orders
      const hasOrders = categoryPoems.some(poem => poem.orderInCategory)
      
      if (hasOrders) {
        console.log(`   ✅ Some poems already have orders set`)
        categoryPoems.forEach((poem, index) => {
          const order = poem.orderInCategory || 'not set'
          console.log(`   ${index + 1}. "${poem.title}" - Order: ${order}`)
        })
      } else {
        console.log(`   🔧 Setting default orders based on creation date...`)
        
        // Set orders based on creation date (oldest = 1, newest = last)
        for (let i = 0; i < categoryPoems.length; i++) {
          const poem = categoryPoems[i]
          const newOrder = i + 1
          
          try {
            await client
              .patch(poem._id)
              .set({ orderInCategory: newOrder })
              .commit()
            
            console.log(`   ✅ "${poem.title}" → Order: ${newOrder}`)
            totalUpdated++
          } catch (error) {
            console.error(`   ❌ Error updating "${poem.title}":`, error.message)
          }
        }
      }
    }
    
    console.log(`\n🎉 Setup complete!`)
    console.log(`📊 Summary:`)
    console.log(`   - Total poems: ${poems.length}`)
    console.log(`   - Categories: ${Object.keys(categorizedPoems).length}`)
    console.log(`   - Orders updated: ${totalUpdated}`)
    
    console.log(`\n📝 Next steps:`)
    console.log(`   1. Go to Sanity Studio: http://localhost:3333`)
    console.log(`   2. Edit any poem to change its "Order in Category"`)
    console.log(`   3. Use "Order in Category" sorting to see them in order`)
    console.log(`   4. Lower numbers appear first (1 = first, 2 = second, etc.)`)
    
  } catch (error) {
    console.error('❌ Error setting poem orders:', error.message)
  }
}

// Run the setup
setPoemOrders() 