const isDev=process.env.NODE_ENV==='development'
const isQa=process.env.NODE_ENV==='qa'
const isProd=process.env.NODE_ENV==='production'

export default {isDev,isQa,isProd}
