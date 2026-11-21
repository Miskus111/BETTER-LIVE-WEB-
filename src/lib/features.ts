/**
 * Whether the AI coach is live in the app. The website has no AI key of its own, so the app's state is a plain
 * switch here: set AI_COACH_LIVE=1 on the website's Vercel project once the app has ANTHROPIC_API_KEY.
 */
export const isCoachLive = () => process.env.AI_COACH_LIVE === '1'
