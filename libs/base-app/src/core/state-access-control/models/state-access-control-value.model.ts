import { StateAccessGuardAuthorizeParameters } from './state-access-guard.model';

export const StateAccessControlProperty = 'accessControl';

export type StateAccessControlValue = Record<string, StateAccessGuardAuthorizeParameters>;
