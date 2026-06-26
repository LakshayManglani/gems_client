export default defineEventHandler((event) => {

  const config = useRuntimeConfig();

  const path = getRouterParam(event, 'path');

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing API path',
    });
  }


  const originalUrl = getRequestURL(event)

  const target = new URL(`${config.apiBase}/${path}`)
  target.search = originalUrl.search


  return proxyRequest(
    event,
    target.toString()
  )
})
