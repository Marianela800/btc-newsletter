function getFearGreedEmoji(score) {
  if (score <= 25) return { emoji: '😱', label: 'Miedo Extremo', color: '#dc2626' };
  if (score <= 45) return { emoji: '😰', label: 'Miedo', color: '#f97316' };
  if (score <= 55) return { emoji: '😐', label: 'Neutral', color: '#eab308' };
  if (score <= 75) return { emoji: '😏', label: 'Codicia', color: '#22c55e' };
  return { emoji: '🤑', label: 'Codicia Extrema', color: '#16a34a' };
}

function getSignalColor(signal) {
  if (!signal) return '#6b7280';
  const s = signal.toUpperCase();
  if (s.includes('BUY') || s.includes('PUMP')) return '#16a34a';
  if (s.includes('SELL')) return '#dc2626';
  return '#eab308';
}

function formatPrice(n) {
  if (!n) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);
}

function formatPct(n) {
  if (n === undefined || n === null) return 'N/A';
  const sign = n >= 0 ? '+' : '';
  return `${sign}${Number(n).toFixed(2)}%`;
}

function pctColor(n) {
  return n >= 0 ? '#16a34a' : '#dc2626';
}

function buildEmailHTML({ priceData, signals, fearGreed, news, aiAnalysis, date }) {
  // --- Extract data safely ---
  const btc = priceData?.[0] || {};
  const sig = signals?.[0] || {};
  const fg = fearGreed?.[0] || {};
  const ai = aiAnalysis?.[0] || {};

  const price = btc.current_price || btc.price_usd || 0;
  const change24h = btc.price_change_percentage_24h ?? btc.price_change_24h ?? null;
  const change7d = btc.price_change_percentage_7d ?? btc.price_change_7d ?? null;
  const change30d = btc.price_change_percentage_30d ?? btc.price_change_30d ?? null;
  const marketCap = btc.market_cap || 0;
  const volume24h = btc.total_volume || btc.volume_24h || 0;
  const ath = btc.ath || 0;
  const athPct = btc.ath_change_percentage || null;

  const rsi = sig.rsi || 'N/A';
  const macd = sig.macd || sig.macd_signal || 'N/A';
  const trendSignal = sig.signal || sig.trend || 'HOLD';
  const volSpike = sig.volume_spike ? '🔺 Sí' : '➖ No';

  const fgScore = Number(fg.value) || 0;
  const fgInfo = getFearGreedEmoji(fgScore);

  const aiSummary = ai.ai_summary || ai.btc_signal || 'Análisis no disponible en este momento.';
  const entryZone = ai.entry_zone || 'Ver análisis';
  const exitZone = ai.exit_zone || 'Ver análisis';
  const cyclePos = ai.cycle_position || 'N/A';

  const topNews = (news || []).slice(0, 5);

  const dateStr = date || new Date().toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // --- Build HTML ---
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>₿ Bitcoin Daily — ${dateStr}</title>
</head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif;">

<!-- WRAPPER -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- HEADER -->
  <tr><td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);border-radius:16px 16px 0 0;padding:36px 32px;text-align:center;">
    <div style="font-size:48px;margin-bottom:8px;">₿</div>
    <h1 style="margin:0;color:#f7931a;font-size:28px;font-weight:800;letter-spacing:-0.5px;">Bitcoin Daily</h1>
    <p style="margin:6px 0 0;color:#94a3b8;font-size:14px;text-transform:capitalize;">${dateStr}</p>
  </td></tr>

  <!-- PRICE HERO -->
  <tr><td style="background:#1e1e2e;padding:28px 32px;border-left:1px solid #2a2a3e;border-right:1px solid #2a2a3e;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Precio Bitcoin</p>
          <p style="margin:0;color:#ffffff;font-size:42px;font-weight:800;">${formatPrice(price)}</p>
        </td>
        <td align="right" valign="middle">
          <span style="background:${pctColor(change24h)}22;color:${pctColor(change24h)};padding:8px 16px;border-radius:50px;font-size:20px;font-weight:700;">${formatPct(change24h)}</span>
          <p style="margin:4px 0 0;color:#64748b;font-size:11px;text-align:right;">últimas 24h</p>
        </td>
      </tr>
      <tr><td colspan="2" style="padding-top:20px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="background:#12122a;border-radius:10px;padding:14px;">
              <p style="margin:0;color:#64748b;font-size:11px;">7 días</p>
              <p style="margin:4px 0 0;color:${pctColor(change7d)};font-size:18px;font-weight:700;">${formatPct(change7d)}</p>
            </td>
            <td width="12"></td>
            <td align="center" style="background:#12122a;border-radius:10px;padding:14px;">
              <p style="margin:0;color:#64748b;font-size:11px;">30 días</p>
              <p style="margin:4px 0 0;color:${pctColor(change30d)};font-size:18px;font-weight:700;">${formatPct(change30d)}</p>
            </td>
            <td width="12"></td>
            <td align="center" style="background:#12122a;border-radius:10px;padding:14px;">
              <p style="margin:0;color:#64748b;font-size:11px;">Desde ATH</p>
              <p style="margin:4px 0 0;color:${pctColor(athPct)};font-size:18px;font-weight:700;">${formatPct(athPct)}</p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </td></tr>

  <!-- FEAR & GREED -->
  <tr><td style="background:#1e1e2e;padding:0 32px 24px;border-left:1px solid #2a2a3e;border-right:1px solid #2a2a3e;">
    <div style="background:#12122a;border-radius:12px;padding:20px;text-align:center;border:1px solid ${fgInfo.color}33;">
      <p style="margin:0 0 8px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Índice Miedo & Codicia</p>
      <span style="font-size:40px;">${fgInfo.emoji}</span>
      <div style="background:${fgInfo.color};color:#fff;display:inline-block;padding:4px 20px;border-radius:50px;font-size:24px;font-weight:800;margin:8px auto;display:block;width:fit-content;">${fgScore}</div>
      <p style="margin:4px 0 0;color:${fgInfo.color};font-size:16px;font-weight:700;">${fgInfo.label}</p>
      ${fgScore <= 25 ? '<p style="margin:8px 0 0;color:#94a3b8;font-size:13px;">Históricamente, el miedo extremo es una oportunidad de compra.</p>' : ''}
      ${fgScore >= 76 ? '<p style="margin:8px 0 0;color:#94a3b8;font-size:13px;">Codicia extrema: considerar tomar ganancias.</p>' : ''}
    </div>
  </td></tr>

  <!-- SECTION DIVIDER -->
  <tr><td style="background:#1e1e2e;padding:4px 32px;border-left:1px solid #2a2a3e;border-right:1px solid #2a2a3e;">
    <hr style="border:none;border-top:1px solid #2a2a3e;margin:0;"/>
  </td></tr>

  <!-- TECHNICAL SIGNALS -->
  <tr><td style="background:#1e1e2e;padding:24px 32px;border-left:1px solid #2a2a3e;border-right:1px solid #2a2a3e;">
    <h2 style="margin:0 0 16px;color:#e2e8f0;font-size:16px;">📊 Señales Técnicas</h2>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="background:#12122a;border-radius:10px;padding:16px;">
          <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;">RSI</p>
          <p style="margin:6px 0 0;color:#f7931a;font-size:22px;font-weight:700;">${rsi}</p>
          <p style="margin:4px 0 0;color:#64748b;font-size:11px;">${Number(rsi) < 30 ? '🟢 Sobreventa' : Number(rsi) > 70 ? '🔴 Sobrecompra' : '🟡 Neutro'}</p>
        </td>
        <td width="12"></td>
        <td align="center" style="background:#12122a;border-radius:10px;padding:16px;">
          <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;">MACD</p>
          <p style="margin:6px 0 0;color:#a78bfa;font-size:22px;font-weight:700;">${typeof macd === 'number' ? macd.toFixed(2) : macd}</p>
        </td>
        <td width="12"></td>
        <td align="center" style="background:#12122a;border-radius:10px;padding:16px;">
          <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;">Señal</p>
          <p style="margin:6px 0 0;font-size:18px;font-weight:800;" style="color:${getSignalColor(trendSignal)};">${trendSignal}</p>
        </td>
        <td width="12"></td>
        <td align="center" style="background:#12122a;border-radius:10px;padding:16px;">
          <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;">Vol. Spike</p>
          <p style="margin:6px 0 0;color:#e2e8f0;font-size:16px;font-weight:700;">${volSpike}</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- AI ANALYSIS -->
  <tr><td style="background:#1e1e2e;padding:0 32px 24px;border-left:1px solid #2a2a3e;border-right:1px solid #2a2a3e;">
    <div style="background:linear-gradient(135deg,#1a0533,#0f0b1e);border-radius:12px;padding:20px;border:1px solid #7c3aed44;">
      <h2 style="margin:0 0 12px;color:#a78bfa;font-size:15px;">🤖 Análisis IA — Señal del Día</h2>
      <p style="margin:0 0 16px;color:#c4b5fd;font-size:14px;line-height:1.7;">${aiSummary}</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:#ffffff11;border-radius:8px;padding:12px;">
            <p style="margin:0;color:#64748b;font-size:11px;">Zona de Entrada</p>
            <p style="margin:4px 0 0;color:#22c55e;font-size:14px;font-weight:700;">${entryZone}</p>
          </td>
          <td width="12"></td>
          <td style="background:#ffffff11;border-radius:8px;padding:12px;">
            <p style="margin:0;color:#64748b;font-size:11px;">Zona de Salida</p>
            <p style="margin:4px 0 0;color:#f97316;font-size:14px;font-weight:700;">${exitZone}</p>
          </td>
          <td width="12"></td>
          <td style="background:#ffffff11;border-radius:8px;padding:12px;">
            <p style="margin:0;color:#64748b;font-size:11px;">Posición de Ciclo</p>
            <p style="margin:4px 0 0;color:#a78bfa;font-size:14px;font-weight:700;">${cyclePos}</p>
          </td>
        </tr>
      </table>
    </div>
  </td></tr>

  <!-- MARKET STATS -->
  <tr><td style="background:#1e1e2e;padding:0 32px 24px;border-left:1px solid #2a2a3e;border-right:1px solid #2a2a3e;">
    <h2 style="margin:0 0 16px;color:#e2e8f0;font-size:16px;">💰 Métricas de Mercado</h2>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="background:#12122a;border-radius:10px;padding:14px;">
          <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;">Market Cap</p>
          <p style="margin:6px 0 0;color:#e2e8f0;font-size:15px;font-weight:700;">${formatPrice(marketCap)}</p>
        </td>
        <td width="12"></td>
        <td style="background:#12122a;border-radius:10px;padding:14px;">
          <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;">Volumen 24h</p>
          <p style="margin:6px 0 0;color:#e2e8f0;font-size:15px;font-weight:700;">${formatPrice(volume24h)}</p>
        </td>
        <td width="12"></td>
        <td style="background:#12122a;border-radius:10px;padding:14px;">
          <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;">ATH</p>
          <p style="margin:6px 0 0;color:#e2e8f0;font-size:15px;font-weight:700;">${formatPrice(ath)}</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- NEWS -->
  ${topNews.length > 0 ? `
  <tr><td style="background:#1e1e2e;padding:0 32px 24px;border-left:1px solid #2a2a3e;border-right:1px solid #2a2a3e;">
    <h2 style="margin:0 0 16px;color:#e2e8f0;font-size:16px;">📰 Noticias del Día</h2>
    ${topNews.map(n => `
    <div style="border-left:3px solid #f7931a;padding:10px 14px;margin-bottom:12px;background:#12122a;border-radius:0 8px 8px 0;">
      <p style="margin:0;color:#e2e8f0;font-size:13px;font-weight:600;line-height:1.4;">${n.title || 'Sin título'}</p>
      <p style="margin:4px 0 0;color:#64748b;font-size:11px;">${n.source || ''} ${n.publishedAt ? '· ' + new Date(n.publishedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : ''}</p>
    </div>`).join('')}
  </td></tr>` : ''}

  <!-- DISCLAIMER -->
  <tr><td style="background:#161625;padding:20px 32px;border-left:1px solid #2a2a3e;border-right:1px solid #2a2a3e;border-radius:0 0 16px 16px;">
    <p style="margin:0;color:#475569;font-size:11px;line-height:1.6;text-align:center;">
      ⚠️ <strong>Disclaimer:</strong> Este newsletter es solo para fines informativos y educativos. No constituye asesoramiento financiero. Los mercados de criptomonedas son extremadamente volátiles. Nunca inviertas más de lo que puedes permitirte perder. Realiza siempre tu propia investigación.
    </p>
    <p style="margin:12px 0 0;color:#334155;font-size:11px;text-align:center;">Bitcoin Daily Newsletter · Generado automáticamente cada mañana</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

module.exports = { buildEmailHTML };
