'use client';

import dynamic from 'next/dynamic';

// Each lab is its own chunk, so the first screen only loads the hero.
const Loading = () => <div className="panel min-h-[420px] animate-pulse" aria-hidden />;

export const TileLab = dynamic(() => import('./TileLab'), { ssr: false, loading: Loading });
export const FlowLab = dynamic(() => import('./FlowLab'), { ssr: false, loading: Loading });
export const BevLab = dynamic(() => import('./BevLab'), { ssr: false, loading: Loading });
export const SafetyLab = dynamic(() => import('./SafetyLab'), { ssr: false, loading: Loading });
