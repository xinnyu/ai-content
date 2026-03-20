import { api } from './client';

export interface PublishAccountConfig {
    apiUrl?: string;
    openComment?: number;
    onlyFansCanComment?: number;
    categoryId?: string | number;
}

export interface PublishAccount {
    id: string;
    platform: string;
    name: string;
    appId?: string;
    apiToken?: string;
    config?: PublishAccountConfig;
    createdAt: string;
    updatedAt: string;
}

export interface PublishRecord {
    id: string;
    articleId: string;
    accountId: string;
    platform: string;
    status: 'pending' | 'success' | 'failed';
    publishUrl?: string;
    errorMessage?: string;
    createdAt: string;
    updatedAt: string;
    account?: PublishAccount;
}

export const publishingApi = {
    getAccounts() {
        return api.get<PublishAccount[]>('/publishing/accounts');
    },

    createAccount(data: Partial<PublishAccount>) {
        return api.post<PublishAccount>('/publishing/accounts', data);
    },

    updateAccount(id: string, data: Partial<PublishAccount>) {
        return api.put<PublishAccount>(`/publishing/accounts/${id}`, data);
    },

    deleteAccount(id: string) {
        return api.delete(`/publishing/accounts/${id}`);
    },

    publishArticle(articleId: string, accountId: string) {
        return api.post<{ success: boolean; articleId: string }>('/publishing/publish', { articleId, accountId });
    },

    getRecords(articleId: string) {
        return api.get<PublishRecord[]>(`/publishing/records/${articleId}`);
    }
};
