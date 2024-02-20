import { ApiProperty, } from '@nestjs/swagger';
import { Type, } from '@nestjs/common';
import { ClassType, } from '@common/type/class.type';

class PaginationMeta {
    @ApiProperty({
    	example: 1,
    	description: '현재 페이지',
    })
    currentPage!: number;

    @ApiProperty({
    	example: 10,
    	description: '현재 페이지 내 아이템 개수',
    })
    itemCount!: number;

    @ApiProperty({
    	example: 10,
    	description: '한 페이지에 보여줄 아이템 개수',
    })
    itemsPerPage!: number;

    @ApiProperty({
    	example: 100,
    	description: '조회할 수 있는 총 아이템 수',
    })
    totalItems!: number;

    @ApiProperty({
    	example: 10,
    	description: '조회할 수 있는 총 페이지 수',
    })
    totalPages!: number;
}

export interface IPagination<T> {
    items: T[];
    meta: PaginationMeta;
}

export function Pagination<T extends ClassType>(entityDto: T): Type<IPagination<T>> {
	class Paged implements IPagination<T> {
        @ApiProperty({
        	type: PaginationMeta,
        	example: PaginationMeta,
        	description: '페이지네이션 메타 정보',
        })
        meta!: PaginationMeta;

        @ApiProperty({
        	type: entityDto,
        	isArray: true,
        	description: '조회된 아이템',
        })
        items!: T[];
	}

	return Paged;
}

export function getPaginationMeta(page: number, limit: number, itemCount: number): PaginationMeta {
	return {
		currentPage: page,
		itemCount: itemCount,
		itemsPerPage: limit,
		totalItems: (page-1) * limit + itemCount,
		totalPages: Math.ceil(itemCount / limit),
	};
}
