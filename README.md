## Telepítés és futtatás lépésrő -> lépésre

### 1. Letöltés 🎯
Töltse le az appot ZIP formátumban, majd bontsa ki

### 2. Változtatások 🔧
A backend mappában írja át a ".env.example" fájlt ".env"-re, majd a tartalmát írja át erre:
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
npm install class-validator class-transformer prisma @faker-js/faker --save-dev
```
```
npx prisma migrate dev
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
npm install react-router react-router-dom
```
```
npm run dev
```
