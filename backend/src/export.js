function buildShareLink(baseUrl, quoteId) {
  return `${baseUrl}/share/${quoteId}`;
}

function buildPdfPayload(quote) {
  return {
    title: 'CotBAV - Cotización',
    content: `
      Servicio: ${quote.service || 'Sin especificar'}
      Horas: ${quote.hours || 0}
      Ideal: ${quote.result?.ideal || 0} ${quote.result?.currency || 'COP'}
    `
  };
}

module.exports = { buildShareLink, buildPdfPayload };
