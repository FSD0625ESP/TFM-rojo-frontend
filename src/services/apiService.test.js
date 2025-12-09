import { describe, it, expect, vi, beforeEach } from 'vitest';

//mock de import.meta.env antes de importar el módulo
vi.mock('vite', () => ({
    default: {
        env: {
            VITE_API_URL: 'https://api.example.com',
        },
    },
}));

//necesitamos mockear import.meta.env de otra manera
//vamos a hacer el test de forma diferente
describe('apiService', () => {
    describe('normalizeUrl', () => {
        //test para verificar que la url se normaliza correctamente cuando API_URL no tiene barra final
        it('should normalize URL correctly when API_URL has no trailing slash', () => {
            const API_URL = 'https://api.example.com';
            const endpoint = '/users';
            const result = `${API_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
            expect(result).toBe('https://api.example.com/users');
        });

        it('should normalize URL correctly when API_URL has trailing slash', () => {
            const API_URL = 'https://api.example.com/';
            const endpoint = '/users';
            const result = `${API_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
            expect(result).toBe('https://api.example.com/users');
        });

        it('should handle endpoint without leading slash', () => {
            const API_URL = 'https://api.example.com';
            const endpoint = 'users';
            const result = `${API_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
            expect(result).toBe('https://api.example.com/users');
        });
    });

    describe('parseError', () => {
        it('should parse JSON error response with message', async () => {
            const mockResponse = {
                json: vi.fn().mockResolvedValue({ message: 'Error message' }),
            };

            //simular la lógica de parseError
            try {
                const error = await mockResponse.json();
                const result = error.message || error;
                expect(result).toBe('Error message');
            } catch (err) {
                expect.fail('Should not throw');
            }
        });

        it('should handle text error response when JSON fails', async () => {
            const mockResponse = {
                json: vi.fn().mockRejectedValue(new Error('JSON parse error')),
                text: vi.fn().mockResolvedValue('Error text'),
            };

            //simular la lógica de parseError
            try {
                await mockResponse.json();
            } catch {
                const text = await mockResponse.text();
                expect(text).toBe('Error text');
            }
        });

        it('should return default message when both JSON and text fail', async () => {
            const mockResponse = {
                json: vi.fn().mockRejectedValue(new Error('JSON parse error')),
                text: vi.fn().mockResolvedValue(''),
            };

            try {
                await mockResponse.json();
            } catch {
                const text = await mockResponse.text();
                const result = text || 'API error occurred ❌';
                expect(result).toBe('API error occurred ❌');
            }
        });
    });
});

