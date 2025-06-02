import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'poem',
  title: 'Poem',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
      name: 'category',
      title: 'Poetry Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (Rule) => Rule.required(),
      description: 'Choose which category this poem belongs to'
    }),
    defineField({
      name: 'orderInCategory',
      title: 'Order in Category',
      type: 'number',
      description: 'Order of this poem within its category (1 = first, 2 = second, etc.)',
      validation: (Rule) => Rule.min(1).integer(),
    }),
    defineField({
      name: 'content',
      title: 'Poem Content',
      type: 'text',
      rows: 10,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'isPublic',
      title: 'Public',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'A brief description or first few lines of the poem',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'featuredImage',
      content: 'content',
      category: 'category.title',
      orderInCategory: 'orderInCategory',
    },
    prepare(selection) {
      const {author, content, category, orderInCategory} = selection
      const excerpt = content ? content.substring(0, 50) + '...' : ''
      const orderText = orderInCategory ? `#${orderInCategory} ` : ''
      return {
        ...selection, 
        subtitle: `${category ? `[${category}] ` : ''}${orderText}${author ? `by ${author} • ` : ''}${excerpt}`
      }
    },
  },

  orderings: [
    {
      title: 'Order in Category',
      name: 'orderInCategory',
      by: [
        {field: 'orderInCategory', direction: 'asc'}
      ]
    },
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [
        {field: 'publishedAt', direction: 'desc'}
      ]
    },
    {
      title: 'Published Date, Old',
      name: 'publishedAtAsc',
      by: [
        {field: 'publishedAt', direction: 'asc'}
      ]
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [
        {field: 'title', direction: 'asc'}
      ]
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [
        {field: 'category.title', direction: 'asc'}
      ]
    },
  ]
}) 