"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardBody, Tabs, Tab, Input, Button, Switch, Divider, Chip, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Spinner, addToast } from "@heroui/react";
import { Icon, loadIcons } from "@iconify/react";
import { settingsApi, AIPlatform, AIModel, DefaultModels, sourcesApi, Source, storageApi, StorageConfig } from "@/lib/api/settings";

export default function SettingsPage() {
    useEffect(() => {
        loadIcons([
            'solar:server-bold', 'solar:cpu-bold', 'solar:star-bold', 'solar:global-bold',
            'solar:document-add-bold', 'solar:programming-bold', 'solar:add-circle-bold',
            'solar:pen-linear', 'solar:trash-bin-trash-linear', 'solar:server-bold-duotone',
            'solar:cpu-bolt-bold-duotone', 'solar:document-text-bold-duotone',
            'solar:gallery-bold-duotone', 'ri:twitter-x-line', 'solar:star-bold-duotone',
        ]);
    }, []);

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
            <header className="rounded-medium border-small border-divider flex items-center justify-between gap-3 p-4 bg-background shadow-sm">
                <h2 className="text-large text-default-900 font-bold">系统配置中心</h2>
                <Button color="primary" variant="flat" startContent={<Icon icon="solar:programming-bold" />}>
                    查看系统日志
                </Button>
            </header>

            <Card className="bg-background/60 dark:bg-default-100/50 backdrop-blur-md border-small border-white/10 shadow-medium">
                <Tabs
                    classNames={{
                        tabList: "mx-4 mt-6 text-medium bg-default-100/50",
                        tabContent: "text-small",
                        panel: "p-6",
                    }}
                    size="lg"
                >
                    <Tab key="ai-platforms" title={<div className="flex items-center gap-2"><Icon icon="solar:server-bold" width={20} /><span>AI 平台</span></div>}>
                        <AIPlatformSettings />
                    </Tab>
                    <Tab key="ai-models" title={<div className="flex items-center gap-2"><Icon icon="solar:cpu-bold" width={20} /><span>AI 模型</span></div>}>
                        <AIModelSettings />
                    </Tab>
                    <Tab key="default-models" title={<div className="flex items-center gap-2"><Icon icon="solar:star-bold" width={20} /><span>默认模型</span></div>}>
                        <DefaultModelSettings />
                    </Tab>
                    <Tab key="sources" title={<div className="flex items-center gap-2"><Icon icon="solar:global-bold" width={20} /><span>采集源配置</span></div>}>
                        <SourceSettings />
                    </Tab>
                    <Tab key="storage" title={<div className="flex items-center gap-2"><Icon icon="solar:cloud-storage-bold" width={20} /><span>存储配置</span></div>}>
                        <StorageSettings />
                    </Tab>
                </Tabs>
            </Card>
        </div>
    );
}

