export default defineEventHandler((event) => {

  const config = useRuntimeConfig();

  const path = getRouterParam(event, 'path');

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing API path',
    });
  }

  const target = `${config.apiBase}/${path}`;


  return proxyRequest(
    event,
    target
  )
})
