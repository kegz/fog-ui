import { validationRules } from '../validation';

test('required rule', () => {
	expect(validationRules.required('')).toBe('This field is required.');
	expect(validationRules.required(null)).toBe('This field is required.');
	expect(validationRules.required('ok')).toBeNull();
});

test('email rule', () => {
	expect(validationRules.email('')).toBeNull();
	expect(validationRules.email('notanemail')).toBe('Invalid email address.');
	expect(validationRules.email('a@b.com')).toBeNull();
});

test('minLength and maxLength', () => {
	expect(validationRules.minLength('abc', 5)).toBe('Must be at least 5 characters.');
	expect(validationRules.maxLength('abcdef', 4)).toBe('Must be fewer than 4 characters.');
	expect(validationRules.minLength('', 2)).toBeNull();
});

test('numberRange rule', () => {
	expect(validationRules.numberRange('x' as any, 1, 5)).toBe('Must be a number.');
	expect(validationRules.numberRange(0 as any, 1, 5)).toBe('Must be at least 1.');
	expect(validationRules.numberRange(10 as any, 1, 5)).toBe('Must be no more than 5.');
	expect(validationRules.numberRange(3 as any, 1, 5)).toBeNull();
});