// AI 平台管理
function AIPlatformSettings() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [platforms, setPlatforms] = useState<AIPlatform[]>([]);
    const [editingPlatform, setEditingPlatform] = useState<AIPlatform | null>(null);
    const [loading, setLoading] = useState(true);

    // 加载平台列表
    const fetchPlatforms = useCallback(async () => {
        try {
            setLoading(true);
            const data = await settingsApi.listPlatforms();
            setPlatforms(data);
        } catch (e: any) {
            addToast({ title: "加载失败", description: e.message, color: "danger" });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPlatforms(); }, [fetchPlatforms]);

    const handleAddPlatform = () => {
        setEditingPlatform(null);
        onOpen();
    };

    const handleEditPlatform = (platform: AIPlatform) => {
        setEditingPlatform(platform);
        onOpen();
    };

    // 真实删除
    const handleDeletePlatform = async (id: string) => {
        try {
            await settingsApi.deletePlatform(id);
            setPlatforms(platforms.filter(p => p.id !== id));
            addToast({ title: "删除成功", color: "success" });
        } catch (e: any) {
            addToast({ title: "删除失败", description: e.message, color: "danger" });
        }
    };

    // Modal 保存回调
    const handleSave = async (formData: { name: string; baseUrl: string; apiKey: string }) => {
        try {
            if (editingPlatform) {
                // 编辑
                await settingsApi.updatePlatform(editingPlatform.id, formData);
            } else {
                // 新建
                await settingsApi.createPlatform(formData);
            }
            onClose();
            fetchPlatforms(); // 重新加载
            addToast({ title: "保存成功", color: "success" });
        } catch (e: any) {
            addToast({ title: "保存失败", description: e.message, color: "danger" });
        }
    };

    if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

    return (
        <div className="flex flex-col gap-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-medium font-bold">AI 平台管理</h3>
                    <p className="text-small text-default-500 mt-1">配置不同的 AI 服务提供商，支持 OpenAI 兼容协议</p>
                </div>
                <Button color="primary" startContent={<Icon icon="solar:add-circle-bold" />} onClick={handleAddPlatform}>
                    添加平台
                </Button>
            </div>

            <Table aria-label="AI 平台列表" className="border-small border-divider rounded-medium">
                <TableHeader>
                    <TableColumn>平台名称</TableColumn>
                    <TableColumn>Base URL</TableColumn>
                    <TableColumn>API Key</TableColumn>
                    <TableColumn align="center">操作</TableColumn>
                </TableHeader>
                <TableBody emptyContent="暂无 AI 平台配置">
                    {platforms.map((platform) => (
                        <TableRow key={platform.id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Icon icon="solar:server-bold-duotone" className="text-primary" width={20} />
                                    <span className="font-medium">{platform.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-small text-default-500">{platform.baseUrl}</span>
                            </TableCell>
                            <TableCell>
                                <code className="text-tiny bg-default-100 px-2 py-1 rounded">{platform.apiKey.substring(0, 8)}***</code>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-center gap-2">
                                    <Button isIconOnly size="sm" variant="light" onClick={() => handleEditPlatform(platform)}>
                                        <Icon icon="solar:pen-linear" width={18} />
                                    </Button>
                                    <Button isIconOnly size="sm" variant="light" color="danger" onClick={() => handleDeletePlatform(platform.id)}>
                                        <Icon icon="solar:trash-bin-trash-linear" width={18} />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <PlatformModal isOpen={isOpen} onClose={onClose} platform={editingPlatform} onSave={handleSave} />
        </div>
    );
}

// AI 模型管理
function AIModelSettings() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [models, setModels] = useState<AIModel[]>([]);
    const [platforms, setPlatforms] = useState<{ id: string; name: string }[]>([]);
    const [editingModel, setEditingModel] = useState<AIModel | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [modelsData, platformsData] = await Promise.all([
                settingsApi.listModels(),
                settingsApi.listPlatforms(),
            ]);
            setModels(modelsData);
            setPlatforms(platformsData.map(p => ({ id: p.id, name: p.name })));
        } catch (e: any) {
            addToast({ title: "加载失败", description: e.message, color: "danger" });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleAddModel = () => {
        setEditingModel(null);
        onOpen();
    };

    const handleEditModel = (model: AIModel) => {
        setEditingModel(model);
        onOpen();
    };

    const handleDeleteModel = async (id: string) => {
        try {
            await settingsApi.deleteModel(id);
            setModels(models.filter(m => m.id !== id));
            addToast({ title: "删除成功", color: "success" });
        } catch (e: any) {
            addToast({ title: "删除失败", description: e.message, color: "danger" });
        }
    };

    const handleSave = async (formData: { name: string; modelId: string; platformId: string }) => {
        try {
            if (editingModel) {
                await settingsApi.updateModel(editingModel.id, formData);
            } else {
                await settingsApi.createModel(formData);
            }
            onClose();
            fetchData();
            addToast({ title: "保存成功", color: "success" });
        } catch (e: any) {
            addToast({ title: "保存失败", description: e.message, color: "danger" });
        }
    };

    const getPlatformName = (platformId: string) => {
        return platforms.find(p => p.id === platformId)?.name || "未知";
    };

    if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

    return (
        <div className="flex flex-col gap-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-medium font-bold">AI 模型管理</h3>
                    <p className="text-small text-default-500 mt-1">配置可用的 AI 模型，关联到对应的平台</p>
                </div>
                <Button color="primary" startContent={<Icon icon="solar:add-circle-bold" />} onClick={handleAddModel}>
                    添加模型
                </Button>
            </div>

            <Table aria-label="AI 模型列表" className="border-small border-divider rounded-medium">
                <TableHeader>
                    <TableColumn>模型名称</TableColumn>
                    <TableColumn>模型 ID</TableColumn>
                    <TableColumn>所属平台</TableColumn>
                    <TableColumn align="center">操作</TableColumn>
                </TableHeader>
                <TableBody emptyContent="暂无 AI 模型配置">
                    {models.map((model) => (
                        <TableRow key={model.id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Icon icon="solar:cpu-bolt-bold-duotone" className="text-secondary" width={20} />
                                    <span className="font-medium">{model.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <code className="text-tiny bg-default-100 px-2 py-1 rounded">{model.modelId}</code>
                            </TableCell>
                            <TableCell>
                                <Chip size="sm" variant="flat" color="primary">{getPlatformName(model.platformId)}</Chip>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-center gap-2">
                                    <Button isIconOnly size="sm" variant="light" onClick={() => handleEditModel(model)}>
                                        <Icon icon="solar:pen-linear" width={18} />
                                    </Button>
                                    <Button isIconOnly size="sm" variant="light" color="danger" onClick={() => handleDeleteModel(model.id)}>
                                        <Icon icon="solar:trash-bin-trash-linear" width={18} />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <ModelModal isOpen={isOpen} onClose={onClose} model={editingModel} platforms={platforms} onSave={handleSave} />
        </div>
    );
}

// 默认模型设置
function DefaultModelSettings() {
    const [defaultModels, setDefaultModels] = useState<DefaultModels>({
        articleCreation: "", imageCreation: "", xCollection: "", topicSelection: "",
    });
    const [availableModels, setAvailableModels] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [defaults, models] = await Promise.all([
                    settingsApi.getDefaults(),
                    settingsApi.listModels(),
                ]);
                setDefaultModels(defaults);
                setAvailableModels(models.map(m => ({ id: m.id, name: m.name })));
            } catch (e: any) {
                addToast({ title: "加载失败", description: e.message, color: "danger" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 真实保存
    const handleSave = async () => {
        try {
            setSaving(true);
            await settingsApi.updateDefaults(defaultModels);
            addToast({ title: "默认模型配置已保存", color: "success" });
        } catch (e: any) {
            addToast({ title: "保存失败", description: e.message, color: "danger" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

    const modelConfigs = [
        { key: "articleCreation" as const, icon: "solar:document-text-bold-duotone", color: "text-primary", title: "文章创作模型", desc: "用于生成文章内容、改写、扩写等文本创作任务" },
        { key: "imageCreation" as const, icon: "solar:gallery-bold-duotone", color: "text-secondary", title: "图片创作模型", desc: "用于生成文章配图、封面图等视觉内容" },
        { key: "xCollection" as const, icon: "ri:twitter-x-line", color: "text-success", title: "X 平台采集模型 (Grok)", desc: "通过 Grok API 采集 X (Twitter) 平台的热门内容" },
        { key: "topicSelection" as const, icon: "solar:star-bold-duotone", color: "text-warning", title: "精选选题模型", desc: "用于从素材库中智能筛选和生成优质选题" },
    ];

    return (
        <div className="flex flex-col gap-6 max-w-3xl">
            <div>
                <h3 className="text-medium font-bold">默认模型配置</h3>
                <p className="text-small text-default-500 mt-1">为不同的功能场景指定默认使用的 AI 模型</p>
            </div>

            <div className="flex flex-col gap-6">
                {modelConfigs.map(({ key, icon, color, title, desc }) => (
                    <div key={key} className="bg-default-50/50 p-4 rounded-medium border border-divider">
                        <div className="flex items-start gap-3 mb-3">
                            <Icon icon={icon} className={`${color} mt-1`} width={24} />
                            <div className="flex-1">
                                <h4 className="font-medium mb-1">{title}</h4>
                                <p className="text-tiny text-default-500 mb-3">{desc}</p>
                                <Select
                                    size="sm"
                                    selectedKeys={defaultModels[key] ? [defaultModels[key]] : []}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDefaultModels({ ...defaultModels, [key]: e.target.value })}
                                    className="max-w-xs"
                                    placeholder="请选择模型"
                                >
                                    {availableModels.map((model) => (
                                        <SelectItem key={model.id}>{model.name}</SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <Button color="primary" onClick={handleSave} isLoading={saving}>保存配置</Button>
            </div>
        </div>
    );
}

// 采集源配置（动态，接入 sources API）
function SourceSettings() {
    const [sources, setSources] = useState<Source[]>([]);
    const [loading, setLoading] = useState(true);

    // 加载信息源列表
    const loadSources = useCallback(async () => {
        try {
            setLoading(true);
            const data = await sourcesApi.list();
            setSources(data);
        } catch (e: any) {
            addToast({ title: "加载信息源失败", description: e.message, color: "danger" });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadSources(); }, [loadSources]);

    // 初始化默认渠道
    const handleSeed = async () => {
        try {
            const result = await sourcesApi.seed();
            addToast({ title: "初始化完成", description: `新增 ${result.created} 个，跳过 ${result.skipped} 个`, color: "success" });
            await loadSources();
        } catch (e: any) {
            addToast({ title: "初始化失败", description: e.message, color: "danger" });
        }
    };

    // 切换启用/禁用
    const handleToggle = async (id: string) => {
        try {
            await sourcesApi.toggle(id);
            setSources(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
        } catch (e: any) {
            addToast({ title: "切换失败", description: e.message, color: "danger" });
        }
    };

    if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

    if (sources.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 py-12">
                <Icon icon="solar:global-bold" width={48} className="text-default-300" />
                <p className="text-default-500">尚未配置信息源</p>
                <Button color="primary" onClick={handleSeed} startContent={<Icon icon="solar:add-circle-bold" />}>
                    初始化默认渠道
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-medium font-bold">内容采集源配置</h3>
                    <p className="text-small text-default-500 mt-1">管理自动采集任务的目标平台和爬虫参数</p>
                </div>
                <Button size="sm" variant="flat" onClick={handleSeed} startContent={<Icon icon="solar:add-circle-bold" />}>
                    重新初始化
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sources.map(source => (
                    <div key={source.id} className="flex items-center justify-between bg-default-50/50 p-4 rounded-medium border border-divider">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{source.name}</span>
                                <Chip size="sm" variant="flat" color="primary">{source.type}</Chip>
                            </div>
                            <p className="text-small text-default-500 mt-1 truncate max-w-[300px]">{source.url}</p>
                            {source.lastCrawlTime && (
                                <p className="text-tiny text-default-400 mt-1">
                                    上次采集: {new Date(source.lastCrawlTime).toLocaleString('zh-CN')}
                                </p>
                            )}
                        </div>
                        <Switch
                            color="success"
                            size="sm"
                            isSelected={source.enabled}
                            onValueChange={() => handleToggle(source.id)}
                        />
                    </div>
                ))}
            </div>

            <Divider className="my-2" />

            <h3 className="text-medium font-bold mb-2">爬虫基础设置</h3>
            <div className="flex flex-col gap-4">
                <Input label="请求超时时间 (秒)" type="number" defaultValue="30" labelPlacement="outside" />
                <Input label="爬虫代理 IP (Proxy URL)" placeholder="http://127.0.0.1:7890" labelPlacement="outside" />
            </div>
        </div>
    );
}

// 平台编辑弹窗 - 真实保存
function PlatformModal({ isOpen, onClose, platform, onSave }: {
    isOpen: boolean; onClose: () => void; platform: AIPlatform | null;
    onSave: (data: { name: string; baseUrl: string; apiKey: string }) => Promise<void>;
}) {
    const [formData, setFormData] = useState({ name: "", baseUrl: "", apiKey: "" });
    const [saving, setSaving] = useState(false);

    // 当 platform 变化时重置表单
    useEffect(() => {
        if (platform) {
            setFormData({ name: platform.name, baseUrl: platform.baseUrl, apiKey: platform.apiKey });
        } else {
            setFormData({ name: "", baseUrl: "", apiKey: "" });
        }
    }, [platform]);

    const handleSubmit = async () => {
        setSaving(true);
        try {
            await onSave(formData);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
                <ModalHeader>{platform ? "编辑平台" : "添加平台"}</ModalHeader>
                <ModalBody>
                    <div className="flex flex-col gap-4">
                        <Input label="平台名称" placeholder="例如：OpenAI, DeepSeek" value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} labelPlacement="outside" />
                        <Input label="Base URL" placeholder="https://api.openai.com/v1" value={formData.baseUrl}
                            onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })} labelPlacement="outside" />
                        <Input label="API Key" placeholder="sk-..." type="password" value={formData.apiKey}
                            onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })} labelPlacement="outside" />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="flat" onClick={onClose}>取消</Button>
                    <Button color="primary" onClick={handleSubmit} isLoading={saving}>保存</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

// 模型编辑弹窗 - 真实保存
function ModelModal({ isOpen, onClose, model, platforms, onSave }: {
    isOpen: boolean; onClose: () => void; model: AIModel | null;
    platforms: { id: string; name: string }[];
    onSave: (data: { name: string; modelId: string; platformId: string }) => Promise<void>;
}) {
    const [formData, setFormData] = useState({ name: "", modelId: "", platformId: "" });
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);

    useEffect(() => {
        if (model) {
            setFormData({ name: model.name, modelId: model.modelId, platformId: model.platformId });
        } else {
            setFormData({ name: "", modelId: "", platformId: "" });
        }
    }, [model]);

    const handleTest = async () => {
        if (!formData.platformId || !formData.modelId) {
            addToast({ title: "提示", description: "请先填写模型 ID 并选择所属平台", color: "warning" });
            return;
        }
        setTesting(true);
        try {
            const res = await settingsApi.testModel({ platformId: formData.platformId, modelId: formData.modelId });
            if (res.success) {
                addToast({ title: "测试通过", description: res.reply || "该模型连接正常", color: "success" });
            } else {
                addToast({ title: "测试失败", description: res.message, color: "danger" });
            }
        } catch (e: any) {
            addToast({ title: "测试异常", description: e.response?.data?.message || e.message || "请求异常，请检查网络或配置", color: "danger" });
        } finally {
            setTesting(false);
        }
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            await onSave(formData);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
                <ModalHeader>{model ? "编辑模型" : "添加模型"}</ModalHeader>
                <ModalBody>
                    <div className="flex flex-col gap-4">
                        <Input label="模型名称" placeholder="例如：GPT-4 Turbo" value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} labelPlacement="outside" />
                        <Input label="模型 ID" placeholder="gpt-4-turbo" value={formData.modelId}
                            onChange={(e) => setFormData({ ...formData, modelId: e.target.value })} labelPlacement="outside" />
                        <Select label="所属平台" placeholder="选择 AI 平台"
                            selectedKeys={formData.platformId ? [formData.platformId] : []}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, platformId: e.target.value })} labelPlacement="outside">
                            {platforms.map((platform) => (
                                <SelectItem key={platform.id}>{platform.name}</SelectItem>
                            ))}
                        </Select>
                    </div>
                </ModalBody>
                <ModalFooter className="flex justify-between w-full">
                    <div>
                        <Button color="secondary" variant="flat" onClick={handleTest} isLoading={testing} startContent={!testing && <Icon icon="solar:server-bold-duotone" />}>
                            测试
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="flat" onClick={onClose}>取消</Button>
                        <Button color="primary" onClick={handleSubmit} isLoading={saving}>保存</Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

// 存储配置（七牛云）
function StorageSettings() {
    const [config, setConfig] = useState<StorageConfig>({ accessKey: '', secretKey: '', bucket: '', domain: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);

    useEffect(() => {
        storageApi.getConfig()
            .then(data => setConfig(data || { accessKey: '', secretKey: '', bucket: '', domain: '' }))
            .catch(e => addToast({ title: '加载失败', description: e.message, color: 'danger' }))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);
            await storageApi.updateConfig(config);
            addToast({ title: '保存成功', description: '七牛云配置已保存', color: 'success' });
        } catch (e: any) {
            addToast({ title: '保存失败', description: e.message, color: 'danger' });
        } finally {
            setSaving(false);
        }
    };

    const handleTest = async () => {
        try {
            setTesting(true);
            const res = await storageApi.testConnection();
            if (res.success) {
                addToast({ title: '连接成功', description: res.message, color: 'success' });
            } else {
                addToast({ title: '连接失败', description: res.message, color: 'danger' });
            }
        } catch (e: any) {
            addToast({ title: '测试异常', description: e.message, color: 'danger' });
        } finally {
            setTesting(false);
        }
    };

    if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

    return (
        <div className="flex flex-col gap-6 max-w-xl">
            <div>
                <h3 className="text-medium font-bold">对象存储配置</h3>
                <p className="text-small text-default-500 mt-1">配置七牛云存储，AI 生成的图片将自动上传并永久保存，避免临时链接过期失效</p>
            </div>

            <div className="flex flex-col gap-4">
                <Input
                    label="Access Key"
                    placeholder="七牛云 Access Key"
                    value={config.accessKey}
                    onChange={e => setConfig({ ...config, accessKey: e.target.value })}
                    labelPlacement="outside"
                />
                <Input
                    label="Secret Key"
                    placeholder="七牛云 Secret Key"
                    type="password"
                    value={config.secretKey}
                    onChange={e => setConfig({ ...config, secretKey: e.target.value })}
                    labelPlacement="outside"
                />
                <Input
                    label="Bucket 名称"
                    placeholder="例如：my-ai-images"
                    value={config.bucket}
                    onChange={e => setConfig({ ...config, bucket: e.target.value })}
                    labelPlacement="outside"
                />
                <Input
                    label="CDN 域名"
                    placeholder="例如：https://cdn.example.com"
                    value={config.domain}
                    onChange={e => setConfig({ ...config, domain: e.target.value })}
                    labelPlacement="outside"
                    description="七牛云存储空间绑定的访问域名，图片将以 {域名}/ai-images/{文件名} 的格式访问"
                />
            </div>

            <div className="flex justify-between items-center pt-2">
                <Button
                    color="secondary"
                    variant="flat"
                    isLoading={testing}
                    startContent={!testing && <Icon icon="solar:server-bold-duotone" />}
                    onClick={handleTest}
                >
                    测试连接
                </Button>
                <Button color="primary" isLoading={saving} onClick={handleSave}>
                    保存配置
                </Button>
            </div>
        </div>
    );
}


