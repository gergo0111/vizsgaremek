# Vizsgaremek - Tesztelési Útmutató

## 🎯 Bevezetés

Ez az útmutató segít megérteni a Vizsgaremek projekt tesztelési infrastruktúráját.
## 📚 Alapfogalmak

### Mock - Az Eljátszás Technikája

Mock azt jelenti: "úgy teszünk, mintha ez az érték lenne az igazi." Miért? Mert az igazi dolgok lassúak vagy nem működnek teszt közben.

**Valódi adatbázis nélkül (amit nem akarunk):**
```
Teszt → Kapcsolódás az adatbázishoz → Lekérdezés → 5 másodperc → Válasz
```

**Mock-al (amit csinálunk):**
```
Teszt → Mock objektum → Előre beállított válasz → 1 ezredmásodperc → Teszt vége
```

## 🔧 Backend Tesztelés

### Hogyan működik?

A backend (szerver oldali kód) tesztelésének 2 szintje van:

#### 1. Unit Tesztek - Service tesztek

Egy-egy függvényt tesztelünk izoláltan. Például a "felhasználó létrehozása" függvény.

```typescript
describe('UserService', () => {
  describe('create', () => {
    it('Létre kell hozni egy felhasználót jelszóval', async () => {
      // 1. ELŐKÉSZÍTÉS: Mit szeretnénk tesztelni?
      const input = {
        felhasznalonev: 'testuser',
        email: 'test@example.com',
        jelszo: 'password123'
      };

      // 2. MOCK-OLJUK AZ ADATBÁZIST
      // Azt mondjuk: amikor lekérdeznek az adatbázisból,
      // ezt az objektumot add vissza
      mockDatabase.create.mockResolvedValue({
        user_id: 1,
        felhasznalonev: 'testuser',
        email: 'test@example.com',
        jelszo: 'hashed_password' // jelszó titkosítva
      });

      // 3. FUTTATJUK A KÓDOT
      const result = await userService.create(input);

      // 4. ELLENŐRZÉS - működik-e helyesen?
      expect(result.user_id).toBe(1);
      expect(result.jelszo).not.toBe('password123'); // Jelszó titkosítva van
    });
  });
});
```

**Mi történik itt?**
- Szimulálunk egy felhasználó-létrehozási műveletet
- Ellenőrizzük, hogy a jelszó titkosítva van
- Megnézzük, hogy az ID helyesen lett-e hozzárendelve

**Előny**: Gyors, konkrét, könnyű debuggolni
**Hátránya**: Csak az egy funkcióra vonatkozik, nem az integrációra

#### 2. E2E/Integrációs Tesztek - Controller tesztek

Az egész lánc működését tesztelünk. Például: HTTP kérés → controller → service → adatbázis → válasz

```typescript
describe('UserController', () => {
  describe('POST /users', () => {
    it('Létre kell hozni egy felhasználót HTTP-n keresztül', async () => {
      // 1. ADATOK, amit a felhasználó küld
      const createUserDto = {
        felhasznalonev: 'john',
        email: 'john@example.com',
        jelszo: 'password'
      };

      // 2. MOCK-OLJUK A SERVICE-T
      mockUserService.create.mockResolvedValue({
        user_id: 1,
        ...createUserDto
      });

      // 3. MEGHÍVJUK A CONTROLLER METÓDUST
      const response = await controller.create(createUserDto);

      // 4. ELLENŐRZÉS
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
      expect(response.user_id).toBe(1);
    });
  });
});
```

**Mi történik itt?**
- Szimulálunk egy HTTP POST kérést
- A controller feldolgozza az adatokat
- Meghívja a service-t
- Megnézzük, hogy helyesen történt-e

### Backend Tesztek Futtatása

```bash
cd backend

# Összes teszt futtatása
npm test -- --run

# Coverage report (hány % tesztelve?)
npm run test:cov -- --run

# Fejlesztés közben (automatikus újra fut)
npm test
```

## 🎨 Frontend Tesztelés

### Hogyan működik?

A frontend tesztelése azt vizsgálja, hogy:
- A komponensek helyesen jelennek-e meg
- A felhasználó interakcióira helyesen reagál a rendszer
- Az API hívások helyesen történnek

### Komponens Teszt - Login Oldal

```typescript
describe('Login Component', () => {
  it('Sikeresen beléphet a felhasználó', async () => {
    // 1. RENDERELJÜK A KOMPONENST
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // 2. KERESSÜK MEG AZ INPUTOKAT
    const usernameInput = screen.getByLabelText(/Felhasználónév/i);
    const passwordInput = screen.getByLabelText(/Jelszó/i);
    const loginButton = screen.getByRole('button', { name: /Belépés/i });

    // 3. SZIMULÁLUNK FELHASZNÁLÓI INTERAKCIÓT
    const user = userEvent.setup();
    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');

    // 4. MOCK-OLJUK AZ API VÁLASZT
    (window as any).fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        user: { user_id: 1, felhasznalonev: 'testuser' },
        token: 'test-token'
      })
    });

    // 5. KATTINTUNK A GOMBRA
    await user.click(loginButton);

    // 6. ELLENŐRZÉS - helyesen lett-e meghívva az API?
    expect(window.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/users/login',
      expect.objectContaining({
        method: 'POST'
      })
    );
  });
});
```

