import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield, FileText, Mail, Phone, Building } from 'lucide-react'
import Header from '@/sections/Header'
import Footer from '@/sections/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              На главную
            </Link>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-10 h-10 text-[#D95700]" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Политика конфиденциальности
              </h1>
            </div>
            <p className="text-gray-500">Последнее обновление: 15 января 2025 г.</p>
            <p className="text-gray-400 text-sm mt-2">В соответствии с Федеральным законом № 152-ФЗ «О персональных данных»</p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Section 1 */}
            <section className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#D95700]/10 rounded-full flex items-center justify-center text-[#D95700] text-sm font-bold">1</span>
                Общие положения
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
                <p>1.1. Настоящая Политика конфиденциальности персональных данных (далее — Политика) действует в отношении всей информации, которую Общество с ограниченной ответственностью «Аддис Кофе» (ИНН 7701234567, далее — Оператор или Компания) может получить о Пользователе во время использования сайта https://addis.coffee (далее — Сайт).</p>
                <p>1.2. Использование Сайта означает безоговорочное согласие Пользователя с настоящей Политикой и указанными в ней условиями обработки его персональных данных.</p>
                <p>1.3. В случае несогласия с условиями Политики Пользователь должен прекратить использование Сайта.</p>
                <p>1.4. Обработка персональных данных осуществляется в соответствии с:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных»</li>
                  <li>Гражданским кодексом Российской Федерации</li>
                  <li>Постановлением Правительства РФ от 01.11.2012 № 1119</li>
                  <li>Приказами Роскомнадзора</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#D95700]/10 rounded-full flex items-center justify-center text-[#D95700] text-sm font-bold">2</span>
                Персональные данные
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
                <p>2.1. Персональные данные — любая информация, относящаяся к прямо или косвенно определённому или определяемому физическому лицу (субъекту персональных данных).</p>
                <p>2.2. Оператор может обрабатывать следующие персональные данные Пользователя:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Фамилия, имя, отчество</li>
                  <li>Номер мобильного телефона</li>
                  <li>Адрес электронной почты (e-mail)</li>
                  <li>Адрес доставки заказа</li>
                  <li>История заказов и покупок</li>
                  <li>Данные о предпочтениях (для программ лояльности)</li>
                  <li>Для оптовых клиентов: ИНН, КПП, ОГРН, юридический адрес, банковские реквизиты</li>
                </ul>
                <p>2.3. Также на Сайте происходит сбор обезличенных данных о посетителях с помощью сервисов интернет-статистики (Яндекс Метрика, Google Analytics и других) с целью улучшения качества Сайта и проведения маркетинговых исследований.</p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#D95700]/10 rounded-full flex items-center justify-center text-[#D95700] text-sm font-bold">3</span>
                Цели обработки персональных данных
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
                <p>3.1. Оператор обрабатывает персональные данные Пользователя в следующих целях:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Оформление, выполнение и доставка заказов Пользователя</li>
                  <li>Идентификация Пользователя для входа в личный кабинет</li>
                  <li>Связь с Пользователем (подтверждение заказа, уточнение деталей доставки)</li>
                  <li>Информирование о статусе заказа</li>
                  <li>Обработка запросов и обращений в службу поддержки</li>
                  <li>Улучшение качества обслуживания и персонализация контента</li>
                  <li>Проведение маркетинговых акций и программ лояльности (с согласия)</li>
                  <li>Отправка информационных материалов о новинках и специальных предложениях (с согласия)</li>
                  <li>Выполнение требований законодательства РФ (включая хранение данных о сделках)</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#D95700]/10 rounded-full flex items-center justify-center text-[#D95700] text-sm font-bold">4</span>
                Правовые основания обработки
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
                <p>4.1. Обработка персональных данных осуществляется на следующих правовых основаниях:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Согласие субъекта персональных данных (при регистрации, оформлении заказа, подписке на рассылку)</li>
                  <li>Необходимость исполнения договора купли-продажи, стороной которого является субъект персональных данных</li>
                  <li>Исполнение законных обязанностей оператора (налоговый учёт, хранение первичной документации)</li>
                  <li>Осуществление прав и интересов оператора или третьих лиц (защита от мошенничества, обеспечение безопасности)</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#D95700]/10 rounded-full flex items-center justify-center text-[#D95700] text-sm font-bold">5</span>
                Права субъекта персональных данных
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
                <p>5.1. Пользователь имеет право:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Получать информацию об обработке своих персональных данных</li>
                  <li>Требовать уточнения, блокирования или уничтожения персональных данных, если они являются неполными, устаревшими, неточными, незаконно полученными или не являются необходимыми для заявленной цели обработки</li>
                  <li>Отозвать согласие на обработку персональных данных путём направления письменного заявления на адрес Оператора</li>
                  <li>Защищать свои права и законные интересы, в том числе требовать возмещения убытков и/или компенсации морального вреда в судебном порядке</li>
                  <li>Обжаловать действия или бездействие Оператора в уполномоченный орган по защите прав субъектов персональных данных (Роскомнадзор) или в судебном порядке</li>
                </ul>
                <p>5.2. Для реализации своих прав Пользователь может направить запрос на электронный адрес: <a href="mailto:privacy@addis.coffee" className="text-[#D95700] hover:underline">privacy@addis.coffee</a></p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#D95700]/10 rounded-full flex items-center justify-center text-[#D95700] text-sm font-bold">6</span>
                Меры защиты персональных данных
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
                <p>6.1. Оператор принимает необходимые и достаточные организационные и технические меры для защиты персональных данных от неправомерного доступа, уничтожения, изменения, блокирования, копирования, распространения, а также от иных неправомерных действий с ними третьих лиц.</p>
                <p>6.2. К таким мерам относятся:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Назначение ответственных за организацию обработки персональных данных</li>
                  <li>Применение сертифицированных средств защиты информации</li>
                  <li>Регулярное обучение сотрудников, работающих с персональными данными</li>
                  <li>Разграничение прав доступа к информационным системам</li>
                  <li>Резервное копирование данных</li>
                  <li>Использование защищённых каналов связи (HTTPS/SSL)</li>
                  <li>Хранение персональных данных на территории Российской Федерации</li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#D95700]/10 rounded-full flex items-center justify-center text-[#D95700] text-sm font-bold">7</span>
                Файлы Cookies
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
                <p>7.1. Сайт использует файлы cookies (куки) — небольшие текстовые файлы, которые сохраняются на устройстве Пользователя при посещении Сайта.</p>
                <p>7.2. Cookies используются для следующих целей:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Аутентификация Пользователя (сохранение сеанса входа)</li>
                  <li>Сохранение товаров в корзине покупок</li>
                  <li>Аналитика посещаемости и поведения Пользователей</li>
                  <li>Персонализация контента и рекомендаций</li>
                  <li>Маркетинговые исследования</li>
                </ul>
                <p>7.3. Пользователь может отключить использование cookies в настройках своего браузера. Однако это может привести к невозможности использования некоторых функций Сайта (например, добавление товаров в корзину, вход в личный кабинет).</p>
                <p>7.4. Сайт также может использовать сторонние сервисы аналитики (Яндекс Метрика, Google Analytics), которые устанавливают собственные cookies. Использование данных сервисов регулируется их политиками конфиденциальности.</p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#D95700]/10 rounded-full flex items-center justify-center text-[#D95700] text-sm font-bold">8</span>
                Передача персональных данных третьим лицам
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
                <p>8.1. Оператор не передаёт персональные данные Пользователя третьим лицам, за исключением случаев, когда:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Передача необходима для исполнения договора с Пользователем (курьерским службам для доставки, платёжным системам для обработки платежей)</li>
                  <li>Пользователь дал согласие на передачу данных конкретному третьему лицу</li>
                  <li>Передача предусмотрена федеральным законом (по запросу правоохранительных органов, судов, налоговых органов)</li>
                  <li>Передача осуществляется оператору, обрабатывающему данные по поручению Оператора (хостинг-провайдеры, CRM-системы, сервисы рассылок) при условии соблюдения ими конфиденциальности</li>
                </ul>
                <p>8.2. При передаче данных третьим лицам Оператор требует обеспечения конфиденциальности и безопасности персональных данных.</p>
              </div>
            </section>

            {/* Section 9 */}
            <section className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#D95700]/10 rounded-full flex items-center justify-center text-[#D95700] text-sm font-bold">9</span>
                Срок хранения персональных данных
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
                <p>9.1. Срок хранения персональных данных определяется целями обработки и требованиями законодательства РФ.</p>
                <p>9.2. Персональные данные хранятся:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>До момента отзыва согласия Пользователем</li>
                  <li>До достижения целей обработки</li>
                  <li>В течение срока, установленного законодательством РФ (например, 5 лет для первичной бухгалтерской документации согласно ФЗ № 402-ФЗ)</li>
                  <li>В течение срока исковой давности для защиты прав и законных интересов Оператора</li>
                </ul>
                <p>9.3. По истечении сроков хранения персональные данные подлежат уничтожению или обезличиванию.</p>
              </div>
            </section>

            {/* Section 10 */}
            <section className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#D95700]/10 rounded-full flex items-center justify-center text-[#D95700] text-sm font-bold">10</span>
                Изменения в Политике
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
                <p>10.1. Оператор оставляет за собой право вносить изменения в настоящую Политику конфиденциальности.</p>
                <p>10.2. Новая редакция Политики вступает в силу с момента её размещения на Сайте, если иное не предусмотрено новой редакцией.</p>
                <p>10.3. При существенных изменениях Оператор обязуется уведомить Пользователей путём размещения информации на главной странице Сайта или направления уведомления на электронный адрес Пользователя.</p>
                <p>10.4. Актуальная версия Политики всегда доступна по адресу: https://addis.coffee/privacy</p>
              </div>
            </section>

            {/* Section 11 - Contact Info */}
            <section className="bg-gradient-to-br from-[#D95700]/5 to-[#D95700]/10 rounded-xl p-6 border border-[#D95700]/20">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="w-6 h-6 text-[#D95700]" />
                Контактная информация Оператора
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
                <p>По всем вопросам, связанным с обработкой персональных данных, обращайтесь:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 text-[#D95700] mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">ООО «Аддис Кофе»</p>
                      <p className="text-sm">ИНН 7701234567 / КПП 770101001</p>
                      <p className="text-sm">ОГРН 1237700123456</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-[#D95700] mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Юридический адрес:</p>
                      <p className="text-sm">125009, г. Москва, ул. Примерная, д. 1, оф. 101</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#D95700] mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">E-mail для обращений:</p>
                      <a href="mailto:privacy@addis.coffee" className="text-sm text-[#D95700] hover:underline">privacy@addis.coffee</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#D95700] mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Телефон:</p>
                      <a href="tel:+79990000000" className="text-sm text-[#D95700] hover:underline">+7 (999) 000-00-00</a>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Обращения рассматриваются в течение 30 дней с момента получения в соответствии с ФЗ № 152-ФЗ.
                </p>
              </div>
            </section>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
