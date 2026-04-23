## Telepítés és futtatás lépésrő -> lépésre

### 1. Letöltés 🎯
Töltse le az appot ZIP formátumban, majd bontsa ki

### 2. Változtatások 🔧
A backend mappában írja át a ".env.example" fájlt ".env"-re, majd a tartalmát írja át a saját autentikációira:
```
PORT=3000
DATABASE_URL="mysql://root:@localhost:3306/vizsgaremek"
```
### 3. Backend indítása 🚀
> ❗ Fontos: A backend futtatásához MySQL szükséges.
```
cd backend
```
```
npm install
```
```
npm install @nestjs/swagger swagger-ui-express class-validator class-transformer prisma @faker-js/faker bcrypt argon2--save-dev
```
```
npx prisma generate
```
```
npx prisma db push
```
```
npm run start:dev
```

### 4. Frontend indítása 🚀
```
cd frontend
```
```
npm install
```
```
npm install react-router react-router-dom react-bootstrap bootstrap
```
```
npm run dev
```

### 5. Bejelentkezés 🔐
## - Adminként
Felhasználónév: admin
> Jelszó Admin123
## - Felhasználóként
Felhasználónév: felhasznalo1 (1-10)
> Jelszó: Felhasznalo123

### Felhasználói dokumentáció 📚
A megtekintéséhez töltse le a ZIP fájlt majd bontsa ki

### Adatbázismodell - Diagram 🚩
<img width="800" height="586" alt="image" src="https://github.com/user-attachments/assets/39e73f2a-c3a5-4a71-aabc-55203c8e8c96" />
