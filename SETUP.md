# PriceYourAuto - Setup Instructions

## What's Been Created

A complete car marketplace platform with:
- User authentication (customers & dealers)
- Dealer car listing system
- Customer search and deal system
- Negotiation system
- Mock data seeded

## Installation & Running

1. **Install dependencies:**
   ```bash
   cd /Users/joeduran/priceyourauto
   npm install
   ```

2. **Set up database:**
   ```bash
   npx prisma db push
   npm run db:seed
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   http://localhost:3000

## Demo Logins

**Dealers:**
- dealer1@test.com / password123
- dealer2@test.com / password123
- dealer3@test.com / password123

**Customers:**
- customer1@test.com / password123
- customer2@test.com / password123

## Features

- Modern, eye-catching UI with blue/orange/green color scheme
- Dealers can list cars ($19 listing fee - simulated for demo)
- Customers can search cars within 50-mile radius
- "Make Me A Deal" on up to 20 cars
- Dealers submit up to 3 counter-offers
- Accept deal and get verification code
- $59 deposit hold (simulated for demo)

## Next Steps for Production

1. Integrate real Stripe payments
2. Add email notifications (SendGrid/Resend)
3. Cloud photo storage (AWS S3/Cloudflare R2)
4. Deploy to Vercel + Railway
5. Add more advanced filters
6. Mobile responsive optimization
