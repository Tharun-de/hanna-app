import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: 'duuor2ba',
  dataset: 'hanna',
  useCdn: false, // Disable CDN for development to avoid CORS issues
  apiVersion: '2023-05-03', // Use a stable API version
  token: '', // No token needed for public read access
})

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(client)

// Then we like to make a simple function like this that gives the
// builder an image and returns the builder for you to specify additional
// parameters:
export function urlFor(source: any) {
  return builder.image(source)
}

// GROQ query for site settings
export const siteSettingsQuery = `*[_type == "siteSettings" && _id == "siteSettings"][0] {
  _id,
  title,
  subtitle,
  description,
  socialMedia,
  authorInfo,
  theme
}`

// GROQ queries for categories
export const categoriesQuery = `*[_type == "category" && isVisible == true] | order(order asc) {
  _id,
  title,
  slug,
  description,
  color,
  icon,
  order,
  isVisible
}`

// GROQ queries for poems with category information
export const poemsQuery = `*[_type == "poem" && isPublic == true] | order(category->order asc, orderInCategory asc, publishedAt desc) {
  _id,
  title,
  slug,
  content,
  author,
  tags,
  excerpt,
  publishedAt,
  orderInCategory,
  featuredImage,
  category->{
    _id,
    title,
    slug,
    color,
    icon,
    order
  }
}`

export const poemBySlugQuery = `*[_type == "poem" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  content,
  author,
  tags,
  excerpt,
  publishedAt,
  orderInCategory,
  featuredImage,
  isPublic,
  category->{
    _id,
    title,
    slug,
    color,
    icon,
    order
  }
}`

export const allPoemsQuery = `*[_type == "poem"] | order(category->order asc, orderInCategory asc, publishedAt desc) {
  _id,
  title,
  slug,
  content,
  author,
  tags,
  excerpt,
  publishedAt,
  orderInCategory,
  featuredImage,
  isPublic,
  category->{
    _id,
    title,
    slug,
    color,
    icon,
    order
  }
}`

// Query poems by category
export const poemsByCategoryQuery = `*[_type == "poem" && isPublic == true && category._ref == $categoryId] | order(orderInCategory asc, publishedAt desc) {
  _id,
  title,
  slug,
  content,
  author,
  tags,
  excerpt,
  publishedAt,
  orderInCategory,
  featuredImage
}`

// Types for TypeScript
export interface SiteSettings {
  _id: string
  title: string
  subtitle: string
  description?: string
  socialMedia?: {
    twitter?: string
    instagram?: string
    snapchat?: string
  }
  authorInfo?: {
    name?: string
    bio?: string
    profileImage?: any
  }
  theme?: {
    primaryColor?: 'purple' | 'blue' | 'rose' | 'amber' | 'emerald' | 'red'
    backgroundImage?: any
  }
}

export interface Category {
  _id: string
  title: string
  slug: {
    current: string
  }
  description?: string
  color: 'purple' | 'blue' | 'rose' | 'amber' | 'emerald' | 'red'
  icon: string
  order: number
  isVisible: boolean
}

export interface Poem {
  _id: string
  title: string
  slug: {
    current: string
  }
  content: string
  author: string
  tags?: string[]
  excerpt?: string
  publishedAt: string
  orderInCategory?: number
  featuredImage?: any
  isPublic: boolean
  category?: {
    _id: string
    title: string
    slug: {
      current: string
    }
    color: string
    icon: string
    order?: number
  }
} 