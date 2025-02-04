import type { ParamMatcher } from '@sveltejs/kit';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

export const match = ((param: string): param is string => {
	return uuidValidate(param) && uuidVersion(param) === 4;
}) satisfies ParamMatcher;
