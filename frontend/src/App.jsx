import { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const serviceOptions = [
  { value: 'web', label: 'Desarrollo web' },
  { value: 'mobile', label: 'Desarrollo móvil' },
  { value: 'data', label: 'Data engineering' },
  { value: 'support', label: 'Soporte técnico' }
];

function App() {
  const [form, setForm] = useState({
    service: 'web',
    hours: 40,
    experience: 'mid',
    clientLocation: 'colombia',
    currency: 'cop',
    urgency: 'normal',
    monthlyCosts: 500000,
    billableHours: 80
  });
  const [quote, setQuote] = useState({ minimum: 0, ideal: 0, premium: 0, currency: 'COP' });
  const [loading, setLoading] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    let ignore = false;
    const requestQuote = async () => {
      setLoading(true);
      try {
        const response = await axios.post('/api/quote/estimate', form);
        if (!ignore) {
          setQuote(response.data);
        }
      } catch (error) {
        if (!ignore) {
          setQuote({ minimum: 0, ideal: 0, premium: 0, currency: 'COP' });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    requestQuote();
    return () => {
      ignore = true;
    };
  }, [form]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('/api/auth/google', { credential: credentialResponse.credential });
      setUser(response.data.user);
      const historyResponse = await axios.get(`/api/quotes/${response.data.user.id}`);
      setHistory(historyResponse.data);
    } catch (error) {
      console.error('Google auth failed', error);
    }
  };

  const saveCurrentQuote = async () => {
    if (!user) return;

    const payload = {
      userId: user.id,
      quote: {
        ...form,
        result: quote
      }
    };

    try {
      const response = await axios.post('/api/quotes', payload);
      setHistory((prev) => [response.data, ...prev]);
    } catch (error) {
      console.error('Could not save quote', error);
    }
  };

  const exportCurrentQuote = async () => {
    try {
      const response = await axios.post('/api/quotes/export', {
        quoteId: 'demo-quote',
        baseUrl: window.location.origin,
        quote: { ...form, result: quote }
      });
      window.alert(`Enlace compartible: ${response.data.shareLink}`);
    } catch (error) {
      console.error('Could not export quote', error);
    }
  };

  return (
    <div className="app-shell">
      <header className={`hero ${darkMode ? 'theme-dark' : 'theme-light'}`}>
        <div>
          <p className="eyebrow">CotBAV • Cotización inteligente</p>
          <h1>Calcula tarifas justas para tus proyectos de software.</h1>
          <p>Diseñado para freelancers y equipos independientes en Colombia y Latinoamérica.</p>
        </div>
        <div className="auth-card">
          <button type="button" className="theme-toggle" onClick={() => setDarkMode((prev) => !prev)} aria-pressed={darkMode}>
            {darkMode ? '☀️ Claro' : '🌙 Oscuro'}
          </button>
          {user ? (
            <p>Hola, {user.name}</p>
          ) : (
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.error('Google login failed')} />
          )}
        </div>
      </header>

      {showCookieBanner && (
        <div className="cookie-banner">
          <p>Usamos cookies esenciales para la sesión y seguridad. Puedes aceptar o personalizar tu preferencia.</p>
          <button type="button" onClick={() => setShowCookieBanner(false)}>Aceptar</button>
        </div>
      )}

      <main className="content-grid">
        <section className="card">
          <h2>Datos de la cotización</h2>
          <label>
            Tipo de servicio
            <select value={form.service} onChange={(e) => update('service', e.target.value)}>
              {serviceOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label>
            Horas estimadas
            <input type="number" min="1" value={form.hours} onChange={(e) => update('hours', Number(e.target.value))} />
          </label>

          <label>
            Nivel de experiencia
            <select value={form.experience} onChange={(e) => update('experience', e.target.value)}>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>
          </label>

          <label>
            Ubicación del cliente
            <select value={form.clientLocation} onChange={(e) => update('clientLocation', e.target.value)}>
              <option value="colombia">Colombia</option>
              <option value="international">Internacional</option>
            </select>
          </label>

          <label>
            Moneda de cobro
            <select value={form.currency} onChange={(e) => update('currency', e.target.value)}>
              <option value="cop">COP</option>
              <option value="usd">USD</option>
            </select>
          </label>

          <label>
            Urgencia
            <select value={form.urgency} onChange={(e) => update('urgency', e.target.value)}>
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </label>
        </section>

        <section className="card">
          <h2>Configuración personal</h2>
          <label>
            Costos fijos mensuales
            <input type="number" min="0" value={form.monthlyCosts} onChange={(e) => update('monthlyCosts', Number(e.target.value))} />
          </label>
          <label>
            Horas facturables disponibles
            <input type="number" min="1" value={form.billableHours} onChange={(e) => update('billableHours', Number(e.target.value))} />
          </label>

          <div className="quote-box">
            <h3>Rango sugerido</h3>
            {loading ? <p>Calculando...</p> : (
              <>
                <p><strong>Mínimo:</strong> {quote.minimum.toLocaleString('es-CO')} {quote.currency}</p>
                <p><strong>Ideal:</strong> {quote.ideal.toLocaleString('es-CO')} {quote.currency}</p>
                <p><strong>Premium:</strong> {quote.premium.toLocaleString('es-CO')} {quote.currency}</p>
              </>
            )}
            {user && (
              <div className="actions-row">
                <button className="save-button" type="button" onClick={saveCurrentQuote}>Guardar cotización</button>
                <button className="secondary-button" type="button" onClick={exportCurrentQuote}>Exportar / Compartir</button>
              </div>
            )}
          </div>
        </section>
      </main>

      {user && (
        <section className="card history-card">
          <h2>Historial privado</h2>
          {history.length === 0 ? <p>No hay cotizaciones guardadas aún.</p> : (
            <ul>
              {history.map((item) => (
                <li key={item.id}>
                  <strong>{item.quote?.service || 'Servicio'}</strong> • {item.quote?.result?.ideal?.toLocaleString('es-CO')} {item.quote?.result?.currency}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <footer className="footer">
        <span>Privacidad • Cookies • Términos</span>
        <span>OAuth Google • Cumplimiento Ley 1581</span>
      </footer>
    </div>
  );
}

export default App;
