export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  date: string
  readTime: string
  image: string
  tags: string[]
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'kak-vybrat-kofe-dlya-kofeyni',
    title: 'Как выбрать кофе для кофейни: полное руководство',
    excerpt: 'Разбираемся в ассортиментной матрице, профилях обжарки и ценообразовании. На что обратить внимание при выборе поставщика.',
    content: 'TEMPLATE: Полное руководство по выбору кофе для кофейни. Разделы: определение концепции, ассортиментная матрица, профили обжарки, ценообразование, выбор поставщика.',
    category: 'Бизнес',
    author: 'Команда Addis',
    date: '2025-01-15',
    readTime: '8 мин',
    image: '/images/blog-placeholder.jpg',
    tags: ['HoReCa', 'Выбор кофе', 'Бизнес'],
  },
  {
    id: '2',
    slug: 'chto-takoe-kapping',
    title: 'Что такое каппинг и зачем он нужен',
    excerpt: 'Профессиональная дегустация кофе: методология, таблицы оценки, как научиться различать вкусы.',
    content: 'TEMPLATE: Руководство по каппингу. Разделы: что такое каппинг, процесс, этапы оценки, шкала SCA, как научиться, зачем нужен кофейне.',
    category: 'Образование',
    author: 'Команда Addis',
    date: '2025-01-10',
    readTime: '6 мин',
    image: '/images/blog-placeholder.jpg',
    tags: ['Каппинг', 'SCA', 'Дегустация'],
  },
  {
    id: '3',
    slug: 'raznitsa-mezhdu-arabikoy-i-robustoy',
    title: 'Разница между арабикой и робустой',
    excerpt: 'Подробный разбор двух основных видов кофе: характеристики, вкус, применение в смесях.',
    content: 'TEMPLATE: Сравнение арабики и робусты. Разделы: характеристики арабики, характеристики робусты, смеси, как выбрать.',
    category: 'Образование',
    author: 'Команда Addis',
    date: '2025-01-05',
    readTime: '5 мин',
    image: '/images/blog-placeholder.jpg',
    tags: ['Арабика', 'Робуста', 'Сорта кофе'],
  },
  {
    id: '4',
    slug: 'kak-hranit-kofe-pravilno',
    title: 'Как хранить кофе правильно: советы от профи',
    excerpt: 'Сроки годности, оптимальные условия хранения, распространённые ошибки. Как сохранить свежесть зёрен.',
    content: 'TEMPLATE: Руководство по хранению кофе. Разделы: враги свежести, оптимальные условия, сроки годности, распространённые ошибки.',
    category: 'Советы',
    author: 'Команда Addis',
    date: '2024-12-28',
    readTime: '4 мин',
    image: '/images/blog-placeholder.jpg',
    tags: ['Хранение', 'Свежесть', 'Советы'],
  },
  {
    id: '5',
    slug: 'obzharka-kofe-vidy-i-profi',
    title: 'Обжарка кофе: виды и профили',
    excerpt: 'От светлой до тёмной: как обжарка влияет на вкус. Разбираемся в профилях и степенях прожарки.',
    content: 'TEMPLATE: Руководство по обжарке кофе. Разделы: как работает обжарка, степени обжарки (Light, Medium, Dark), профили обжарки, как выбрать профиль.',
    category: 'Образование',
    author: 'Команда Addis',
    date: '2024-12-20',
    readTime: '7 мин',
    image: '/images/blog-placeholder.jpg',
    tags: ['Обжарка', 'Профили', 'Roasting'],
  },
  {
    id: '6',
    slug: 'kemeks-vs-v60',
    title: 'Кемекс vs V60: какой метод выбрать',
    excerpt: 'Сравнение двух популярных методов заваривания: особенности, вкус, сложность приготовления.',
    content: 'TEMPLATE: Сравнение Chemex и V60. Разделы: конструкция V60, конструкция Chemex, сравнение параметров, что выбрать, профессиональный совет.',
    category: 'Методы',
    author: 'Команда Addis',
    date: '2024-12-15',
    readTime: '5 мин',
    image: '/images/blog-placeholder.jpg',
    tags: ['V60', 'Chemex', 'Pour-over', 'Альтернатива'],
  },
  {
    id: '7',
    slug: 'kofeynaya-karta-mira',
    title: 'Кофейная карта мира: откуда приходит ваш кофе',
    excerpt: 'Обзор основных кофейных регионов: Бразилия, Эфиопия, Колумбия, Кения и другие. Особенности каждого региона.',
    content: 'TEMPLATE: Обзор кофейных регионов мира. Разделы: Южная Америка (Бразилия, Колумбия, Перу), Африка (Эфиопия, Кения, Руанда), Азия (Индонезия, Вьетнам, Йемен), Центральная Америка.',
    category: 'Образование',
    author: 'Команда Addis',
    date: '2024-12-10',
    readTime: '10 мин',
    image: '/images/blog-placeholder.jpg',
    tags: ['Регионы', 'География', 'Терруар'],
  },
  {
    id: '8',
    slug: 'obrabotka-kofe-metody',
    title: 'Обработка кофе: washed, natural, honey',
    excerpt: 'Как способ обработки влияет на вкус. Разбираем три основных метода и их вариации.',
    content: 'TEMPLATE: Руководство по обработке кофе. Разделы: зачем обрабатывать, Washed, Natural, Honey (вариации), экспериментальные методы, как выбрать.',
    category: 'Образование',
    author: 'Команда Addis',
    date: '2024-12-05',
    readTime: '8 мин',
    image: '/images/blog-placeholder.jpg',
    tags: ['Обработка', 'Washed', 'Natural', 'Honey'],
  },
  {
    id: '9',
    slug: 'kak-prigotovit-idealnyy-espresso',
    title: 'Как приготовить идеальный эспрессо дома',
    excerpt: 'Пошаговое руководство: помол, дозировка, темпинг, экстракция. Советы для домашнего бариста.',
    content: 'TEMPLATE: Руководство по приготовлению эспрессо. Разделы: необходимое оборудование, помол, дозировка, темпинг, экстракция, решение проблем, рецепты на основе эспрессо.',
    category: 'Методы',
    author: 'Команда Addis',
    date: '2024-11-28',
    readTime: '6 мин',
    image: '/images/blog-placeholder.jpg',
    tags: ['Эспрессо', 'Приготовление', 'Дома'],
  },
  {
    id: '10',
    slug: 'kofeinaya-kultura-v-rossii',
    title: 'Кофейная культура в России: тренды 2025',
    excerpt: 'Как развивается рынок specialty coffee в России. Тренды, вызовы и перспективы.',
    content: 'TEMPLATE: Обзор кофейной культуры в России. Разделы: состояние рынка, тренды 2025, вызовы индустрии, перспективы, прогнозы.',
    category: 'Тренды',
    author: 'Команда Addis',
    date: '2024-11-20',
    readTime: '7 мин',
    image: '/images/blog-placeholder.jpg',
    tags: ['Тренды', 'Россия', 'Рынок', '2025'],
  },
  {
    id: '11',
    slug: 'kak-chitat-etiketku-kofe',
    title: 'Как читать этикетку кофе: полный гид',
    excerpt: 'Разбираемся в обозначениях на упаковке: страна, регион, сорт, обработка, обжарка.',
    content: 'TEMPLATE: Руководство по чтению этикетки кофе. Разделы: основные элементы (страна, регион, высота, сорт, обработка, обжарка, дата, Q-Grade), красные флаги, пример хорошей этикетки.',
    category: 'Образование',
    author: 'Команда Addis',
    date: '2024-11-15',
    readTime: '6 мин',
    image: '/images/blog-placeholder.jpg',
    tags: ['Этикетка', 'Информация', 'Выбор'],
  },
  {
    id: '12',
    slug: 'kofein-i-zdorove',
    title: 'Кофеин и здоровье: мифы и факты',
    excerpt: 'Научный взгляд на влияние кофеина на организм. Суточная норма, польза и вред.',
    content: 'TEMPLATE: Научный обзор влияния кофеина на здоровье. Разделы: что такое кофеин, суточная норма, польза (доказанная), побочные эффекты, мифы, как оптимизировать потребление.',
    category: 'Здоровье',
    author: 'Команда Addis',
    date: '2024-11-10',
    readTime: '7 мин',
    image: '/images/blog-placeholder.jpg',
    tags: ['Кофеин', 'Здоровье', 'Наука'],
  },
  {
    id: '13',
    slug: 'latte-art-dlya-nachinayushchih',
    title: 'Latte Art для начинающих: с чего начать',
    excerpt: 'Базовые техники рисования на кофе: сердечко, розетта, тюльпан. Пошаговое обучение.',
    content: 'TEMPLATE: Руководство по Latte Art для начинающих. Разделы: необходимое оборудование, подготовка молока, базовые узоры (сердечко, розетта, тюльпан), распространённые ошибки, упражнения, продвинутые техники.',
    category: 'Мастерство',
    author: 'Команда Addis',
    date: '2024-11-05',
    readTime: '8 мин',
    image: '/images/blog-placeholder.jpg',
    tags: ['Latte Art', 'Обучение', 'Молоко'],
  },
  {
    id: '14',
    slug: 'kak-otkryt-kofeynu-s-nulya',
    title: 'Как открыть кофейню с нуля: бизнес-план',
    excerpt: 'Пошаговое руководство по запуску кофейни: от идеи до первых клиентов. Инвестиции, локация, оборудование.',
    content: 'TEMPLATE: Бизнес-план открытия кофейни. Разделы: этапы открытия (концепция, бизнес-план, локация, оборудование, меню, персонал, маркетинг), инвестиции, точка безубыточности, первые 90 дней, ошибки начинающих.',
    category: 'Бизнес',
    author: 'Команда Addis',
    date: '2024-11-01',
    readTime: '12 мин',
    image: '/images/blog-placeholder.jpg',
    tags: ['Бизнес', 'Кофейня', 'Стартап'],
  },
  {
    id: '15',
    slug: 'degaustatsiya-kofe-dom',
    title: 'Дегустация кофе дома: организуем каппинг',
    excerpt: 'Как провести профессиональную дегустацию кофе дома. Необходимое оборудование, методология, таблицы.',
    content: 'TEMPLATE: Руководство по домашнему каппингу. Разделы: необходимое оборудование, подготовка, процесс каппинга, что оценивать, домашняя шкала оценки, практические советы, шаблон таблицы, онлайн-ресурсы.',
    category: 'Образование',
    author: 'Команда Addis',
    date: '2024-10-28',
    readTime: '9 мин',
    image: '/images/blog-placeholder.jpg',
    tags: ['Каппинг', 'Дегустация', 'Дома'],
  },
]

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(p => p.slug === slug)
}

export const getBlogPostsByCategory = (category: string): BlogPost[] => {
  return blogPosts.filter(p => p.category === category)
}

export const getRecentPosts = (count: number = 3): BlogPost[] => {
  return blogPosts.slice(0, count)
}

export const getAllCategories = (): string[] => {
  return [...new Set(blogPosts.map(p => p.category))]
}
