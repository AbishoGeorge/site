/** Use case pages open from the URL hash, e.g. #use-case-cybersecurity. */
export const USE_CASE_HASH = /^use-case-(.+)$/;

export const linkToUseCase = (id: string) => `#use-case-${id}`;
