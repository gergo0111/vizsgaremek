import { beforeAll, afterEach, afterAll, vi } from 'vitest';

process.env.DATABASE_URL = 'mysql://test:test@localhost:3306/test_db';
process.env.JWT_SECRET = 'test-secret-key';

beforeAll(() => {
});

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {

});
