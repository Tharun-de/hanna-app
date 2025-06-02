import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Hanna Poetry Studio',

  projectId: 'duuor2ba',
  dataset: 'hanna',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Site Settings (Singleton)
            S.listItem()
              .title('⚙️ Site Settings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Site Settings')
              ),
            S.divider(),
            
            // Categories Management
            S.listItem()
              .title('📁 Poetry Categories')
              .child(
                S.documentTypeList('category')
                  .title('Manage Categories')
                  .defaultOrdering([{field: 'order', direction: 'asc'}])
              ),
            S.divider(),
            
            // All Poems
            S.listItem()
              .title('📝 All Poems')
              .child(
                S.documentTypeList('poem')
                  .title('All Poems')
                  .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
              ),
            
            // Poems by Status
            S.listItem()
              .title('✅ Published Poems')
              .child(
                S.documentTypeList('poem')
                  .title('Published Poems')
                  .filter('isPublic == true')
                  .apiVersion('2023-01-01')
                  .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
              ),
            S.listItem()
              .title('📄 Draft Poems')
              .child(
                S.documentTypeList('poem')
                  .title('Draft Poems')
                  .filter('isPublic == false')
                  .apiVersion('2023-01-01')
                  .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
              ),
            
            S.divider(),
            
            // Poems by Category (Dynamic)
            S.listItem()
              .title('📚 Poems by Category')
              .child(
                S.documentTypeList('category')
                  .title('Browse by Category')
                  .child((categoryId) =>
                    S.documentList()
                      .title('Poems in Category')
                      .filter('_type == "poem" && category._ref == $categoryId')
                      .params({ categoryId })
                      .apiVersion('2023-01-01')
                      .defaultOrdering([{field: 'orderInCategory', direction: 'asc'}, {field: 'publishedAt', direction: 'desc'}])
                  )
              ),
          ])
    }),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },
})
