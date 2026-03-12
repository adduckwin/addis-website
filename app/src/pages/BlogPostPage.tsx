import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, User, Tag } from 'lucide-react'
import { getBlogPostBySlug, blogPosts } from '@/data/blog'
import Header from '@/sections/Header'
import Footer from '@/sections/Footer'

// Blog placeholder
const BlogPlaceholder = () => (
  <div className="aspect-[21/9] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border border-gray-100">
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-xl flex items-center justify-center">
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <rect x="4" y="8" width="32" height="24" rx="2" fill="#D1D5DB" />
        </svg>
      </div>
      <p className="text-gray-400 text-sm">Article Image</p>
      <p className="text-gray-300 text-xs mt-1">1200 × 500 px</p>
    </div>
  </div>
)

// Related posts
const RelatedPosts = ({ currentSlug }: { currentSlug: string }) => {
  const related = blogPosts
    .filter(p => p.slug !== currentSlug)
    .slice(0, 2)

  return (
    <section className="py-16 bg-[#FAFAF8]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Читать далее</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {related.map(post => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="aspect-[16/10] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6">
                      <rect x="4" y="8" width="32" height="24" rx="2" fill="#D1D5DB" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-xs">Image</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-sm mb-2">{post.category}</p>
                <h3 className="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                  {post.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getBlogPostBySlug(slug) : undefined

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-32 pb-20">
          <div className="max-w-[1400px] mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Статья не найдена</h1>
            <p className="text-gray-500 mb-8">Запрашиваемая статья не существует</p>
            <Link to="/blog">
              <button className="px-6 py-3 bg-gray-900 text-white rounded-full">
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Вернуться в блог
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        {/* Breadcrumbs */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-gray-600">Главная</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-gray-600">Блог</Link>
            <span>/</span>
            <span className="text-gray-900">{post.title}</span>
          </nav>
        </div>

        {/* Header */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full mb-6">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>
            <p className="text-xl text-gray-500 mb-8">{post.excerpt}</p>
            
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString('ru-RU')}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
          </motion.div>
        </section>

        {/* Featured Image */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <BlogPlaceholder />
          </motion.div>
        </section>

        {/* Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            {/* Render content as preformatted for template */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
              <p className="text-gray-400 text-sm mb-4">Содержимое статьи (шаблон):</p>
              <pre className="text-gray-600 text-sm whitespace-pre-wrap font-mono">
                {post.content}
              </pre>
            </div>
          </motion.article>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Теги:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <div className="mt-16">
          <RelatedPosts currentSlug={post.slug} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
