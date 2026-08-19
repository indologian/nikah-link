export type Plan = 'free' | 'premium' | 'pro';

interface ProfileEntitlement {
    plan: Plan;
    plan_expires_at: string | null;
}

export function getEffectivePlan(profile: ProfileEntitlement): Plan {
    if (profile.plan === 'pro') {
        return 'pro'; // Lifetime
    }

    if (profile.plan === 'premium' && profile.plan_expires_at) {
        const isExpired = new Date(profile.plan_expires_at) < new Date();
        return isExpired ? 'free' : 'premium';
    }

    return 'free';
}

export function isPremiumOrPro(profile: ProfileEntitlement): boolean {
    const effectivePlan = getEffectivePlan(profile);
    return effectivePlan === 'premium' || effectivePlan === 'pro';
}