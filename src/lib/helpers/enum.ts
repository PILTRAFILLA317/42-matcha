export function initSexualPreference(input: string): sexualPreference | null {
    switch (input) {
        case 'Heterosexual':
            return sexualPreference.Heterosexual;
        case 'Homosexual':
            return sexualPreference.Homosexual;
        case 'Bisexual':
            return sexualPreference.Bisexual;
        default:
            return sexualPreference.Bisexual;
    }
}