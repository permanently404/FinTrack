import type { Metadata } from 'next'
import { Card } from '@/components/ui/Card'
import { Header } from '@/components/layout/Header'

export const metadata: Metadata = {
    title: 'Советы — FinTrack',
    description: 'Советы по управлению личными финансами',
}

const BUDGET_RULES = [
    {
        title: 'Правило 50/30/20',
        description: 'Разделяй доход на три части: 50% на необходимое (жильё, еда, транспорт), 30% на желания (развлечения, покупки), 20% на сбережения и погашение долгов.',
    },
    {
        title: 'Подушка безопасности',
        description: 'Накопи 3–6 месячных расходов на непредвиденные ситуации. Храни на отдельном счёте, к которому не будешь прикасаться без необходимости.',
    },
    {
        title: 'Правило 24 часов',
        description: 'Перед крупной незапланированной покупкой подожди сутки. Если через 24 часа всё ещё хочешь купить — покупай. Большинство импульсивных желаний проходят.',
    },
    {
        title: 'Плати себе первому',
        description: 'Сразу после получения дохода откладывай фиксированный процент на сбережения. Не жди «что останется» — обычно не остаётся ничего.',
    },
]

const CATEGORIES = [
    { name: 'Еда', icon: '🍕', tip: 'Планируй меню на неделю и покупай по списку. Это сокращает расходы на еду на 20–30%.' },
    { name: 'Транспорт', icon: '🚗', tip: 'Сравни стоимость личного авто с общественным транспортом. Часто проездной выгоднее.' },
    { name: 'Развлечения', icon: '🎬', tip: 'Установи лимит на развлечения в месяц. Ищи бесплатные альтернативы: парки, бесплатные мероприятия.' },
    { name: 'Здоровье', icon: '💊', tip: 'Не экономь на здоровье — профилактика дешевле лечения. Оформи ДМС, если работодатель не предоставляет.' },
    { name: 'Покупки', icon: '🛍️', tip: 'Веди вишлист. Покупай по списку, а не по настроению. Используй кэшбэк и ожидай скидок на дорогие товары.' },
    { name: 'Зарплата', icon: '💰', tip: 'Автоматизируй: настрой автоперевод части зарплаты на накопительный счёт в день получения.' },
]

const MISTAKES = [
    'Не вести учёт расходов (ты уже это исправил!)',
    'Жить от зарплаты до зарплаты без подушки безопасности',
    'Брать кредиты на то, что обесценивается (гаджеты, одежда)',
    'Игнорировать мелкие расходы — кофе за 200₽/день = 73 000₽/год',
    'Откладывать инвестирование «на потом» — время работает на тебя через сложный процент',
]

export default function TipsPage() {
    return (
        <div className="min-h-full flex flex-col p-4 md:p-6 gap-4 md:gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-xl md:text-2xl font-bold text-foreground">Советы по финансам</h1>
                <Header />
            </div>

            <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">Основные правила</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {BUDGET_RULES.map((rule) => (
                        <Card key={rule.title} className="p-4">
                            <h3 className="font-semibold text-foreground mb-2">{rule.title}</h3>
                            <p className="text-sm text-muted leading-relaxed">{rule.description}</p>
                        </Card>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">Советы по категориям</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {CATEGORIES.map((cat) => (
                        <Card key={cat.name} className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">{cat.icon}</span>
                                <h3 className="font-semibold text-foreground">{cat.name}</h3>
                            </div>
                            <p className="text-sm text-muted leading-relaxed">{cat.tip}</p>
                        </Card>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">Частые ошибки</h2>
                <Card className="p-4">
                    <ul className="space-y-2">
                        {MISTAKES.map((mistake, i) => (
                            <li key={i} className="flex gap-2 text-sm text-muted">
                                <span className="text-red-500 flex-shrink-0">✗</span>
                                <span>{mistake}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            </section>
        </div>
    )
}
