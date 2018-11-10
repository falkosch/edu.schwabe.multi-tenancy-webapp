export class BackendErrors {

    static notImplemented() {
        return new Error('Not Implemented');
    }

    static missingUserPasswordProof() {
        return new Error('missing user password proof');
    }
}
