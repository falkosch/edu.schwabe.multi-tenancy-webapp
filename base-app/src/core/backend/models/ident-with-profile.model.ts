import { Ident } from './ident.model';

export class IdentWithProfile extends Ident {

    public name?: string;

    public firstName?: string;

    public lastName?: string;

    public birthdate?: Date;

    public setId(value: string): IdentWithProfile {
        super.setId(value);
        return this;
    }

    public setName(value: string): IdentWithProfile {
        this.name = value;
        return this;
    }

    public setFirstName(value: string): IdentWithProfile {
        this.firstName = value;
        return this;
    }

    public setLastName(value: string): IdentWithProfile {
        this.lastName = value;
        return this;
    }

    public setBirthdate(value: Date): IdentWithProfile {
        this.birthdate = value;
        return this;
    }
}
