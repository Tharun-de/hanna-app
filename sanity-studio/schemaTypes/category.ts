import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Poetry Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'The name of your poetry category (e.g., "Love Poems", "Nature", "Reflections")'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of this category'
    }),
    defineField({
      name: 'color',
      title: 'Category Color',
      type: 'string',
      options: {
        list: [
          {title: 'Purple', value: 'purple'},
          {title: 'Blue', value: 'blue'},
          {title: 'Rose', value: 'rose'},
          {title: 'Amber', value: 'amber'},
          {title: 'Emerald', value: 'emerald'},
          {title: 'Red', value: 'red'},
        ],
        layout: 'radio'
      },
      initialValue: 'purple'
    }),
    defineField({
      name: 'icon',
      title: 'Category Icon',
      type: 'string',
      options: {
        list: [
          {title: '🖋️ Feather', value: 'Feather'},
          {title: '💝 Heart', value: 'Heart'},
          {title: '⭐ Star', value: 'Star'},
          {title: '✨ Sparkles', value: 'Sparkles'},
          {title: '🔥 Fire', value: 'Fire'},
          {title: '📚 Book', value: 'BookOpen'},
        ],
        layout: 'radio'
      },
      initialValue: 'Feather'
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
      description: 'Categories will be sorted by this number (lowest first)'
    }),
    defineField({
      name: 'isVisible',
      title: 'Visible on Website',
      type: 'boolean',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      description: 'description',
      order: 'order',
    },
    prepare(selection) {
      const {title, description, order} = selection
      return {
        title,
        subtitle: `Order: ${order} • ${description || 'No description'}`
      }
    },
  },

  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [
        {field: 'order', direction: 'asc'}
      ]
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [
        {field: 'title', direction: 'asc'}
      ]
    },
  ]
})
