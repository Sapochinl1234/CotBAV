const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { createSessionToken } = require('./auth');
const { saveQuote, listQuotes } = require('./storage');
const { buildShareLink, buildPdfPayload } = require('./export');
const { upsertUser } = require('./database');
const { initPostgres, saveQuotePostgres, listQuotesPostgres } = require('./postgresAdapter');
const { verifyGoogleCredential } = require('./googleAuth');

const app = express();
const PORT = process.env.PORT || 3001;

initPostgres().catch((error) => {
  console.error('Postgres init failed', error);
});

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'cotbav-backend' });
});

app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;

  try {
    const user = await verifyGoogleCredential(credential);
    upsertUser(user);
    const token = createSessionToken(user);
    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ error: error.message || 'Invalid Google credential' });
  }
});

app.post('/api/quote/estimate', (req, res) => {
  const { service, hours, experience, clientLocation, currency, urgency } = req.body;

  const baseHourly = {
    web: { junior: 40000, mid: 70000, senior: 110000 },
    mobile: { junior: 45000, mid: 80000, senior: 120000 },
    data: { junior: 50000, mid: 90000, senior: 140000 },
    support: { junior: 30000, mid: 50000, senior: 80000 }
  };

  const rate = baseHourly[service]?.[experience] || 70000;
  const complexityFactor = urgency === 'urgent' ? 1.25 : urgency === 'high' ? 1.15 : 1;
  const locationFactor = clientLocation === 'international' ? 1.18 : 1;
  const currencyFactor = currency === 'usd' ? 4200 : 1;
  const gross = rate * hours * complexityFactor * locationFactor;
  const minimum = Math.round(gross * 0.9 / currencyFactor);
  const ideal = Math.round(gross / currencyFactor);
  const premium = Math.round(gross * 1.15 / currencyFactor);

  res.json({ minimum, ideal, premium, currency: currency.toUpperCase() });
});

app.post('/api/quotes', async (req, res) => {
  const { userId, quote } = req.body;

  if (!userId || !quote) {
    return res.status(400).json({ error: 'userId and quote are required' });
  }

  try {
    const saved = process.env.DATABASE_URL
      ? await saveQuotePostgres(userId, quote)
      : saveQuote(userId, quote);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Could not save quote' });
  }
});

app.get('/api/quotes/:userId', async (req, res) => {
  try {
    const quotes = process.env.DATABASE_URL
      ? await listQuotesPostgres(req.params.userId)
      : listQuotes(req.params.userId);
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: 'Could not load quotes' });
  }
});

app.post('/api/quotes/export', (req, res) => {
  const { quoteId, baseUrl } = req.body;

  if (!quoteId) {
    return res.status(400).json({ error: 'quoteId is required' });
  }

  const shareLink = buildShareLink(baseUrl || 'https://cotbav.example', quoteId);
  const pdfPayload = buildPdfPayload(req.body.quote || {});

  res.json({ shareLink, pdfPayload });
});

app.listen(PORT, () => {
  console.log(`CotBAV backend listening on port ${PORT}`);
});
