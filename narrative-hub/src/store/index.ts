import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================
// APP STATE STORE
// ============================================

interface AppState {
    theme: 'light' | 'dark' | 'system';
    sidebarOpen: boolean;
    currentView: 'chat' | 'narratives' | 'alerts' | 'data';

    // Actions
    setTheme: (theme: AppState['theme']) => void;
    toggleSidebar: () => void;
    setCurrentView: (view: AppState['currentView']) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            theme: 'system',
            sidebarOpen: true,
            currentView: 'chat',

            setTheme: (theme) => set({ theme }),
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setCurrentView: (currentView) => set({ currentView }),
        }),
        {
            name: 'insight-weaver-app',
            partialize: (state) => ({
                theme: state.theme,
                sidebarOpen: state.sidebarOpen,
            }),
        }
    )
);

// ============================================
// CHAT STATE STORE
// ============================================

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    visualization?: {
        type: 'chart' | 'table';
        vizId?: string;
    };
    citations?: {
        source: string;
        field: string;
        timeRange?: string;
    }[];
    confidence?: number;
}

interface ChatState {
    messages: Message[];
    isLoading: boolean;
    sessionId: string | null;

    // Actions
    addMessage: (message: Message) => void;
    clearMessages: () => void;
    setLoading: (loading: boolean) => void;
    setSessionId: (id: string) => void;
}

export const useChatStore = create<ChatState>()((set) => ({
    messages: [],
    isLoading: false,
    sessionId: null,

    addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
    clearMessages: () => set({ messages: [] }),
    setLoading: (isLoading) => set({ isLoading }),
    setSessionId: (sessionId) => set({ sessionId }),
}));

// ============================================
// NARRATIVE STATE STORE
// ============================================

interface Revision {
    id: string;
    hypothesis: string;
    confidence: number;
    authorId: string;
    timestamp: Date;
}

interface Narrative {
    id: string;
    title: string;
    status: 'draft' | 'review' | 'published';
    createdAt: Date;
    updatedAt: Date;
    revisions: Revision[];
    tags: string[];
    collaborators: string[];
}

interface NarrativeState {
    narratives: Narrative[];
    selectedNarrativeId: string | null;
    filter: 'all' | 'draft' | 'review' | 'published';

    // Actions
    setNarratives: (narratives: Narrative[]) => void;
    addNarrative: (narrative: Narrative) => void;
    updateNarrative: (id: string, updates: Partial<Narrative>) => void;
    deleteNarrative: (id: string) => void;
    selectNarrative: (id: string | null) => void;
    setFilter: (filter: NarrativeState['filter']) => void;
}

export const useNarrativeStore = create<NarrativeState>()((set) => ({
    narratives: [],
    selectedNarrativeId: null,
    filter: 'all',

    setNarratives: (narratives) => set({ narratives }),
    addNarrative: (narrative) =>
        set((state) => ({ narratives: [narrative, ...state.narratives] })),
    updateNarrative: (id, updates) =>
        set((state) => ({
            narratives: state.narratives.map((n) =>
                n.id === id ? { ...n, ...updates } : n
            ),
        })),
    deleteNarrative: (id) =>
        set((state) => ({
            narratives: state.narratives.filter((n) => n.id !== id),
            selectedNarrativeId:
                state.selectedNarrativeId === id ? null : state.selectedNarrativeId,
        })),
    selectNarrative: (selectedNarrativeId) => set({ selectedNarrativeId }),
    setFilter: (filter) => set({ filter }),
}));

// ============================================
// ALERT STATE STORE
// ============================================

interface Alert {
    id: string;
    metric: string;
    dimension: string;
    previousValue: number;
    currentValue: number;
    percentChange: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    suggestedNarrative: string;
    timestamp: Date;
    acknowledged: boolean;
}

interface AlertState {
    alerts: Alert[];
    severityFilter: 'all' | 'low' | 'medium' | 'high' | 'critical';
    showAcknowledged: boolean;

    // Actions
    setAlerts: (alerts: Alert[]) => void;
    addAlert: (alert: Alert) => void;
    acknowledgeAlert: (id: string) => void;
    setSeverityFilter: (filter: AlertState['severityFilter']) => void;
    toggleShowAcknowledged: () => void;
}

export const useAlertStore = create<AlertState>()((set) => ({
    alerts: [],
    severityFilter: 'all',
    showAcknowledged: true,

    setAlerts: (alerts) => set({ alerts }),
    addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
    acknowledgeAlert: (id) =>
        set((state) => ({
            alerts: state.alerts.map((a) =>
                a.id === id ? { ...a, acknowledged: true } : a
            ),
        })),
    setSeverityFilter: (severityFilter) => set({ severityFilter }),
    toggleShowAcknowledged: () =>
        set((state) => ({ showAcknowledged: !state.showAcknowledged })),
}));

// ============================================
// AUTH STATE STORE
// ============================================

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setLoading: (isLoading) => set({ isLoading }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));
