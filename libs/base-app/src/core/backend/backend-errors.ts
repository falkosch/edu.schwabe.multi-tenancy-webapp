export class BackendErrors {

    public static notImplemented(): Error {
        return new Error('not implemented');
    }

    public static missingUserPasswordProof(): Error {
        return new Error('missing user password proof');
    }

}
