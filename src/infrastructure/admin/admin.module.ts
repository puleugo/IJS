import { Module, } from '@nestjs/common';
import { Crawler, } from '@domain/crawler/crawler.entity';
import { TypeOrmModule, } from '@nestjs/typeorm';
import { CrawlerService, } from '@app/crawler/crawler.service';
import { CrawlerModule, } from '@app/crawler/crawler.module';
import * as process from 'process';

const authenticate = async (email: string, password: string): Promise<{ email: string, password: string } | null> => {
	if (
		email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
	) {
		return {
			email,
			password,
		};
	}

	return null;
};
type ActionResponse = {notice: {message:string, type: string}, record: any, redirectUrl: string}
@Module({
	imports: [
		TypeOrmModule.forFeature([Crawler,]),
		import('@adminjs/nestjs').then(async ({ AdminModule, }) => {
			const AdminJSTypeOrm = await import('@adminjs/typeorm');
			const AdminJS = (await import('adminjs')).default;

			AdminJS.registerAdapter({
				Database: AdminJSTypeOrm.Database,
				Resource: AdminJSTypeOrm.Resource,
			});

			return AdminModule.createAdminAsync({
				imports: [CrawlerModule,],
				inject: [CrawlerService,],
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
											delete: {
												actionType: 'record',
												icon: 'Stop',
												component: false,
												guard: 'doYouReallyWantToDoThis',
												handler: (
													request,
													response,
													context
												): ActionResponse => {
													const {
														record,
														resource,
														currentAdmin,
														h,
													} = context;
													const { params, } = record;
													if (
														params.state ===
														'RUNNING'
													) {
														crawlerService.stopCronJob(
															params
														);
													}
													crawlerService.deleteCrawler(
														params
													);

													return {
														record: record.toJSON(
															currentAdmin
														),
														redirectUrl:
															h.resourceUrl({
																resourceId:
																	resource._decorated?.id() ||
																	resource.id(),
															}),
														notice: {
															message:
																'successfullyDeleted',
															type: 'success',
														},
													};
												},
											},
											runCrawler: {
												actionType: 'record',
												icon: 'Play',
												component: false,
												handler: (
													request,
													response,
													context
												): ActionResponse => {
													const {
														record,
														resource,
														currentAdmin,
														h,
													} = context;
													const { params, } = record;
													record.params =
														crawlerService.addCrawlerCron(
															params
														);

													return {
														record: record.toJSON(
															currentAdmin
														),
														redirectUrl:
															h.resourceUrl({
																resourceId:
																	resource._decorated?.id() ||
																	resource.id(),
															}),
														notice: {
															message:
																'successfullyRunCrawler',
															type: 'success',
														},

													};
												},
											},

											stopCrawler: {
												actionType: 'record',
												icon: 'Stop',
												component: false,
												handler: (
													request,
													response,
													context
												): ActionResponse => {
													const {
														record,
														resource,
														currentAdmin,
														h,
													} = context;
													const { params, } = record;
													if (
														params.state ===
														'RUNNING'
													) {
														crawlerService.stopCronJob(
															params
														);

														return {
															record: record.toJSON(
																currentAdmin
															),
															redirectUrl:
																h.resourceUrl({
																	resourceId:
																		resource._decorated?.id() ||
																		resource.id(),
																}),
															notice: {
																message:
																	'successfullyRunCrawler',
																type: 'success',
															},
														};
													}

													return {
														record: record.toJSON(
															currentAdmin
														),
														redirectUrl:
															h.resourceUrl({
																resourceId:
																	resource._decorated?.id() ||
																	resource.id(),
															}),
														notice: {
															message:
																'AlreadyStoppedCrawler',
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
			});
		}),
	],
})
export class AdminModule {
}
