import { NotificationCategoryEnum, } from '@app/notification/domain/notification-category.enum';
import { ApiProperty, } from '@nestjs/swagger';
import { NotificationProfileResponseType, } from '@app/notification/domain/notification.type';

const NotificationCategoryName = new Map<number, string>([
	[NotificationCategoryEnum.Unknown, '확인되지 않음',],
	[NotificationCategoryEnum.Meal, '오늘의 학식',],
	[NotificationCategoryEnum.Council, '학생회 게시판',],
	[NotificationCategoryEnum.Notice, '학부 공지사항',],
]);

export class NotificationProfileResponse
implements NotificationProfileResponseType {
    @ApiProperty({
    	description: '푸시 알림의 제목',
    	example: '오늘의 학식',
    })
    readonly title: string;

    @ApiProperty({
    	description: '푸시 알림의 내용',
    	example:
            'A: 참치야채비빔밥, 뚝배기미니우동, 해쉬포테이토+케찹\nB: 고구마치즈돈까스, 직접구운크로와상+딸기잼, 양배추샐러드+드레싱, 옥수수스프\nC:닭다리칼국수+겨자부추장',
    })
    readonly body: string;

    @ApiProperty({
    	description:
            '푸시 알림의 카테고리(오늘의 학식, 학생회 게시판, 학부 공지사항)',
    	example: '오늘의 학식',
    })
    readonly categoryName: string;

    constructor(data: NotificationProfileResponseType) {
    	this.body = data.body;
    	this.title = data.title;
    	this.categoryName = NotificationCategoryName.get(data.category);
    }
}
