import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { blogPosts, getAllCategories } from '@/data/blog'
import Header from '@/sections/Header'
import Footer from '@/sections/Footer'

// Blog placeholder
const BlogPlaceholder = () => (
  <div className="aspect-[16/10] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-100">
    <div className="text-center">
      <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
        <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6">
          <rect x="4" y="8" width="32" height="24" rx="2" fill="#D1D5DB" />
        </svg>
      </div>
      <p className="text-gray-400 text-xs">Image</p>
      <p className="text-gray-300 text-[10px]">800 × 500</p>
    </div>
  </div>
)

export default function BlogPage() {
  const [searchParams] = useSearchParams()
  const categories = getAllCategories()
  const selectedCategory = searchParams.get('category')
  
  // Фильтрация постов по категории
  const filteredPosts = selectedCategory
    ? blogPosts.filter(post => post.category.toLowerCase() === selectedCategory.toLowerCase())
    : blogPosts

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-[#FAFAF8]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <p className="text-sm tracking-[0.2em] uppercase text-gray-400 mb-4">
                Блог
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Всё о кофе
              </h1>
              <p className="text-gray-500 text-lg">
                Гайды, обучающие материалы, тренды и истории из мира кофе
              </p>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/blog"
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  !selectedCategory
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Все
              </Link>
              {categories.map(cat => (
                <Link
                  key={cat}
                  to={`/blog?category=${cat}`}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${
                    selectedCategory === cat
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-16">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">В этой категории пока нет публикаций</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/blog/${post.slug}`} className="group block">
                    <BlogPlaceholder />
                    <div className="mt-5">
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.date).toLocaleDateString('ru-RU')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors mb-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-500 line-clamp-2">{post.excerpt}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 mt-4 group-hover:gap-2 transition-all">
                        Читать далее
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
