<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\ActivityTranslation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        $activities = [
            [
                'number' => 1,
                'domain' => 'digital-public-services',
                'en' => 'TA on the inventory/catalog of public services and feasibility study on digitizing priority services',
                'ru' => 'ТП по инвентаризации / каталогизации государственных услуг и технико-экономическое обоснование цифровизации приоритетных услуг',
                'tj' => 'Дастгирии техникӣ оид ба ҳисобрасӣ / каталоги (феҳрист) хизматрасониҳои давлатӣ ва асосноккунии техникӣ-иқтисодии рақамикунонии хизматрасониҳои афзалиятнок',
            ],
            [
                'number' => 2,
                'domain' => 'digital-public-services',
                'en' => 'Operationalization and upgrade of the public services portal, including a native mobile version of the portal',
                'ru' => 'Ввод в эксплуатацию и модернизация портала государственных услуг, включая его мобильную версию',
                'tj' => 'Истифода ва такмил додани портали хизматрасониҳои давлатӣ, аз ҷумла версияи мобилии ватании портал',
            ],
            [
                'number' => 3,
                'domain' => 'digital-public-services',
                'en' => 'TA to identify and develop an appropriate service digitalization model/methodology for Tajikistan including service standards and a roadmap for the digitalization process',
                'ru' => 'ТП по определению и разработке соответствующей модели / методологии цифровизации услуг для Таджикистана, включая стандарты услуг и дорожную карту для процесса цифровизации',
                'tj' => 'Дастгирии техникӣ оид ба муайян ва таҳия намудани модели / методологияи мувофиқи рақамикунонии хизматрасониҳо барои Тоҷикистон, аз ҷумла стандартҳои хизматрасонӣ ва харитаи роҳ барои раванди рақамикунонӣ',
            ],
            [
                'number' => 4,
                'domain' => 'digital-public-services',
                'en' => 'Strategic review of existing digitalization initiatives (their current maturity level and implementation roadmaps) in key economic and industrial sectors with the aim of preparing inputs for the registry of digital projects',
                'ru' => 'Стратегический обзор существующих инициатив по цифровизации (их текущего уровня зрелости и дорожных карт реализации) в ключевых отраслях экономики и промышленности с целью подготовки данных для реестра цифровых проектов',
                'tj' => 'Баррасии стратегии ташаббусҳои мавҷудаи рақамикунонӣ (сатҳи кунунии камолоти онҳо ва харитаҳои роҳ барои татбиқ) дар соҳаҳои калидии иқтисод ва саноат бо мақсади омода намудани маълумот барои феҳристи лоиҳаҳои рақамӣ',
            ],
            [
                'number' => 5,
                'domain' => 'digital-public-services',
                'en' => 'Digitalization of selected public services',
                'ru' => 'Цифровизация отдельных государственных услуг',
                'tj' => 'Рақамикунонии хизматрасониҳои алоҳидаи давлатӣ',
            ],
            [
                'number' => 6,
                'domain' => 'digital-public-services',
                'en' => 'Individual consultants to assist with the digitalization of selected public services',
                'ru' => 'Индивидуальные консультанты для оказания содействия в цифровизации отдельных государственных услуг',
                'tj' => 'Мушовирони инфиродӣ ҷиҳати мусоидат намудан дар рақамикунонии хизматрасониҳои алоҳидаи давлатӣ',
            ],
            [
                'number' => 7,
                'domain' => 'digital-infrastructure',
                'en' => 'Audit of existing IT systems in the GoTJ to identify mission-critical information systems required for seamless service provision and develop the terms of reference for an interoperability platform',
                'ru' => 'Аудит существующих ИТ-систем в ПРТ с целью выявления критически важных информационных систем, необходимых для бесперебойного предоставления услуг, и разработки технического задания для интероперабельной платформы',
                'tj' => 'Аудити низомҳои мавҷудаи ТИК дар ҲҶТ бо мақсади муайян намудани низомҳои иттилоотии ниҳоят муҳим, ки барои расонидани хизматрасониҳои мутасил заруранд, ҳамзамон таҳияи вазифаҳои техникӣ барои платформаи ҳамгироӣ (interoperability platform)',
            ],
            [
                'number' => 8,
                'domain' => 'digital-infrastructure',
                'en' => 'Development of the interoperability and data exchange platform',
                'ru' => 'Разработка интероперабельной платформы и обмена данными',
                'tj' => 'Таҳияи платформаи ҳамгироӣ ва мубодилаи маълумот',
            ],
            [
                'number' => 9,
                'domain' => 'digital-identity-payments',
                'en' => 'Feasibility study and terms of reference to develop BankID in Tajikistan',
                'ru' => 'Технико-экономическое обоснование и техническое задание для разработки банковского идентификатора в Таджикистане (BankID)',
                'tj' => 'Асосноккунии техникӣ-иқтисодӣ ва омода намудани вазифаҳои техникӣ барои таҳияи BankID дар Тоҷикистон',
            ],
            [
                'number' => 10,
                'domain' => 'digital-identity-payments',
                'en' => 'Development of BankID',
                'ru' => 'Разработка банковского идентификатора (BankID)',
                'tj' => 'Таҳияи BankID',
            ],
            [
                'number' => 11,
                'domain' => 'digital-identity-payments',
                'en' => 'Development of the digital authentication and e-signature platforms, including digital ID credentials and e-signature mechanisms (for example, Digital ID Wallet)',
                'ru' => 'Разработка платформ цифровой аутентификации и электронной подписи, включая цифровые удостоверения личности и механизмы электронной подписи (например, Digital ID Wallet)',
                'tj' => 'Таҳияи платформаҳои аутентификатсияи (мушаххаскунии) рақамӣ ва имзои электронӣ, аз ҷумла шиносномаҳои рақамӣ ва механизмҳои имзои электронӣ (масалан, Digital ID Wallet)',
            ],
            [
                'number' => 12,
                'domain' => 'digital-identity-payments',
                'en' => 'Assessment of the regulatory, financial, and technical feasibility of a unified payment gateway for P2G and B2G payments and development of technical specifications for such a gateway',
                'ru' => 'Оценка нормативной, финансовой и технической возможности создания единого платежного шлюза для платежей P2G и B2G и разработка технических спецификаций для такого шлюза',
                'tj' => 'Арзёбии меъёрӣ, молиявӣ ва имкониятҳои техникии таҳияи масири ягонаи пардохт барои пардохтҳои P2G ва B2G ва таҳияи мушаххасоти техникӣ барои чунин масир',
            ],
            [
                'number' => 13,
                'domain' => 'digital-identity-payments',
                'en' => 'Development of the payment gateway for P2G/B2G payments',
                'ru' => 'Разработка платежного шлюза для P2G/B2G платежей',
                'tj' => 'Таҳияи масири пардохт барои пардохтҳои P2G/B2G',
            ],
            [
                'number' => 14,
                'domain' => 'digital-infrastructure',
                'en' => 'Development of specifications for ICT equipment and supervision of its installation for SUE SC Data Center and NOC establishment',
                'ru' => 'Разработка спецификаций на ИКТ-оборудование и контроль за его установкой для ГУП «УГ» и создание Центра сетевых операций (ЦСО)',
                'tj' => 'Таҳияи мушаххасоти таҷҳизоти ТИК ва назорати насби он барои КВД "Шаҳри ҳӯшманд" ва эҷоди Маркази Амалиёти Шабакавӣ',
            ],
            [
                'number' => 15,
                'domain' => 'digital-infrastructure',
                'en' => 'Installation of hardware and software in selected primary and disaster recovery data centers, back-end government systems, and establishment of an NOC',
                'ru' => 'Установка аппаратного и программного обеспечения в отдельных основных центрах обработки данных и центрах аварийного восстановления данных, внутренних государственных системах и создание ЦСО',
                'tj' => 'Насби сахтафзор ва нармафзор дар марказҳои алоҳида ва эҳтиётии махзанҳои коркарди маълумот (ЦОД) дар низомҳои дохилии иттилоотии давлатӣ ва таъсиси Маркази Амалиёти Шабакавӣ',
            ],
            [
                'number' => 16,
                'domain' => 'digital-infrastructure',
                'en' => 'Installation of replacement and scale-up of hardware and software in selected primary and disaster recovery data centers, back-end government systems, and establishment of an NOC',
                'ru' => 'Установка заменяемого и расширяемого аппаратного и программного обеспечения в выбранных основных центрах обработки данных и центрах аварийного восстановления данных, внутренних правительственных системах и создание ЦСО',
                'tj' => 'Насб ва иваз намудани таҷҳизоти васеъшавандаи сахтафзор ва нармафзор дар марказҳои алоҳидаи асосии коркарди маълумот ва марказҳои барқарорсозии фавқулодаи маълумот, низомҳои эҳтиётии дохилии давлатӣ ва эҷоди Маркази Амалиёти Шабакавӣ',
            ],
            [
                'number' => 17,
                'domain' => 'digital-public-services',
                'en' => 'TA to develop interinstitutional interaction mechanisms, delivery channels, and GRMs for inclusive service delivery',
                'ru' => 'ТП по разработке механизмов межведомственного взаимодействия, каналов доставки и МРЖ для инклюзивного предоставления услуг',
                'tj' => 'Дастгирии техникӣ оид ба таҳияи механизмҳои ҳамкории байниидоравӣ, шабакаҳои расонидани хизматрасониҳо ва МБШ ҷиҳати таъмин намудани хизматрасониҳои фарогир',
            ],
            [
                'number' => 18,
                'domain' => 'digital-public-services',
                'en' => "Operationalization of a User Support Center and physical information kiosks 'InfoPoints' to provide technical support to service providers and beneficiaries",
                'ru' => "Ввод в эксплуатацию Центра поддержки пользователей и физических информационных киосков «Инфопункты» для оказания технической поддержки поставщикам услуг и бенефициарам",
                'tj' => "Ба истифода додани Маркази дастгирии истифодабарандагон ва киоскҳои иттилоотии ҷисмонӣ «Нуқтаҳои маълумот» барои расонидани дастгирии техникӣ ба таъминкунандагони хизматрасониҳо ва бенефитсиарҳо (Баҳрабарандагон)",
            ],
            [
                'number' => 19,
                'domain' => 'digital-skills',
                'en' => 'Design and implementation of a comprehensive human resource planning, including development of an ICT competency framework for the Government, planning of positions, drafting of job descriptions, and development and implementation of change management and training plans for targeted staff of relevant MDAs',
                'ru' => 'Разработка и внедрение комплексного планирования человеческих ресурсов, включая разработку системы компетенций в области ИКТ для правительства, планирование должностей, составление должностных инструкций, а также разработка и внедрение планов управления изменениями и обучения для целевого персонала соответствующих министерств, ведомств и агентств',
                'tj' => 'Таҳия ва ҷорӣ намудани банақшагирии фарогири захираҳои инсонӣ, аз ҷумла таҳияи низоми салоҳиятҳо дар соҳаи ТИК барои Ҳукумат, банақшагирии вазифаҳо, тартиб додани тавсифҳои вазифавӣ, инчунин таҳия ва ҷорӣ намудани нақшаҳои идоракунии тағйирот ва омӯзиш барои кормандони ҳадафноки вазоратҳо, идораҳо ва агентии дахлдор',
            ],
            [
                'number' => 20,
                'domain' => 'legal-governance',
                'en' => 'Comprehensive legal and regulatory review',
                'ru' => 'Всесторонний обзор нормативно-правовой базы',
                'tj' => 'Баррасии ҳамаҷонибани заминаҳои меъёриву ҳуқуқӣ',
            ],
            [
                'number' => 21,
                'domain' => 'legal-governance',
                'en' => 'TA to strengthen the legal, policy, and regulatory environment for data infrastructure and telecommunications',
                'ru' => 'ТП по укреплению правовой, политической и регуляторной среды для инфраструктуры данных и телекоммуникаций',
                'tj' => 'Дастгирии техникӣ оид ба тақвият бахшидани заминаи ҳуқуқӣ, сиёсӣ ва танзимкунандаи инфрасохтори маълумот ва телекоммуникатсия',
            ],
            [
                'number' => 22,
                'domain' => 'legal-governance',
                'en' => 'TA to strengthen the legal, policy, and regulatory framework for cybersecurity and data protection - Part 1',
                'ru' => 'ТП по укреплению правовой, политической и нормативной базы в области кибербезопасности и защиты данных - часть 1',
                'tj' => 'Дастгирии техникӣ оид ба тақвият бахшидани заминаи ҳуқуқӣ, сиёсӣ ва меъёрӣ дар самти бехатарии киберӣ ва ҳифзи маълумот – қисми 1',
            ],
            [
                'number' => 23,
                'domain' => 'legal-governance',
                'en' => 'TA to strengthen the legal, policy, and regulatory framework for cybersecurity and data protection - Part 2',
                'ru' => 'ТП по укреплению правовой, политической и нормативной базы в области кибербезопасности и защиты данных - Часть 2',
                'tj' => 'Дастгирии техникӣ оид ба тақвият бахшидани заминаи ҳуқуқӣ, сиёсӣ ва меъёрӣ дар самти бехатарии киберӣ ва ҳифзи маълумот – қисми 2',
            ],
            [
                'number' => 24,
                'domain' => 'cybersecurity',
                'en' => 'TA and acquisition of software and hardware for CSIRT',
                'ru' => 'ТП и закупка программного и аппаратного обеспечения для Группы реагирования на инциденты компьютерной (информационной) безопасности (CSIRT)',
                'tj' => 'Дастгирии техникӣ ва хариди нармафзор ва сахтафзор барои Гурӯҳи вокуниш ба ҳодисаҳои бехатарии иттилоот (Computer Security Incident Response Team) CSIRT',
            ],
            [
                'number' => 25,
                'domain' => 'cybersecurity',
                'en' => 'Capacity building on data governance, cybersecurity, telecoms regulation, and other digital safeguards and enablers',
                'ru' => 'Наращивание потенциала в области управления данными, кибербезопасности, регулирования телекоммуникаций и других средств цифровой защиты и способствующие факторы',
                'tj' => 'Баланд бардоштани иқтидори соҳаҳои идоракунии маълумот, бехатарии киберӣ, танзими телекоммуникатсия ва дигар воситаҳои ҳифзи рақамӣ ва омилҳои мусоидаткунанда',
            ],
            [
                'number' => 26,
                'domain' => 'digital-skills',
                'en' => 'Feasibility study on strengthening digital and IT skills and inclusion programs',
                'ru' => 'Технико-экономическое обоснование укрепления цифровых и ИТ-навыков, и инклюзивных программ',
                'tj' => 'Асосноккунии техникӣ-иқтисодӣ ҷиҳати тақвият бахшидани малакаҳои рақамӣ ва ТИК ва барномаҳои фарогир',
            ],
            [
                'number' => 27,
                'domain' => 'digital-skills',
                'en' => 'TA to advance digital skills through Edu 01 model for 500 IT specialists and advanced training for 2,000 individuals',
                'ru' => 'ТП по развитию цифровых навыков с помощью модели Edu 01 для 500 ИТ-специалистов и продвинутые курсы обучения для 2 000 человек',
                'tj' => 'Дастгирии техникӣ оид ба рушди малакаҳои рақамӣ тавассути модели Edu 01 барои 500 мутахассисони соҳаи ТИК ва курсҳои пешрафтаи омӯзишӣ барои 2 000 нафар',
            ],
            [
                'number' => 28,
                'domain' => 'digital-skills',
                'en' => 'Public campaign (at least 100 events) to raise awareness and educate the population about digital technologies and their role in everyday life, targeting youth, women, and rural population',
                'ru' => 'Общественная кампания (не менее 100 мероприятий) по повышению осведомленности и просвещению населения о цифровых технологиях и их роли в повседневной жизни, ориентированная на молодежь, женщин и сельское население',
                'tj' => 'Чорабиниҳои оммавӣ (на камтар аз 100 чорабинӣ) ҷиҳати баланд бардоштани огоҳӣ ва омӯзиши технологияҳои рақамӣ ва нақши онҳо дар ҳаёти ҳаррӯзаи аҳолӣ, ки ба ҷавонон, занон ва аҳолии деҳот нигаронида шудаанд',
            ],
            [
                'number' => 29,
                'domain' => 'digital-skills',
                'en' => 'TA to develop and conduct ICT courses targeting women',
                'ru' => 'ТП по разработке и проведению курсов ИКТ для женщин',
                'tj' => 'Дастгирии техникӣ оид ба таҳия ва баргузор намудани курсҳои ТИК барои занон',
            ],
            [
                'number' => 30,
                'domain' => 'school-connectivity',
                'en' => 'Feasibility study for school connectivity (financing plan, strategy, technical specification, and bidding documents)',
                'ru' => 'Технико-экономическое обоснование для подключения школ (план финансирования, стратегия, технические спецификации и тендерная документация)',
                'tj' => 'Асосноккунии техникӣ-иқтисодӣ барои пайваст намудани мактабҳо ба шабакаи ҷаҳонии интернет (нақшаи молиявӣ, стратегия, мушаххасоти техникӣ ва ҳуҷҷатҳои тендерӣ)',
            ],
            [
                'number' => 31,
                'domain' => 'school-connectivity',
                'en' => 'Expansion of school connectivity through provision of last-mile broadband connectivity based on a PPP model',
                'ru' => 'Расширение возможностей подключения школ за счет обеспечения широкополосной связи на конечном подключении («последняя миля») на основе модели ГЧП',
                'tj' => 'Васеъ намудани имкониятҳои пайвастшавии мактабҳо ба шабакаи ҷаҳонии интернет тавассути таъмин намудани алоқаи фарогир (broadband) дар нуқтаи охирин («охирон мил») дар асоси ҲДБХ (Ҳамкории Давлат ва Бахши Хусусӣ)',
            ],
            [
                'number' => 32,
                'domain' => 'school-connectivity',
                'en' => 'Expansion of school connectivity through provision of last-mile broadband connectivity based on a PPP model',
                'ru' => 'Расширение возможностей подключения школ за счет обеспечения широкополосной связи на конечном подключении («последняя миля») на основе модели ГЧП',
                'tj' => 'Васеъ намудани имкониятҳои пайвастшавии мактабҳо ба шабакаи ҷаҳонии интернет тавассути таъмин намудани алоқаи фарогир (broadband) дар нуқтаи охирин («охирон мил») дар асоси ҲДБХ (Ҳамкории Давлат ва Бахши Хусусӣ)',
            ],
            [
                'number' => 33,
                'domain' => 'school-connectivity',
                'en' => 'Provision to selected public schools of LAN connectivity (internal wiring) and necessary IT equipment for computer labs',
                'ru' => 'Предоставление отдельным государственным школам возможности подключения к локальной сети (внутренняя проводка) и необходимого ИТ-оборудования для компьютерных классов',
                'tj' => 'Фароҳам овардани имконияти пайвастшавӣ ба шабакаи ҷаҳонии интернет барои мактабҳои алоҳидаи давлатӣ тавассути шабакаи маҳаллӣ (ноқили дохилӣ) ва таҷҳизоти зарурии ТИК барои синфхонаҳои компютерӣ',
            ],
            [
                'number' => 34,
                'domain' => 'school-connectivity',
                'en' => 'Provision to selected public schools of LAN connectivity and necessary IT equipment for computer labs',
                'ru' => 'Предоставление отдельным государственным школам возможности подключения к локальной сети и необходимого ИТ-оборудования для компьютерных классов',
                'tj' => 'Фароҳам овардани имконияти пайвастшавӣ ба шабакаи ҷаҳонии интернет барои мактабҳои алоҳидаи давлатӣ тавассути шабакаи маҳаллӣ (ноқили дохилӣ) ва таҷҳизоти зарурии ТИК барои синфхонаҳои компютерӣ',
            ],
        ];

        foreach ($activities as $data) {
            $baseSlug = Str::slug($data['en']);
            // Truncate to keep slugs manageable
            $slug = Str::limit($baseSlug, 80, '') . '-' . $data['number'];

            $activity = Activity::query()->updateOrCreate(
                ['activity_number' => $data['number']],
                [
                    'slug' => $slug,
                    'status' => 'in_progress',
                    'domain_slug' => $data['domain'],
                    'start_date' => null,
                    'end_date' => null,
                    'featured_image' => null,
                    'created_by' => null,
                ]
            );

            foreach (['en', 'ru', 'tj'] as $lang) {
                ActivityTranslation::query()->updateOrCreate(
                    ['activity_id' => $activity->id, 'language' => $lang],
                    ['title' => $data[$lang], 'description' => null, 'objectives' => null]
                );
            }
        }
    }
}
