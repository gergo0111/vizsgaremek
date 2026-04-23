# Vizsgaremek - Tesztelési Stratégia és Dokumentáció

## 📋 Áttekintés

Ez a dokumentum ismerteti a Vizsgaremek projekt teljes körű tesztelési stratégiáját, amely egy NestJS backend és React TypeScript frontend alkalmazásra vonatkozik. A projekt **Vitest** keretrendszert használ mindkét platformon, a frontend pedig **React Testing Library** (RTL) segítségével tesztel komponenseket.

## 🎯 Tesztelési Célok

- ✅ **100% branch coverage** a kritikus service és utility függvényekre
- ✅ **Teljes E2E teszt** a controller végpontokra
- ✅ **UI komponens tesztek** a frontend felhasználói felülethez
- ✅ **API utility és auth teszt** a library függvényekre
- ✅ **Mock-based teszt** minden külső függőségre (API, adatbázis, navegáció)

## 📊 Jelenlegi Teszt Statisztika

### Backend (NestJS)
- **Test Files**: 12 passed
- **Tests**: 111 passed
- **Coverage**: 
  - Statements: 91.14%
  - Branch: 84.88%
  - Functions: 97.95%
  - Lines: 92.02%

### Frontend (React)
- **Test Files**: 5 passed
- **Tests**: 69 passed
- **Coverage**:
  - Statements: 99.18%
  - Branch: 75.71%
  - Functions: 100%
  - Lines: 100%

## 🏗️ Projekt Szerkezet

### Backend Tesztek

```
backend/src/
├── user/
│   ├── user.service.spec.ts       (20 tests) - UserService unit tesztek
│   └── user.controller.spec.ts    (11 tests) - UserController E2E tesztek
├── auth/
│   ├── auth.service.spec.ts       (7 tests)  - AuthService unit tesztek
│   └── auth.controller.spec.ts    (6 tests)  - AuthController E2E tesztek
├── eszkoz/
│   ├── eszkoz.service.spec.ts     (9 tests)  - EszkozService unit tesztek
│   └── eszkoz.controller.spec.ts  (8 tests)  - EszkozController E2E tesztek
├── feladat/
│   ├── feladat.service.spec.ts    (9 tests)  - FeladatService unit tesztek
│   └── feladat.controller.spec.ts (7 tests)  - FeladatController E2E tesztek
├── comment/
│   ├── comment.service.spec.ts    (9 tests)  - CommentService unit tesztek
│   └── comment.controller.spec.ts (7 tests)  - CommentController E2E tesztek
└── munka/
    ├── munka.service.spec.ts      (10 tests) - MunkaService unit tesztek
    └── munka.controller.spec.ts   (8 tests)  - MunkaController E2E tesztek
```

### Frontend Tesztek

```
frontend/src/
├── components/
│   ├── Login.test.tsx             (10 tests) - Login komponens tesztek
│   ├── MainSite.test.tsx          (4 tests)  - MainSite komponens tesztek
│   └── DeletedItems.test.tsx      (13 tests) - DeletedItems komponens tesztek
└── lib/
    ├── api.test.ts               (18 tests) - API utility tesztek
    └── auth.test.ts              (24 tests) - Auth utility tesztek
```

## 🔧 Backend Tesztelési Minta

### UserService Teszt Minta

```typescript
describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  const mockPrismaUser = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const mockPrisma = {
    user: mockPrismaUser,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    prismaService = mockPrisma as any;
    userService = new UserService(prismaService);
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { user_id: 1, felhasznalonev: 'user1' },
        { user_id: 2, felhasznalonev: 'user2' },
      ];

      mockPrismaUser.findMany.mockResolvedValue(mockUsers);
      const result = await userService.findAll();

      expect(mockPrismaUser.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });
});
```

### UserController Teszt Minta

```typescript
describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: vi.fn(),
            findOne: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { user_id: 1, felhasznalonev: 'user1' },
      ];

      (userService.findAll as any).mockResolvedValue(mockUsers);
      const result = await userController.findAll();

      expect(result).toEqual(mockUsers);
    });
  });
});
```

