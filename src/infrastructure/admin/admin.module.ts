import { Module } from '@nestjs/common';

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

@Module({
  imports: [
    import('@adminjs/nestjs').then(async ({ AdminModule }) => {
      const AdminJSTypeOrm = await import('@adminjs/typeorm');
      const AdminJS = (await import('adminjs')).default;

      AdminJS.registerAdapter({
        Database: AdminJSTypeOrm.Database,
        Resource: AdminJSTypeOrm.Resource,
      });

      return AdminModule.createAdminAsync({
        useFactory: async () => {
          return {
            adminJsOptions: {
              rootPath: '/admin',
              resources: [],
            },
            auth: {
              authenticate,
              cookieName: 'adminjs',
              cookiePassword: 'secret',
            },
            sessionOptions: {
              resave: true,
              saveUninitialized: true,
              secret: 'secret',
            },
          };
        },
        inject: [],
      });
    }),
  ],
})
export class AdminModule {}
