import { ApiProperty, } from '@nestjs/swagger';
import { UserPreviewResponseType, } from '../user.type';

export class UserPreviewResponse implements UserPreviewResponseType {
    @ApiProperty({
    	description: '사용자 ID',
    	example: '41c7ffb8-399c-440f-925d-1869ee77d3c0',
    })
    readonly id: string;

    constructor({ id, }: UserPreviewResponseType) {
    	this.id = id;
    }
}