**Mi történik itt?**
- Megjelenítsük a Login komponenst
- Beírunk felhasználónevet és jelszót
- Lenyomjuk a Belépés gombot
- Megnézzük, hogy az API helyesen lett-e meghívva

### Utility Teszt - API Függvény

```typescript
describe('API Utils', () => {
  it('GET kérés helyesen működik', async () => {
    // 1. MOCK-OLJUK AZ API-T
    (window as any).fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, name: 'User' })
    });

    // 2. MEGHÍVJUK AZ API GET FÜGGVÉNYT
    const result = await apiGet('/users');

    // 3. ELLENŐRZÉS
    expect(window.fetch).toHaveBeenCalledWith('http://localhost:3000/users');
    expect(result).toEqual({ id: 1, name: 'User' });
  });

  it('Hibás válasz esetén hibát dob', async () => {
    // 1. MOCK-OLJUK A HIBÁS API-T
    (window as any).fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Not found' })
    });

    // 2. ELLENŐRZÉS: Hibát dob-e?
    await expect(apiGet('/invalid')).rejects.toThrow('Not found');
  });
});
```

### Frontend Tesztek Futtatása

```bash
cd frontend

# Összes teszt futtatása
npm test -- --run

# Coverage report
npm run test:cov -- --run

# Watch mode
npm test

# UI vizualizáció (szép weboldal)
npm run test:ui
```

## 📊 Coverage Értelmezése

A coverage azt mutatja, hogy a kódnak mekkora része lett tesztelt.

### Mire nézz?

| Metrika | Mit jelent | Jó? |
|---------|-----------|-----|
| **91% Statements** | 91% kódsor futott | ✅ Igen |
| **85% Branches** | 85% if/else ág tesztelve | ✅ Igen |
| **98% Functions** | 98% függvény tesztelve | ✅ Igen |
| **92% Lines** | 92% sor felhasznált | ✅ Igen |

### Frontend Coverage

| Terület | Frontend | Mit jelent |
|---------|----------|-----------|
| Statements | 99% | Szinte mindent teszteltünk |
| Branches | 76% | 3/4 lehetséges ág tesztelve |
| Functions | 100% | Minden függvény tesztelve |
| Lines | 100% | Minden sor tesztelve |

## 🎯 Összegzés

### 1. Séma amit követünk

Minden teszt ezt az 3 fázist követi:

```typescript
it('teszt neve', () => {
  // ARRANGE: Előkészítés
  const input = { name: 'John' };
  const expected = { id: 1, name: 'John' };

  // ACT: Cselekmény
  const result = myFunction(input);

  // ASSERT: Ellenőrzés
  expect(result).toEqual(expected);
});
```

### 2. Mock Törlés (Cleanup)

A tesztek nem zavarhatják egymást:

```typescript
describe('MyService', () => {
  beforeEach(() => {
    // Minden teszt előtt megtisztítjuk a mock-okat
    vi.clearAllMocks();
  });

  it('test 1', () => {});
  it('test 2', () => {});
});
```

### 3. Explicit Assertions

```typescript
// ❌ Rossz: túl általános
expect(result).toBeDefined();

// ✅ Jó: konkrét
expect(result.user_id).toBe(1);
expect(result.email).toBe('test@example.com');
```

## 🚨 Közös Hibák és Megoldások

### 1. "Cannot find module" hiba

```
Error: Cannot find module '@nestjs/common'
```

**Megoldás**: Az import útvonal helyes?

```typescript
// ❌ Rossz
import { Injectable } from 'nestjs/common';

// ✅ Jó
import { Injectable } from '@nestjs/common';
```

### 2. Mock nem működik

```
Error: fetch is not a function
```

**Megoldás**: A mock-ot a teszt elején vagy setupban kell definiálni:

```typescript
beforeEach(() => {
  (window as any).fetch = vi.fn();
});
```

### 3. Async teszt timeout

```
Timeout - Async callback was not invoked within 5000ms
```

**Megoldás**: Biztos-e, hogy vársz az async operációra?

```typescript
// ✅ Jó: await-al
const result = await apiGet('/users');
expect(result).toBeDefined();
```

## 📈 Coverage Javítása

Ha szeretnéd a coverage-t emelni:

1. **Negatív tesztek írása**: Hibás inputokat is tesztelj
```typescript
it('Hibás email-t elutasít', () => {
  expect(() => validateEmail('invalid')).toThrow();
});
```

2. **Edge case-ek tesztelése**: null, üres string, nagy számok
```typescript
it('null input kezelése', () => {
  expect(myFunction(null)).toBeNull();
});
```

3. **Elágazások tesztelése**: Minden if-ág
```typescript
// Ha a kódban van: if (isAdmin) { ... } else { ... }
// Teszteld mindkét esetet
```


## 🎯 Összefoglalás

Ez a tesztelési infrastruktúra:
- **180 teszt** futtatva automatikusan
- **91%+ backend coverage** - szinte minden sor tesztelve
- **99%+ frontend coverage** - majdnem teljesen tesztelve
- **Gyors** - pár másodperc alatt futnak
- **Megbízható** - mock-ok miatt nem függ külső rendszerektől

Amikor módosítasz a kódon, a tesztek azonnal megmondják, hogy elrontottál-e valamit.

---