## 🎨 Frontend Tesztelési Minta

### Login Komponens Teszt Minta

```typescript
describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (window as any).fetch = vi.fn();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  describe('Rendering', () => {
    it('should render the login form', () => {
      renderLogin();
      
      expect(screen.getByText('Bejelentkezés')).toBeInTheDocument();
      expect(screen.getByLabelText(/Felhasználónév/i)).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should handle successful login', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          message: 'Sikeres bejelentkezés',
          user: { user_id: 1, token: 'test-token' },
        }),
      };

      ((window as any).fetch as any).mockResolvedValueOnce(mockResponse);

      renderLogin();
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/Felhasználónév/i), 'testuser');
      await user.type(screen.getByLabelText(/Jelszó/i), 'password123');
      await user.click(screen.getByRole('button', { name: /Belépés/i }));

      await waitFor(() => {
        expect((window as any).fetch).toHaveBeenCalledWith(
          'http://localhost:3000/users/login',
          expect.any(Object)
        );
      });
    });
  });
});
```

### API Utility Teszt Minta

```typescript
describe('API Utilities', () => {
  beforeEach(() => {
    (window as any).fetch = vi.fn();
    (window as any).localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
  });

  describe('apiGet', () => {
    it('should fetch data successfully', async () => {
      const mockData = { id: 1, name: 'Test' };
      ((window as any).fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiGet('/test');

      expect((window as any).fetch).toHaveBeenCalledWith(
        'http://localhost:3000/test',
        expect.any(Object)
      );
      expect(result).toEqual(mockData);
    });
  });
});
```

## 🚀 Tesztek Futtatása

### Backend Tesztek

```bash
# Összes backend teszt futtatása
cd backend
npm test -- --run

# Egy specifikus teszt fájl futtatása
npm test -- src/user/user.service.spec.ts --run

# Coverage report generálása
npm run test:cov -- --run

# Watch mód (fejlesztéshez)
npm test
```

### Frontend Tesztek

```bash
# Összes frontend teszt futtatása
cd frontend
npm test -- --run

# Egy specifikus teszt futtatása
npm test -- src/components/Login.test.tsx --run

# Coverage report generálása
npm run test:cov -- --run

# Vitest UI megnyitása (interaktív)
npm run test:ui

# Watch mód
npm test
```

## 🧪 Teszt Típusok és Leírásuk

### Unit Tesztek (Backend)

**Cél**: Egy service metódus funkcionalitásának tesztelése

**Minta**: `UserService.findAll()` -> PrismaService mock-kal

**Assertions**:
- Hogy a PrismaService megfelelő paraméterekkel lett meghívva
- Hogy az eredmény megfelelő típusú és struktúrájú

### E2E / Controller Tesztek (Backend)

**Cél**: HTTP endpoint teljes funkcionalitásának tesztelése

**Minta**: `POST /users/login` -> UserService mock-kal

**Assertions**:
- Hogy az endpoint megfelelő HTTP statust ad vissza
- Hogy az UserService megfelelő metódusa lett meghívva
- Hogy az válasz JSON helyes struktúrájú

### Komponens Tesztek (Frontend)

**Cél**: React komponens felhasználói interakciójának tesztelése

**Minta**: `Login` komponens -> Form kitöltés, bejelentkezés

**Assertions**:
- Hogy a komponens helyesen renderelődik
- Hogy az input mező frissül a felhasználói bemenet alapján
- Hogy a form submit triggereli az API hívást

### Utility / Hook Tesztek (Frontend)

**Cél**: Utility függvény (API, Auth) működésének tesztelése

**Minta**: `apiGet()` function -> fetch mock-kal

**Assertions**:
- Hogy a fetch megfelelő paraméterekkel lett meghívva
- Hogy az Authorization header helyesen van-e beállítva
- Hogy az error handling működik

## 🔐 Mock-olási Stratégia

### Backend Mock-ok

1. **PrismaService Mock**
   - Minden Prisma metódus (findMany, findUnique, create, update, delete) mock-olva
   - `vi.fn()` használatával egyedi return értékek állíthatók be

