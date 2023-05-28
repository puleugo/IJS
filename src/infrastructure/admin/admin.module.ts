import { Module } from '@nestjs/common';
import { Crawler } from '@domain/crawler/crawler.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlerService } from '@app/crawler/crawler.service';
import { CrawlerModule } from '@app/crawler/crawler.module';

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
    TypeOrmModule.forFeature([Crawler]),
    import('@adminjs/nestjs').then(async ({ AdminModule }) => {
      const AdminJSTypeOrm = await import('@adminjs/typeorm');
      const AdminJS = (await import('adminjs')).default;

      AdminJS.registerAdapter({
        Database: AdminJSTypeOrm.Database,
        Resource: AdminJSTypeOrm.Resource,
      });

      return AdminModule.createAdminAsync({
        imports: [CrawlerModule],
        inject: [CrawlerService],
        useFactory: async (crawlerService: CrawlerService) => {
          return {
            adminJsOptions: {
              rootPath: '/admin',
              resources: [
                {
                  resource: Crawler,
                  options: {
                    sort: {
                      direction: 'asc',
                      sortBy: 'state',
                    },
                    actions: {
                      runCrawler: {
                        actionType: 'record',
                        icon: 'Play',
                        component: false,
                        handler: (request, response, context) => {
                          const { record, resource, currentAdmin, h } = context;
                          const { params } = record;
                          record.params = crawlerService.addCrawlerCron(params);
                          return {
                            record: record.toJSON(currentAdmin),
                            redirectUrl: h.resourceUrl({
                              resourceId:
                                resource._decorated?.id() || resource.id(),
                            }),
                            notice: {
                              message: 'successfullyRunCrawler',
                              type: 'success',
                            },
                          };
                        },
                      },

                      stopCrawler: {
                        actionType: 'record',
                        icon: 'Stop',
                        component: false,
                        handler: (request, response, context) => {
                          const { record, resource, currentAdmin, h } = context;
                          const { params } = record;
                          if (params.state === 'RUNNING') {
                            const crawler = crawlerService.stopCronJob(params);

                            return {
                              record: record.toJSON(currentAdmin),
                              redirectUrl: h.resourceUrl({
                                resourceId:
                                  resource._decorated?.id() || resource.id(),
                              }),
                              notice: {
                                message: 'successfullyRunCrawler',
                                type: 'success',
                              },
                            };
                          }
                          return {
                            record: record.toJSON(currentAdmin),
                            redirectUrl: h.resourceUrl({
                              resourceId:
                                resource._decorated?.id() || resource.id(),
                            }),
                            notice: {
                              message: 'AlreadyStoppedCrawler',
                              type: 'success',
                            },
                          };
                        },
                      },
                    },
                  },
                },
              ],
              branding: {
                companyName: 'IJS Admin',
                logo: false,
              },
            },
            // auth: {
            //   authenticate,
            //   cookieName: 'adminjs',
            //   cookiePassword: 'secret',
            // },
            sessionOptions: {
              resave: true,
              saveUninitialized: true,
              secret: 'secret',
            },
          };
        },
      });
    }),
  ],
})
export class AdminModule {}
