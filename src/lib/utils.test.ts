import { describe, it, expect } from 'vitest';
import { cn } from './utils';

//test para verificar que la función cn se comporta correctamente cuando se le pasan varias clases de tailwind
describe('cn utility', () => {
  //test para verificar que las clases se fusionan correctamente
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  //test para verificar que las clases condicionales se manejan correctamente
  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  //test para verificar que las clases de tailwind se fusionan correctamente
  it('should merge tailwind classes', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });
});

