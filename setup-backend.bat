@echo off
echo 🚀 Setting up TrueSkin Payment Backend...

REM Create backend directory if it doesn't exist
if not exist backend mkdir backend
cd backend

REM Initialize npm project
npm init -y

REM Install dependencies
echo 📦 Installing dependencies...
npm install express cors razorpay dotenv
npm install --save-dev nodemon

REM Create server.js
echo const express = require('express'); > server.js
echo const cors = require('cors'); >> server.js
echo const Razorpay = require('razorpay'); >> server.js
echo require('dotenv').config(); >> server.js
echo. >> server.js
echo const app = express(); >> server.js
echo const PORT = process.env.PORT ^|^| 3001; >> server.js
echo. >> server.js
echo // Middleware >> server.js
echo app.use(cors()); >> server.js
echo app.use(express.json()); >> server.js
echo. >> server.js
echo // Razorpay configuration >> server.js
echo const razorpay = new Razorpay({ >> server.js
echo   key_id: process.env.RAZORPAY_KEY_ID ^|^| 'rzp_test_1DP5mmOlF5G5ag', >> server.js
echo   key_secret: process.env.RAZORPAY_KEY_SECRET ^|^| 'test_secret_key' >> server.js
echo }); >> server.js
echo. >> server.js
echo // Create Razorpay order >> server.js
echo app.post('/api/create-order', async (req, res) =^> { >> server.js
echo   try { >> server.js
echo     const { amount, currency = 'INR', receipt, customer_info } = req.body; >> server.js
echo. >> server.js
echo     const options = { >> server.js
echo       amount: Math.round(amount * 100), // Convert to paise >> server.js
echo       currency, >> server.js
echo       receipt, >> server.js
echo       notes: customer_info ^|^| {} >> server.js
echo     }; >> server.js
echo. >> server.js
echo     const order = await razorpay.orders.create(options); >> server.js
echo. >> server.js
echo     res.json({ >> server.js
echo       success: true, >> server.js
echo       order: { >> server.js
echo         id: order.id, >> server.js
echo         amount: order.amount, >> server.js
echo         currency: order.currency, >> server.js
echo         receipt: order.receipt, >> server.js
echo         status: order.status >> server.js
echo       } >> server.js
echo     }); >> server.js
echo   } catch (error) { >> server.js
echo     console.error('Error creating order:', error); >> server.js
echo     res.status(500).json({ >> server.js
echo       success: false, >> server.js
echo       error: 'Failed to create order' >> server.js
echo     }); >> server.js
echo   } >> server.js
echo }); >> server.js
echo. >> server.js
echo // Verify payment >> server.js
echo app.post('/api/verify-payment', async (req, res) =^> { >> server.js
echo   try { >> server.js
echo     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body; >> server.js
echo. >> server.js
echo     // Create signature for verification >> server.js
echo     const crypto = require('crypto'); >> server.js
echo     const body = razorpay_order_id + '^|' + razorpay_payment_id; >> server.js
echo     const expectedSignature = crypto >> server.js
echo       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET ^|^| 'test_secret_key') >> server.js
echo       .update(body.toString()) >> server.js
echo       .digest('hex'); >> server.js
echo. >> server.js
echo     const isValid = expectedSignature === razorpay_signature; >> server.js
echo. >> server.js
echo     res.json({ >> server.js
echo       success: isValid, >> server.js
echo       isValid >> server.js
echo     }); >> server.js
echo   } catch (error) { >> server.js
echo     console.error('Error verifying payment:', error); >> server.js
echo     res.status(500).json({ >> server.js
echo       success: false, >> server.js
echo       error: 'Failed to verify payment' >> server.js
echo     }); >> server.js
echo   } >> server.js
echo }); >> server.js
echo. >> server.js
echo // Health check >> server.js
echo app.get('/api/health', (req, res) =^> { >> server.js
echo   res.json({ >> server.js
echo     success: true, >> server.js
echo     message: 'Payment API is running', >> server.js
echo     timestamp: new Date().toISOString() >> server.js
echo   }); >> server.js
echo }); >> server.js
echo. >> server.js
echo app.listen(PORT, () =^> { >> server.js
echo   console.log(`Payment API server running on port ${PORT}`); >> server.js
echo   console.log(`Health check: http://localhost:${PORT}/api/health`); >> server.js
echo }); >> server.js

REM Create .env file
echo # Backend Server Configuration > .env
echo PORT=3001 >> .env
echo. >> .env
echo # Razorpay Configuration >> .env
echo # Replace these with your actual Razorpay credentials from https://dashboard.razorpay.com/ >> .env
echo RAZORPAY_KEY_ID=rzp_test_your_key_id_here >> .env
echo RAZORPAY_KEY_SECRET=your_key_secret_here >> .env

REM Update package.json scripts
echo { > package.json
echo   "name": "trueskin-payment-api", >> package.json
echo   "version": "1.0.0", >> package.json
echo   "description": "Payment API server for TrueSkin e-commerce", >> package.json
echo   "main": "server.js", >> package.json
echo   "scripts": { >> package.json
echo     "start": "node server.js", >> package.json
echo     "dev": "nodemon server.js" >> package.json
echo   }, >> package.json
echo   "dependencies": { >> package.json
echo     "express": "^4.18.2", >> package.json
echo     "cors": "^2.8.5", >> package.json
echo     "razorpay": "^2.9.6", >> package.json
echo     "dotenv": "^16.3.1" >> package.json
echo   }, >> package.json
echo   "devDependencies": { >> package.json
echo     "nodemon": "^3.0.1" >> package.json
echo   }, >> package.json
echo   "keywords": ["razorpay", "payment", "api", "ecommerce"], >> package.json
echo   "author": "TrueSkin", >> package.json
echo   "license": "MIT" >> package.json
echo } >> package.json

echo ✅ Backend setup complete!
echo.
echo 📋 Next steps:
echo 1. Update the .env file with your actual Razorpay credentials:
echo    - Go to https://dashboard.razorpay.com/
echo    - Get your Test/Live Key ID and Key Secret
echo    - Update RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env
echo.
echo 2. Start the backend server:
echo    cd backend
echo    npm run dev
echo.
echo 3. The API will be available at:
echo    - Health check: http://localhost:3001/api/health
echo    - Create order: http://localhost:3001/api/create-order
echo    - Verify payment: http://localhost:3001/api/verify-payment
echo.
echo 🎉 Your payment gateway is ready!

pause