2. **bcrypt Mock**
   - `bcrypt.hash()` és `bcrypt.compare()` mock-olva
   - Jelszó hash-elés teszteléséhez

3. **JWT Mock**
   - Token generálás és verifikálás mock-olva

### Frontend Mock-ok

1. **Fetch API Mock**
   - `window.fetch` globálisan mock-olva
   - `mockResolvedValueOnce()` és `mockRejectedValueOnce()` támogatás

2. **React Router Mock**
   - `useNavigate()` hook mock-olva
   - `useParams()` mock-olva az URL paraméterekhez

3. **localStorage Mock**
   - `getItem()`, `setItem()`, `removeItem()` mock-olva
   - User token és adatok teszteléséhez

4. **API Mock-ok**
   - `apiGet()`, `apiPatch()`, `apiPost()`, `apiDelete()` mock-olva
   - API hívások szimulálásához

## 📈 Coverage Célok és Jelenlegi Állapot

### Backend Coverage

| Metrika | Cél | Jelenlegi |
|---------|-----|-----------|
| Statements | 85%+ | 91.14% ✅ |
| Branches | 80%+ | 84.88% ✅ |
| Functions | 85%+ | 97.95% ✅ |
| Lines | 85%+ | 92.02% ✅ |

### Frontend Coverage

| Metrika | Cél | Jelenlegi |
|---------|-----|-----------|
| Statements | 80%+ | 99.18% ✅ |
| Branches | 70%+ | 75.71% ✅ |
| Functions | 80%+ | 100% ✅ |
| Lines | 80%+ | 100% ✅ |

## 🎓 Best Practices

### 1. Test Naming
```typescript
// ✅ Jó
describe('LoginComponent', () => {
  it('should display error message when login fails', () => {
    // test body
  });
});

// ❌ Rossz
describe('LoginComponent', () => {
  it('test login', () => {
    // test body
  });
});
```

### 2. Setup és Cleanup
```typescript
beforeEach(() => {
  vi.clearAllMocks();      // Mock-ok törlése
  // Reset state
});

afterEach(() => {
  vi.restoreAllMocks();    // Teljes restore
});
```

### 3. Assertion Best Practices
```typescript
// ✅ Specifikus assertions
expect(userService.findAll).toHaveBeenCalledWith({ where: { active: true } });
expect(result).toEqual(expectedData);

// ❌ Túl általános
expect(userService.findAll).toHaveBeenCalled();
```

### 4. Test Isolation
```typescript
// ✅ Független tesztek
it('should create user', () => {
  // Create user independently
});

it('should find created user', () => {
  // Don't depend on previous test
});

// ❌ Függő tesztek
// Test 1 hoz létre egy usert
// Test 2 azt feltételezi, hogy test 1 már futott
```

## 🐛 Debugging Tesztek

### Backend Debug

```bash
# Node debugger indítása
node --inspect-brk ./node_modules/.bin/vitest

# Vitest debug mode
npm test -- --inspect-brk
```

### Frontend Debug

```bash
# Vitest UI megnyitása debug céllal
npm run test:ui

# Console.log debugginghoz
npm test (watch mode)
```

## 📚 Hasznos Referenciák

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Docs](https://testing-library.com/react)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [jest-dom Matchers](https://github.com/testing-library/jest-dom)

## 🔄 Continuous Integration

A project felkészült CI/CD integrációra:

```yaml
# Lehetséges GitHub Actions workflow
- name: Run Backend Tests
  run: cd backend && npm test -- --run

- name: Run Frontend Tests
  run: cd frontend && npm test -- --run

- name: Generate Coverage
  run: |
    cd backend && npm run test:cov -- --run
    cd ../frontend && npm run test:cov -- --run
```

## 📝 Jövőbeli Fejlesztések

1. **E2E Tesztek Playwright-tal**
   - Teljes user journey tesztelése

2. **Performance Tesztek**
   - API válasz idő mérése
   - Component renderelési teljesítmény

3. **Visual Regression Tesztek**
   - Screenshot összehasonlítás

4. **Mutation Testing**
   - Teszt minőség mérése

---

**Utolsó frissítés**: 2026. április 22.  
