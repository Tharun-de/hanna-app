import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      description: 'Main heading displayed on the homepage',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Site Subtitle',
      type: 'text',
      rows: 3,
      description: 'Subtitle/tagline displayed under the main heading',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 4,
      description: 'Brief description of the website for SEO and about sections',
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        defineField({
          name: 'twitter',
          title: 'Twitter URL',
          type: 'url',
          description: 'Your Twitter profile URL (e.g., https://twitter.com/username)',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
          description: 'Your Instagram profile URL (e.g., https://instagram.com/username)',
        }),
        defineField({
          name: 'snapchat',
          title: 'Snapchat URL',
          type: 'url',
          description: 'Your Snapchat profile URL or link',
        }),
      ],
    }),
    defineField({
      name: 'authorInfo',
      title: 'Author Information',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'Author Name',
          type: 'string',
          description: 'Name displayed in footer and about sections',
        }),
        defineField({
          name: 'bio',
          title: 'Author Bio',
          type: 'text',
          rows: 4,
          description: 'Short biography of the author',
        }),
        defineField({
          name: 'profileImage',
          title: 'Profile Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          description: 'Author profile photo',
        }),
      ],
    }),
    defineField({
      name: 'theme',
      title: 'Site Theme',
      type: 'object',
      fields: [
        defineField({
          name: 'primaryColor',
          title: 'Primary Color',
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
          initialValue: 'purple',
        }),
        defineField({
          name: 'backgroundImage',
          title: 'Hero Background Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          description: 'Background image for the main header section',
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
    },
    prepare(selection) {
      const {title, subtitle} = selection
      return {
        title: title || 'Site Settings',
        subtitle: subtitle || 'Configure your website settings',
      }
    },
  },
}) 