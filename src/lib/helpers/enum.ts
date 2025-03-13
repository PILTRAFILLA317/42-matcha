export function getSexualPreferenceNumber(input: string): number {
	switch (input) {
		case 'Heterosexual':
			return 1;
		case 'Homosexual':
			return 2;
		case 'Bisexual':
			return 3;
		default:
			return 3;
	}
}

export function getSexualPreferenceString(input: number | string): string {
	switch (input) {
		case 1:
			return 'Heterosexual';
		case 2:
			return 'Homosexual';
		case 3:
			return 'Bisexual';
		case '1':
			return 'Heterosexual';
		case '2':
			return 'Homosexual';
		case '3':
			return 'Bisexual';
		default:
			return 'Bisexual';
	}
}

export function getSexualPreferences(input: string | number): sexualPreferences | null {
    if (typeof input === 'string') {
		switch (input) {
			case 'Heterosexual':
				return sexualPreferences.Heterosexual;
			case 'Homosexual':
				return sexualPreferences.Homosexual;
			case 'Bisexual':
				return sexualPreferences.Bisexual;
            case '1':
                return sexualPreferences.Heterosexual;
            case '2':
                return sexualPreferences.Homosexual;
            case '3':
                return sexualPreferences.Bisexual;
			default:
				return null;
		}
	}
	if (typeof input === 'number') {
		switch (input) {
			case 1:
				return sexualPreferences.Heterosexual;
			case 2:
				return sexualPreferences.Homosexual;
			case 3:
				return sexualPreferences.Bisexual;
			default:
				return null;
		}
	}
	return null;
}
