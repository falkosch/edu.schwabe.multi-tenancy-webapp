export class Ident {

    public constructor(public id: string) { }

    public setId(value: string): Ident {
        this.id = value;
        return this;
    }
}
