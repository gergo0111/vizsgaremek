1. Töltse le az appot

2. A backend mappában írja át a ".env.example" fájlt ".env"-re majd a tartalom helyére ezt írja:
PORT=3000
DATABASE_URL="mysql://root:@localhost:3306/vizsgaremek"

3. Backend indítása:
cd backend
npm install
npm install class-validator class-transformer prisma @faker-js/faker --save-dev
npx prisma migrate dev
npm run start:dev

4. Frontend indítása:
cd frontend
npm install
npm install react-router react-router-dom
npm run dev
