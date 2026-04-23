# 🎯 Swagger API Dokumentáció - Gyors Útmutató

## 📍 Hol találja meg a Swagger dokumentációt?

Az alkalmazás elindítása után az interaktív Swagger UI az alábbi címen érhető el:

```
http://localhost:3000/api/docs
```

## 🚀 Gyors kezdés

### 1. Projekt indítása

```bash
cd backend
npm install
npm run start:dev
```

### 2. Swagger UI megnyitása

Nyissa meg a böngészőjét és navigáljon a következő URL-re:
```
http://localhost:3000/api/docs
```

### 3. Bejelentkezés

A legtöbb API végpont JWT token-based autentikációt igényel:

1. Kattintson az **"Authorize"** gombra a Swagger UI jobb felső sarkában
2. Válassza ki a **"Bearer"** opciót
3. Adja meg a JWT tokent az alábbi formában:
   ```
   Bearer <your_jwt_token>
   ```

## 🔐 Bejelentkezés a rendszerbe

### Lehetőség 1: Felhasználónévvel (Users modul) - 

**Végpont:** `POST /users/login`

```json
{
  "felhasznalonev": "nagy_janos",
  "jelszo": "SecurePass123!"
}
```

**Válasz:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Lehetőség 2: Email-el (Auth modul)

**Végpont:** `POST /auth/login`

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

## 📚 API Dokumentáció Szerkezete

A Swagger dokumentáció az alábbi modulokra van szervezve:

### 🔑 **Authentication (Autentikáció)**
- POST `/auth/login` - Bejelentkezés email-lel

### 👥 **Users (Felhasználók)**
- POST `/users` - Új felhasználó regisztrálása
- GET `/users` - Összes felhasználó lekérése
- GET `/users/:id` - Felhasználó lekérése ID alapján
- PATCH `/users/:id` - Felhasználó módosítása
- DELETE `/users/:id` - Felhasználó törlése
- PATCH `/users/:id/restore` - Törölt felhasználó visszaállítása
- GET `/users/deleted` - Törölt felhasználók lekérése
- POST `/users/login` - Bejelentkezés felhasználónév-vel

### 🛠️ **Eszközök (Eszkozok)**
- POST `/eszkozok` - Új eszköz létrehozása
- GET `/eszkozok` - Összes eszköz lekérése
- GET `/eszkozok/:id` - Eszköz lekérése ID alapján
- PATCH `/eszkozok/:id` - Eszköz módosítása
- DELETE `/eszkozok/:id` - Eszköz törlése
- PATCH `/eszkozok/:id/restore` - Törölt eszköz visszaállítása
- GET `/eszkozok/deleted` - Törölt eszközök lekérése

### 📋 **Feladatok (Feladat)**
- POST `/feladatok` - Új feladat létrehozása
- GET `/feladatok` - Összes feladat lekérése
- GET `/feladatok/:id` - Feladat lekérése ID alapján
- PATCH `/feladatok/:id` - Feladat módosítása
- DELETE `/feladatok/:id` - Feladat törlése
- PATCH `/feladatok/:id/restore` - Törölt feladat visszaállítása
- GET `/feladatok/deleted` - Törölt feladatok lekérése

### 💼 **Munkák (Munka)**
- POST `/munka` - Új munka létrehozása
- GET `/munka` - Felhasználóhoz tartozó munkák lekérése
- GET `/munka/:id` - Munka lekérése ID alapján
- PATCH `/munka/:id` - Munka módosítása
- DELETE `/munka/:id` - Munka törlése
- PATCH `/munka/:id/restore` - Törölt munka visszaállítása
- GET `/munka/deleted` - Törölt munkák lekérése

## 💡 Swagger UI Tippek és Trükkök

### Végpont Kipróbálása

1. Kattintson az egy végpontra az UI-ban
2. Kattintson a **"Try it out"** gombra
3. Szerkessze a paramétereket és a kérés testét
4. Kattintson az **"Execute"** gombra
5. Tekintse meg a választ

### Válasz Információk

A Swagger UI megjeleníti:
- **Status Code:** HTTP válasz kódja (200, 201, 400, 401, 404, stb.)
- **Response Headers:** A válasz fejléce
- **Response Body:** A JSON válasz a szervértől

### Autentikáció Tesztelése

1. Kattintson az **"Authorize"** gombra
2. Válassza a **"Bearer"** sémát
3. Adja meg az `Authorization: Bearer <token>` fejlécet
4. Minden ezt követő kérés automatikusan tartalmazni fogja a tokent

## 📊 Válaszok és Hibák

### Sikeres Válaszok

- **200 OK** - Sikeres GET/PATCH/DELETE kérés
- **201 Created** - Sikeres POST kérés (erőforrás létrehozva)

### Hibaválaszok

- **400 Bad Request** - Hibás bemenet vagy validációs hiba
- **401 Unauthorized** - Hiányzó vagy érvénytelen token
- **403 Forbidden** - Nincs jogosultsága az erőforráshoz
- **404 Not Found** - Erőforrás nem található
- **500 Internal Server Error** - Szerver oldali hiba

## 🔒 Biztonsági Megjegyzések

1. **Jelszókövetelmények:**
   - Minimum 8 karakter hosszú
   - Tartalmaznia kell legalább egy nagybetűt
   - Tartalmaznia kell legalább egy kisbetűt
   - Tartalmaznia kell legalább egy számot vagy speciális karaktert

2. **Token Kezelés:**
   - Soha ne ossza meg a JWT tokent
   - A token az `Authorization` fejlécben küldjön el
   - Az alkalmazás a tokent biztonságosan tárolta és titkosítva továbbítja

3. **CORS:**
   - Az API CORS-t engedélyez az összes eredetre
   - Fejlesztési célokra konfigurálva

## 📱 Swagger UI Nézetek

### Dark Mode

A Swagger UI automatikusan követi a rendszer beállításait (sötét/világos mód).

### Responszív Design

A Swagger UI teljes mértékben responzív és működik asztali számítógépeken, táblagépeken és mobil eszközökön.

## 🐛 Gyakori Problémák

### "Unauthorized" hiba

- Ellenőrizze, hogy helyesen másolja be a tokent
- Győződjön meg róla, hogy az `Authorization: Bearer` prefix helyesen van megadva

### "Not Found" (404) hiba

- Ellenőrizze, hogy az ID helyes és létezik az adatbázisban
- Ellenőrizze az endpoint URL-jét

### "Bad Request" (400) hiba

- Ellenőrizze a kérés testét (JSON formátum)
- Ellenőrizze, hogy az összes kötelező mező ki van töltve

---

**Utolsó frissítés:** 2026-04-23
