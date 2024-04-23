const httpErrors = {
  400: 'Bad request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not found',
  500: 'Internal server error',
};

const isKnownHTTPErrorStatus = (num) => (
  typeof num === 'number' && Object.keys(httpErrors).includes(`${num}`)
);

module.exports = (err, req, resp, next) => {
  // Calcula o código de status
  let statusCode = err.status || err.statusCode || 500;

  // Verifica se o código de status é um código conhecido
  if (!isKnownHTTPErrorStatus(statusCode)) {
    statusCode = 500;
  }

  // Obtém a mensagem associada ao código de status
  const message = err.message || httpErrors[statusCode];

  // Loga os detalhes do erro para erro 500
  if (statusCode === 500) {
    console.error('Erro interno do servidor:', err);
  }

  // Responde com um JSON contendo o código de status e a mensagem
  resp.status(statusCode).json({
    statusCode,
    message,
  });

  // Chama o próximo middleware (geralmente não é necessário, pois esse é o último middleware)
  next();
};
