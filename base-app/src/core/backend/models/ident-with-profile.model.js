import { Ident } from './ident.model';

export class IdentWithProfile extends Ident {

    name;

    firstName;

    lastName;

    birthdate;

    setName(value) {
        this.name = value;
        return this;
    }

    setFirstName(value) {
        this.firstName = value;
        return this;
    }

    setLastName(value) {
        this.lastName = value;
        return this;
    }

    setBirthdate(value) {
        this.birthdate = value;
        return this;
    }
}
