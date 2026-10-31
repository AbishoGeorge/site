/** Story pages open from the URL hash, e.g. #story-halcyon-cloud. */
export const CASE_HASH = /^story-(.+)$/;

export const caseHref = (id: string) => `#story-${id}`;
