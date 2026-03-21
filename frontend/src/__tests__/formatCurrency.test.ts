import { formatCurrency } from '@/lib/formatCurrency'

describe('formatCurrency', () => {

    it('форматирует целое число как рубли', () => {
        expect(formatCurrency(1000)).toBe('1\u00a0000\u00a0₽')
    })

    it('форматирует ноль', () => {
        expect(formatCurrency(0)).toBe('0\u00a0₽')
    })

    it('округляет дробную часть (maximumFractionDigits: 0)', () => {
        expect(formatCurrency(1000.6)).toBe('1\u00a0001\u00a0₽')
        expect(formatCurrency(1000.4)).toBe('1\u00a0000\u00a0₽')
    })

    it('форматирует отрицательное число', () => {
        expect(formatCurrency(-500)).toBe('-500\u00a0₽')
    })

    it('форматирует большое число с разделителями тысяч', () => {
        expect(formatCurrency(1234567)).toBe('1\u00a0234\u00a0567\u00a0₽')
    })
})
