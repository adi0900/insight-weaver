import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    insightsApi,
    narrativesApi,
    inspectorApi,
    dataSourcesApi,
    authApi,
} from '@/services/api';

// ============================================
// INSIGHTS HOOKS
// ============================================

export function useGenerateInsight() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: insightsApi.generate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['insights'] });
        },
    });
}

export function useInsight(id: string) {
    return useQuery({
        queryKey: ['insights', id],
        queryFn: () => insightsApi.get(id),
        enabled: !!id,
    });
}

// ============================================
// NARRATIVE HOOKS
// ============================================

export function useNarratives() {
    return useQuery({
        queryKey: ['narratives'],
        queryFn: narrativesApi.list,
    });
}

export function useNarrative(id: string) {
    return useQuery({
        queryKey: ['narratives', id],
        queryFn: () => narrativesApi.get(id),
        enabled: !!id,
    });
}

export function useCreateNarrative() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: narrativesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['narratives'] });
        },
    });
}

export function useUpdateNarrative() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Parameters<typeof narrativesApi.update>[1] }) =>
            narrativesApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['narratives'] });
            queryClient.invalidateQueries({ queryKey: ['narratives', variables.id] });
        },
    });
}

export function useDeleteNarrative() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: narrativesApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['narratives'] });
        },
    });
}

export function useExportNarrative() {
    return useMutation({
        mutationFn: ({ id, format }: { id: string; format: 'pdf' | 'markdown' | 'salesforce' }) =>
            narrativesApi.export(id, { format }),
    });
}

// ============================================
// INSPECTOR HOOKS
// ============================================

export function useAlerts() {
    return useQuery({
        queryKey: ['alerts'],
        queryFn: inspectorApi.getAlerts,
        refetchInterval: 60000, // Poll every minute
    });
}

export function useAcknowledgeAlert() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: inspectorApi.acknowledgeAlert,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alerts'] });
        },
    });
}

export function useMetricSubscriptions() {
    return useQuery({
        queryKey: ['subscriptions'],
        queryFn: inspectorApi.getSubscriptions,
    });
}

export function useCreateSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: inspectorApi.subscribe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
        },
    });
}

// ============================================
// DATA SOURCE HOOKS
// ============================================

export function useDataSources() {
    return useQuery({
        queryKey: ['dataSources'],
        queryFn: dataSourcesApi.list,
    });
}

export function useDataSource(id: string) {
    return useQuery({
        queryKey: ['dataSources', id],
        queryFn: () => dataSourcesApi.get(id),
        enabled: !!id,
    });
}

export function useSyncDataSource() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: dataSourcesApi.sync,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dataSources'] });
        },
    });
}

export function useTestDataSource() {
    return useMutation({
        mutationFn: dataSourcesApi.test,
    });
}

// ============================================
// AUTH HOOKS
// ============================================

export function useCurrentUser() {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: authApi.getCurrentUser,
        retry: false,
        staleTime: Infinity,
    });
}

export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            queryClient.setQueryData(['currentUser'], { success: true, data: data.data });
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            queryClient.clear();
        },
    });
}

export function useInitiateOAuth() {
    return useMutation({
        mutationFn: authApi.initiateOAuth,
        onSuccess: (data) => {
            window.location.href = data.redirectUrl;
        },
    });
}
