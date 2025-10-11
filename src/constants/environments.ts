export const environments = {
  // Public
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_DEFAULT_AVATAR: process.env.NEXT_PUBLIC_DEFAULT_AVATAR,

  // Atlas
  MONGODB_URI: process.env.MONGODB_URI,

  // Settings
  LIMIT_PAGE: process.env.LIMIT_PAGE
    ? parseInt(process.env.LIMIT_PAGE)
    : undefined,

  // Secret
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  CRON_SECRET: process.env.CRON_SECRET,
  BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND
    ? parseInt(process.env.BCRYPT_SALT_ROUND)
    : undefined,

  // Providers
  NEXT_PUBLIC_MAIL: process.env.NEXT_PUBLIC_MAIL,
  MAIL_APP_PASSWORD: process.env.MAIL_APP_PASSWORD,

  // Google
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,

  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  // Spoonacular API
  SPOONACULAR_API_KEY: process.env.SPOONACULAR_API_KEY,

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
}
