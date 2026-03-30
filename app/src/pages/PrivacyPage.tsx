import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield, FileText, CheckCircle } from 'lucide-react'
import Header from '@/sections/Header'
import Footer from '@/sections/Footer'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Политика конфиденциальности и публичная оферта
            </h1>
            <p className="text-gray-500">
              Последнее обновление: 31 марта 2025 г.
            </p>
          </motion.div>

          {/* Quick Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-lg">Защита данных</CardTitle>
                </div>
                <CardDescription>
                  Соответствие 152-ФЗ «О персональных данных»
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Шифрование данных по протоколу HTTPS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Хранение данных на территории РФ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Регулярные проверки безопасности</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">Публичная оферта</CardTitle>
                </div>
                <CardDescription>
                  Договор купли-продажи дистанционным способом
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Соответствие ГК РФ (ст. 437, 494)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Защита прав потребителей (ст. 26.1)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Правила дистанционной торговли</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Политика конфиденциальности */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              1. Политика конфиденциальности
            </h2>

            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1.1. Общие положения</h3>
                <p className="mb-3">
                  1.1.1. Настоящая Политика конфиденциальности персональных данных (далее — Политика) 
                  действует в отношении всей информации, которую Общество с ограниченной ответственностью 
                  «Аддис Кофе» (ИНН: ________, ОГРН: ________, адрес: ______________), 
                  расположенное на сайте в сети Интернет по адресу: <strong>addis.coffee</strong> 
                  (далее — Сайт), может получить о Пользователе во время использования Сайта.
                </p>
                <p className="mb-3">
                  1.1.2. Использование Сайта означает безоговорочное согласие Пользователя с настоящей 
                  Политикой и указанными в ней условиями обработки его персональных данных.
                </p>
                <p>
                  1.1.3. В случае несогласия с условиями Политики конфиденциальности Пользователь должен 
                  прекратить использование Сайта.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  1.2. Персональные данные, подлежащие обработке
                </h3>
                <p className="mb-3">
                  1.2.1. Компания обрабатывает следующие персональные данные Пользователей:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-3 ml-4">
                  <li>Фамилия, имя, отчество</li>
                  <li>Контактный телефон</li>
                  <li>Адрес электронной почты (e-mail)</li>
                  <li>Адрес доставки заказа</li>
                  <li>История заказов и покупок</li>
                  <li>Данные о предпочтениях и интересах</li>
                  <li>IP-адрес, информация из cookies, данные о браузере</li>
                </ul>
                <p>
                  1.2.2. Обработка специальных категорий персональных данных (раса, национальность, 
                  политические взгляды, религиозные убеждения и т.п.) не осуществляется.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  1.3. Цели обработки персональных данных
                </h3>
                <p className="mb-3">
                  1.3.1. Компания обрабатывает персональные данные Пользователей в следующих целях:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-3 ml-4">
                  <li>Регистрация и идентификация Пользователя на Сайте</li>
                  <li>Оформление и выполнение заказов на покупку товаров</li>
                  <li>Доставка товаров и координация с курьерскими службами</li>
                  <li>Связь с Пользователем (подтверждение заказа, уточнение деталей)</li>
                  <li>Улучшение качества обслуживания и персонализация контента</li>
                  <li>Отправка информационных и рекламных материалов (при наличии согласия)</li>
                  <li>Проведение маркетинговых и социологических исследований</li>
                  <li>Защита прав и законных интересов Компании</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  1.4. Правовые основания обработки
                </h3>
                <p className="mb-3">
                  1.4.1. Обработка персональных данных осуществляется на следующих правовых основаниях:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-3 ml-4">
                  <li>Согласие субъекта персональных данных (ст. 6 152-ФЗ)</li>
                  <li>Необходимость исполнения договора, стороной которого является субъект</li>
                  <li>Исполнение законных обязанностей оператора (в т.ч. налоговое законодательство)</li>
                  <li>Осуществление прав и законных интересов оператора или третьих лиц</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  1.5. Права субъекта персональных данных
                </h3>
                <p className="mb-3">
                  1.5.1. Пользователь имеет право:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-3 ml-4">
                  <li>Получать информацию об обработке своих персональных данных</li>
                  <li>Требовать уточнения, блокирования или уничтожения персональных данных</li>
                  <li>Отозвать согласие на обработку персональных данных</li>
                  <li>Требовать прекращения обработки персональных данных</li>
                  <li>Обжаловать действия оператора в уполномоченный орган (Роскомнадзор)</li>
                  <li>Защищать свои права и законные интересы, в том числе в судебном порядке</li>
                </ul>
                <p>
                  1.5.2. Для реализации своих прав Пользователь может направить запрос по электронной 
                  почте: <strong>privacy@addis.coffee</strong> или почтовому адресу Компании.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  1.6. Меры защиты персональных данных
                </h3>
                <p className="mb-3">
                  1.6.1. Компания принимает необходимые и достаточные организационные и технические меры 
                  для защиты персональных данных от неправомерного доступа, уничтожения, изменения, 
                  блокирования, копирования, распространения, а также от иных неправомерных действий 
                  третьих лиц:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-3 ml-4">
                  <li>Использование шифрования данных (протокол HTTPS/SSL)</li>
                  <li>Регулярное резервное копирование данных</li>
                  <li>Применение средств антивирусной защиты</li>
                  <li>Ограничение доступа сотрудников к персональным данным</li>
                  <li>Хранение персональных данных на серверах, расположенных на территории РФ</li>
                  <li>Регулярный аудит систем безопасности</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  1.7. Использование файлов Cookies
                </h3>
                <p className="mb-3">
                  1.7.1. Сайт использует файлы cookies для улучшения работы Сайта, персонализации 
                  контента, анализа посещаемости и показа релевантной рекламы.
                </p>
                <p className="mb-3">
                  1.7.2. Cookies — это небольшие текстовые файлы, которые сохраняются на устройстве 
                  Пользователя при посещении Сайта.
                </p>
                <p className="mb-3">
                  1.7.3. Пользователь может отключить использование cookies в настройках своего браузера. 
                  Однако это может повлиять на работоспособность некоторых функций Сайта.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  1.8. Изменения в Политике конфиденциальности
                </h3>
                <p className="mb-3">
                  1.8.1. Компания оставляет за собой право вносить изменения в настоящую Политику 
                  конфиденциальности.
                </p>
                <p>
                  1.8.2. Новая редакция Политики вступает в силу с момента её размещения на Сайте, 
                  если иное не предусмотрено новой редакцией.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Публичная оферта */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              2. Публичная оферта
            </h2>

            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2.1. Общие положения</h3>
                <p className="mb-3">
                  2.1.1. Настоящий документ является публичной офертой (официальным предложением) 
                  ООО «Аддис Кофе» заключить договор купли-продажи товаров дистанционным способом 
                  на условиях, указанных ниже (далее — Договор).
                </p>
                <p className="mb-3">
                  2.1.2. В соответствии с п. 2 ст. 437 Гражданского кодекса РФ, в случае принятия 
                  условий оферты (акцепта) физическое лицо, оформившее заказ на Сайте, становится 
                  Покупателем.
                </p>
                <p>
                  2.1.3. Полная и безоговорочная акцептация оферты осуществляется Покупателем путём 
                  оформления заказа на Сайте и оплаты выбранных товаров.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2.2. Предмет оферты</h3>
                <p className="mb-3">
                  2.2.1. Продавец обязуется передать в собственность Покупателя товар, выбранный и 
                  оплаченный Покупателем, а Покупатель обязуется принять и оплатить товар на условиях 
                  настоящего Договора.
                </p>
                <p className="mb-3">
                  2.2.2. Наименование, количество, ассортимент, цена товара указываются в заказе 
                  Покупателя, оформленном на Сайте.
                </p>
                <p>
                  2.2.3. Продавец оставляет за собой право вносить изменения в ассортимент товаров, 
                  цены и условия доставки в одностороннем порядке. Изменения вступают в силу с момента 
                  их публикации на Сайте.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2.3. Порядок оформления заказа</h3>
                <p className="mb-3">
                  2.3.1. Заказ оформляется Покупателем на Сайте путём:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-3 ml-4">
                  <li>Регистрации на Сайте (введение ФИО, телефона, e-mail)</li>
                  <li>Выбора товаров и добавления их в корзину</li>
                  <li>Заполнения формы заказа (адрес доставки, способ оплаты, комментарии)</li>
                  <li>Подтверждения заказа (нажатие кнопки «Оформить заказ» или аналогичной)</li>
                </ul>
                <p className="mb-3">
                  2.3.2. После оформления заказа Покупатель получает подтверждение на указанный 
                  адрес электронной почты или по телефону.
                </p>
                <p>
                  2.3.3. Момент заключения Договора — получение Покупателем подтверждения заказа от 
                  Продавца.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2.4. Цены и оплата</h3>
                <p className="mb-3">
                  2.4.1. Цены на товары указаны на Сайте в рублях Российской Федерации (₽).
                </p>
                <p className="mb-3">
                  2.4.2. Оплата товаров производится следующими способами:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-3 ml-4">
                  <li>Банковской картой онлайн на Сайте</li>
                  <li>При получении заказа (наличными или картой курьеру)</li>
                  <li>Безналичный расчёт для юридических лиц</li>
                </ul>
                <p>
                  2.4.3. Обязательство Покупателя по оплате считается исполненным с момента 
                  поступления денежных средств на счёт Продавца.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2.5. Доставка товаров</h3>
                <p className="mb-3">
                  2.5.1. Доставка товаров осуществляется курьерской службой Продавца или партнёрскими 
                  службами доставки.
                </p>
                <p className="mb-3">
                  2.5.2. Сроки и стоимость доставки зависят от адреса Покупателя и выбранного способа 
                  доставки, указываются при оформлении заказа.
                </p>
                <p className="mb-3">
                  2.5.3. При получении заказа Покупатель обязан проверить внешний вид товара, 
                  комплектность и соответствие заказу.
                </p>
                <p>
                  2.5.4. Риск случайной гибели или повреждения товара переходит к Покупателю с момента 
                  передачи товара.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  2.6. Возврат и обмен товаров
                </h3>
                <p className="mb-3">
                  2.6.1. Покупатель вправе отказаться от товара в любое время до его передачи, а после 
                  передачи — в течение 7 дней (ст. 26.1 ФЗ «О защите прав потребителей»).
                </p>
                <p className="mb-3">
                  2.6.2. Возврат товара надлежащего качества возможен в случае, если сохранены:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-3 ml-4">
                  <li>Товарный вид и потребительские свойства</li>
                  <li>Пломбы, фабричные ярлыки, упаковка</li>
                  <li>Кассовый или товарный чек</li>
                </ul>
                <p className="mb-3">
                  2.6.3. Возврат товаров надлежащего качества, изготовленных на заказ, не возможен 
                  (п. 4 ст. 26.1 ФЗ «О защите прав потребителей»).
                </p>
                <p className="mb-3">
                  2.6.4. При отказе от товара Продавец возвращает денежные средства в течение 
                  10 дней с момента получения возврата, за вычетом расходов на доставку.
                </p>
                <p>
                  2.6.5. В случае выявления недостатков товара Покупатель вправе требовать:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-3 ml-4">
                  <li>Замены на товар аналогичной марки</li>
                  <li>Соразмерного уменьшения цены</li>
                  <li>Безвозмездного устранения недостатков</li>
                  <li>Возврата уплаченной суммы</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2.7. Ответственность сторон</h3>
                <p className="mb-3">
                  2.7.1. За неисполнение или ненадлежащее исполнение обязательств по Договору стороны 
                  несут ответственность в соответствии с законодательством РФ.
                </p>
                <p>
                  2.7.2. Продавец не несёт ответственности за неисполнение обязательств, если это 
                  вызвано обстоятельствами непреодолимой силы (форс-мажор).
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2.8. Разрешение споров</h3>
                <p className="mb-3">
                  2.8.1. Все споры и разногласия разрешаются путём переговоров.
                </p>
                <p className="mb-3">
                  2.8.2. При недостижении согласия спор передаётся на рассмотрение в суд по месту 
                  нахождения Продавца или Покупателя (по выбору Покупателя).
                </p>
                <p>
                  2.8.3. К отношениям между Продавцом и Покупателем применяется законодательство 
                  Российской Федерации.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2.9. Реквизиты Продавца</h3>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <p className="mb-2"><strong>ООО «Аддис Кофе»</strong></p>
                  <p className="mb-2">ИНН: _______________</p>
                  <p className="mb-2">ОГРН: _______________</p>
                  <p className="mb-2">КПП: _______________</p>
                  <p className="mb-2">Юридический адрес: _____________________________</p>
                  <p className="mb-2">Почтовый адрес: _______________________________</p>
                  <p className="mb-2">Телефон: +7 (___) ___-__-__</p>
                  <p className="mb-2">E-mail: info@addis.coffee</p>
                  <p>Режим работы: Пн-Пт 9:00-18:00 (МСК)</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Acceptance notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-blue-50 rounded-xl p-6 border border-blue-100"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Принятие условий оферты
            </h3>
            <p className="text-blue-800">
              Оформляя заказ на сайте <strong>addis.coffee</strong>, вы подтверждаете, что:
            </p>
            <ul className="mt-3 space-y-2 text-blue-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Ознакомились и полностью принимаете условия настоящей оферты</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Согласны на обработку персональных данных в соответствии с политикой конфиденциальности</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Обладаете всеми необходимыми правами и дееспособностью для заключения договора</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
