import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

//limpiar después de cada test
afterEach(() => {
    cleanup();
});

