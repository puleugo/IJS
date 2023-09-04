import {
	Column, Entity, JoinColumn, ManyToOne,
} from 'typeorm';
import { User, } from './user.entity';
import { UserAuthProvider, } from './user-auth-provider.entity';

@Entity('user_auth')
export class UserAuth {
    @Column('varchar', {
    	length: 50,
    	primary: true,
    	unique: true,
    })
    username: string;

    @Column('uuid', { primary: true, })
    userId: string;

    @Column('smallint', { primary: true, })
    providerId: number;

    @ManyToOne(() => User, ({ auth, }) => auth)
    @JoinColumn({
    	name: 'user_id',
    	referencedColumnName: 'id',
    })
    user: User;

    @ManyToOne(() => UserAuthProvider, ({ userAuth, }) => userAuth)
    @JoinColumn({
    	name: 'vendor_provider_id',
    	referencedColumnName: 'id',
    })
    provider: UserAuthProvider;
}
