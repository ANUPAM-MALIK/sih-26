import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 4000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  storageDriver: process.env.STORAGE_DRIVER || 'local',
  maxUploadBytes: Number(process.env.MAX_UPLOAD_BYTES || 10485760),
};

