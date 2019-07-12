export class BackendErrors {

    static notImplemented() {
        return new Error('not implemented');
    }

    static missingUserPasswordProof() {
        return new Error('missing user password proof');
    }

}
