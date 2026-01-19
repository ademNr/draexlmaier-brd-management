'use client';

import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell,
    LineChart, Line, Legend
} from 'recharts';
import {
    AlertCircle, Save, Trash2, Plus, LogOut, BarChart3,
    Download, Search, Calendar, User, CheckCircle, Globe
} from 'lucide-react';
import { storage } from '../lib/storage'; // Import our storage utility
import { translations, Language } from '../lib/translations';

const COLORS = {
    primary: '#003d7a',
    secondary: '#0066cc',
    accent: '#00a3e0',
    success: '#00b050',
    warning: '#ffc000',
    danger: '#c00000',
    lightBg: '#f0f4f8',
    white: '#ffffff',
    gray: '#6b7280',
    darkGray: '#374151'
};

const CHART_COLORS = ['#003d7a', '#0066cc', '#00a3e0', '#00b050', '#ffc000', '#c00000'];

const USERS = [
    { username: 'yahya mzali', password: 'drax123' }
];



const DEFAUTS = [
    'Faux Acheminement',
    'Câble Endommagé',
    'Ushall non conforme',
    'Croisement',
    'Connecteur Endommagé',
    'Module Manquant'
];

const PARTIERS = [
    'Partier 1', 'Partier 2', 'Partier 3',
    'Partier 4', 'Partier 5', 'Partier 6'
];

interface FormDataState {
    nmKsk: string;
    nmBbrd: string;
    commentaire: string;
    selectedImage: string | null;
    imageFile: string | null;
    partierDefauts: Record<string, string[]>;
}

interface DashboardImagesState {
    [key: string]: string | null;
}

interface PartierResolvedState {
    [key: string]: boolean;
}

const DraexlmaierApp = () => {
    const [language, setLanguage] = useState<Language>('fr');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [shift, setShift] = useState('');
    const [loginError, setLoginError] = useState('');
    const [controlData, setControlData] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterShift, setFilterShift] = useState('all');
    const [expandedControlId, setExpandedControlId] = useState<number | null>(null);
    const [dashboardImages, setDashboardImages] = useState<DashboardImagesState>({
        img1: null,
        img2: null,
        img3: null,
        img4: null,
        img5: null,
        img6: null
    });
    const [partierResolved, setPartierResolved] = useState<PartierResolvedState>({
        'Partier 1': false,
        'Partier 2': false,
        'Partier 3': false,
        'Partier 4': false,
        'Partier 5': false,
        'Partier 6': false
    });

    const [formData, setFormData] = useState<FormDataState>({
        nmKsk: '',
        nmBbrd: '',
        commentaire: '',
        selectedImage: null,
        imageFile: null,
        partierDefauts: {
            'Partier 1': [],
            'Partier 2': [],
            'Partier 3': [],
            'Partier 4': [],
            'Partier 5': [],
            'Partier 6': []
        }
    });

    const t = translations[language];

    // Helper to get translated defect label
    const getDefautLabel = (key: string) => {
        return t.defects[key as keyof typeof t.defects] || key;
    };

    // Helper to get translated partier label
    const getPartierLabel = (key: string) => {
        return t.partiers[key as keyof typeof t.partiers] || key;
    };

    useEffect(() => {
        // Ensure window.storage is available globally if needed by internal logic
        if (typeof window !== 'undefined') {
            (window as any).storage = storage;
        }

        const loadSettings = async () => {
            try {
                const lang = await storage.get('draexlmaier_language');
                if (lang && lang.value) {
                    setLanguage(lang.value as Language);
                }
            } catch (e) { console.log('No language setting found'); }
        }

        const loadImage = async () => {
            try {
                const result = await storage.get('draexlmaier_shared_image', true);
                if (result && result.value) {
                    const imageData = JSON.parse(result.value);
                    setFormData(prev => ({
                        ...prev,
                        selectedImage: imageData.selectedImage,
                        imageFile: imageData.imageFile
                    }));
                }
            } catch (error) {
                console.log('Aucune image sauvegardée trouvée');
            }
        };

        const loadDashboardImages = async () => {
            try {
                const result = await storage.get('draexlmaier_dashboard_images', true);
                if (result && result.value) {
                    const images = JSON.parse(result.value);
                    setDashboardImages(images);
                }
            } catch (error) {
                console.log('Aucune image dashboard trouvée');
            }
        };

        const loadPartierResolved = async () => {
            try {
                const result = await storage.get('draexlmaier_partier_resolved', true);
                if (result && result.value) {
                    const resolved = JSON.parse(result.value);
                    setPartierResolved(resolved);
                }
            } catch (error) {
                console.log('Aucun statut de résolution trouvé');
            }
        };

        loadSettings();
        loadImage();
        loadDashboardImages();
        loadPartierResolved();

        const refreshInterval = setInterval(() => {
            loadImage();
            loadDashboardImages();
            loadPartierResolved();
        }, 1000);

        return () => clearInterval(refreshInterval);
    }, []);

    const changeLanguage = async (lang: Language) => {
        setLanguage(lang);
        try {
            await storage.set('draexlmaier_language', lang);
        } catch (e) {
            console.error('Failed to save language', e);
        }
    };

    const handleLogin = () => {
        const foundUser = USERS.find(u => u.username.toLowerCase() === username.trim().toLowerCase());

        if (foundUser && foundUser.password === password && shift) {
            setIsLoggedIn(true);
            setCurrentPage('control');
            setLoginError('');
        } else if (!username.trim()) {
            setLoginError(t.login.errors.enterName);
        } else if (!shift) {
            setLoginError(t.login.errors.selectShift);
        } else {
            setLoginError(t.login.errors.wrongPassword);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentPage('login');
        setUsername('');
        setPassword('');
        setShift('');
    };

    const toggleDefaut = (partier: string, defaut: string) => {
        setFormData(prev => ({
            ...prev,
            partierDefauts: {
                ...prev.partierDefauts,
                [partier]: prev.partierDefauts[partier].includes(defaut)
                    ? prev.partierDefauts[partier].filter(d => d !== defaut)
                    : [...prev.partierDefauts[partier], defaut]
            }
        }));
    };

    const saveControl = () => {
        if (!formData.nmKsk.trim()) {
            alert(t.control.alerts.enterKsk);
            return;
        }

        if (!formData.nmBbrd.trim()) {
            alert(t.control.alerts.enterBbrd);
            return;
        }

        if (!formData.selectedImage) {
            alert(t.control.alerts.selectImage);
            return;
        }

        const newControl = {
            id: Date.now(),
            date: new Date().toLocaleString('fr-FR'),
            shift,
            username,
            nmKsk: formData.nmKsk,
            nmBbrd: formData.nmBbrd,
            commentaire: formData.commentaire,
            selectedImage: formData.selectedImage,
            imageFile: formData.imageFile,
            partierDefauts: formData.partierDefauts,
            totalDefauts: Object.values(formData.partierDefauts)
                .reduce((acc, arr) => acc + arr.length, 0)
        };

        setControlData(prev => [...prev, newControl]);
        alert(t.control.alerts.saved);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            nmKsk: '',
            nmBbrd: '',
            commentaire: '',
            selectedImage: formData.selectedImage,
            imageFile: formData.imageFile,
            partierDefauts: {
                'Partier 1': [],
                'Partier 2': [],
                'Partier 3': [],
                'Partier 4': [],
                'Partier 5': [],
                'Partier 6': []
            }
        });
    };

    const deleteControl = (id: number) => {
        if (window.confirm(t.history.confirmDelete)) {
            setControlData(prev => prev.filter(c => c.id !== id));
        }
    };

    const filteredData = controlData.filter(c => {
        const matchesSearch = c.nmKsk.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.nmBbrd.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesShift = filterShift === 'all' || c.shift === filterShift;
        return matchesSearch && matchesShift;
    });

    const analyticsData = DEFAUTS.map(d => ({
        name: getDefautLabel(d),
        count: controlData.reduce((acc, c) =>
            acc + Object.values(c.partierDefauts as Record<string, string[]>)
                .flat().filter((def: any) => def === d).length, 0)
    }));

    const shiftData = ['Matin', 'Soir', 'Nuit'].map((s) => {
        const shiftKey = s === 'Matin' ? 'morning' : s === 'Soir' ? 'evening' : 'night';
        const translatedShift = t.login.shifts[shiftKey as keyof typeof t.login.shifts];

        const controls = controlData.filter(c => c.shift === s); // Data stores original shift strings
        const totalDefauts = controls.reduce((acc, c) => acc + c.totalDefauts, 0);
        const totalControls = controls.length;
        const taux = totalControls > 0 ? (totalDefauts / totalControls).toFixed(2) : 0;

        return {
            name: translatedShift,
            value: totalControls,
            defauts: totalDefauts,
            taux: parseFloat(taux as string)
        };
    });

    const defautsParPeriode = () => {
        const periode: any = { heure: {}, jour: {}, semaine: {} };

        controlData.forEach(c => {
            const date = new Date(c.date.split(' ')[0].split('/').reverse().join('-'));

            const heure = parseInt(c.date.split(' ')[1].split(':')[0]);
            const jourSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][date.getDay()];
            const numeroSemaine = Math.ceil((date.getDate()) / 7);

            periode.heure[heure] = (periode.heure[heure] || 0) + c.totalDefauts;
            periode.jour[jourSemaine] = (periode.jour[jourSemaine] || 0) + c.totalDefauts;
            periode.semaine[`Semaine ${numeroSemaine}`] = (periode.semaine[`Semaine ${numeroSemaine}`] || 0) + c.totalDefauts;
        });

        return {
            heure: Object.entries(periode.heure).map(([h, count]) => ({ name: `${h}h`, defauts: count })).sort((a: any, b: any) => parseInt(a.name) - parseInt(b.name)),
            jour: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(j => ({ name: j, defauts: periode.jour[j] || 0 })),
            semaine: Object.entries(periode.semaine).map(([s, count]) => ({ name: s, defauts: count }))
        };
    };

    const periodeData = defautsParPeriode();

    const partierData = PARTIERS.map(p => ({
        name: getPartierLabel(p),
        defauts: controlData.reduce((acc, c) =>
            acc + c.partierDefauts[p].length, 0)
    }));

    const trendData = controlData.slice(-10).map(c => ({
        date: c.date.split(' ')[0],
        defauts: c.totalDefauts
    }));

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    const handleDashboardImageUpload = async (imageNumber: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const newImages = {
                    ...dashboardImages,
                    [`img${imageNumber}`]: reader.result as string
                };
                setDashboardImages(newImages);

                try {
                    await storage.set('draexlmaier_dashboard_images', JSON.stringify(newImages), true);
                    alert(t.analytics.saveImage.replace('{number}', imageNumber.toString()));
                } catch (error) {
                    console.error('Erreur lors de la sauvegarde de l\'image dashboard:', error);
                }
            };
            reader.readAsDataURL(file);
        } else {
            alert(t.analytics.selectValidImage);
        }
    };

    const handlePartierResolve = async (partierName: string) => {
        const newResolved = {
            ...partierResolved,
            [partierName]: true
        };
        setPartierResolved(newResolved);

        try {
            await storage.set('draexlmaier_partier_resolved', JSON.stringify(newResolved), true);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du statut:', error);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const imageData = {
                    selectedImage: 'uploaded',
                    imageFile: reader.result as string
                };
                setFormData(prev => ({
                    ...prev,
                    selectedImage: 'uploaded',
                    imageFile: reader.result as string
                }));

                try {
                    await storage.set('draexlmaier_shared_image', JSON.stringify(imageData), true);
                    alert(t.control.alerts.saved);
                } catch (error) {
                    console.error('Erreur lors de la sauvegarde de l\'image:', error);
                }
            };
            reader.readAsDataURL(file);
        } else {
            alert(t.control.alerts.selectImage);
        }
    };

    const LanguageSwitcher = () => (
        <div className="flex gap-2">
            {(['fr', 'en', 'ar'] as Language[]).map((lang) => (
                <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors ${language === lang
                        ? 'bg-blue-800 text-white'
                        : 'bg-white text-blue-800 border border-blue-800'
                        }`}
                >
                    {lang}
                </button>
            ))}
        </div>
    );

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" dir={language === 'ar' ? 'rtl' : 'ltr'} style={{
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`
            }}>
                <div className="bg-white p-10 rounded-2xl w-full max-w-md shadow-2xl relative">
                    <div className="absolute top-4 right-4">
                        <LanguageSwitcher />
                    </div>
                    <div className="text-3xl font-bold text-center mb-2" style={{ color: COLORS.primary }}>
                        {t.appTitle}
                    </div>
                    <div className="text-sm text-center mb-8" style={{ color: COLORS.primary, fontWeight: '600' }}>
                        {t.appSubtitle}
                    </div>

                    <input
                        className="w-full p-3 mb-4 border-2 rounded-lg outline-none"
                        placeholder={t.login.usernamePlaceholder}
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />

                    <input
                        className="w-full p-3 mb-4 border-2 rounded-lg outline-none"
                        type="password"
                        placeholder={t.login.passwordPlaceholder}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />

                    <select
                        className="w-full p-3 mb-4 border-2 rounded-lg"
                        value={shift}
                        onChange={e => setShift(e.target.value)}
                    >
                        <option value="">{t.login.selectShift}</option>
                        <option value="Matin">{t.login.shifts.morning}</option>
                        <option value="Soir">{t.login.shifts.evening}</option>
                        <option value="Nuit">{t.login.shifts.night}</option>
                    </select>

                    {loginError && (
                        <div className="text-center mb-4 text-sm" style={{ color: COLORS.danger }}>
                            {loginError}
                        </div>
                    )}

                    <button
                        onClick={handleLogin}
                        className="w-full p-4 text-white rounded-lg font-semibold"
                        style={{ background: COLORS.primary }}
                    >
                        {t.login.button}
                    </button>
                </div>
            </div>
        );
    }

    const Header = () => (
        <div className="bg-white p-5 shadow-md" style={{ borderBottom: `3px solid ${COLORS.primary}` }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="flex gap-5 items-start">
                        <div>
                            <div className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                                {t.appTitle} <span className="text-lg font-normal">{t.appSubtitle}</span>
                            </div>
                            <div className="text-sm mt-1" style={{ color: '#000000', fontWeight: '600' }}>
                                <User size={14} className="inline mr-1" />
                                {username} | Shift: {shift}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 ltr:ml-[20mm] rtl:mr-[20mm]" style={language === 'ar' ? { marginRight: '20mm' } : { marginLeft: '20mm' }}>
                            <div className="flex gap-2">
                                <LanguageSwitcher />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="px-5 py-2 rounded-lg font-semibold flex items-center gap-2"
                                    style={{
                                        background: COLORS.white,
                                        color: COLORS.primary,
                                        border: `2px solid ${COLORS.primary}`
                                    }}
                                    onClick={handleLogout}
                                >
                                    <LogOut size={18} />
                                    {t.header.logout}
                                </button>
                                <button
                                    className="px-5 py-2 rounded-lg font-semibold flex items-center gap-2"
                                    style={{
                                        background: currentPage === 'history' ? COLORS.primary : COLORS.white,
                                        color: currentPage === 'history' ? COLORS.white : COLORS.primary,
                                        border: `2px solid ${COLORS.primary}`
                                    }}
                                    onClick={() => setCurrentPage('history')}
                                >
                                    <Calendar size={18} />
                                    {t.header.history}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            className="px-5 py-2 rounded-lg font-semibold flex items-center gap-2"
                            style={{
                                background: currentPage === 'control' ? COLORS.primary : COLORS.white,
                                color: currentPage === 'control' ? COLORS.white : COLORS.primary,
                                border: `2px solid ${COLORS.primary}`
                            }}
                            onClick={() => setCurrentPage('control')}
                        >
                            <Plus size={18} />
                            {t.header.newControl}
                        </button>
                        <button
                            className="px-5 py-2 rounded-lg font-semibold flex items-center gap-2"
                            style={{
                                background: currentPage === 'analytics' ? COLORS.primary : COLORS.white,
                                color: currentPage === 'analytics' ? COLORS.white : COLORS.primary,
                                border: `2px solid ${COLORS.primary}`
                            }}
                            onClick={() => setCurrentPage('analytics')}
                        >
                            <BarChart3 size={18} />
                            {t.header.dashboard}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (currentPage === 'control') {
        return (
            <div className="min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'} style={{ background: COLORS.lightBg }}>
                <Header />
                <div className="max-w-7xl mx-auto p-8">
                    <div className="bg-white p-6 rounded-xl shadow mb-5">
                        <div className="text-xl font-bold mb-5 flex items-center gap-2" style={{ color: COLORS.primary }}>
                            <CheckCircle size={24} />
                            {t.control.title}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div>
                                <label className="block mb-2 font-semibold" style={{ color: COLORS.darkGray }}>
                                    {t.control.nmKsk} *
                                </label>
                                <input
                                    className="w-full p-3 border-2 rounded-lg"
                                    placeholder={t.control.nmKskPlaceholder}
                                    value={formData.nmKsk}
                                    onChange={e => setFormData({ ...formData, nmKsk: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold" style={{ color: COLORS.darkGray }}>
                                    {t.control.nmBbrd} *
                                </label>
                                <input
                                    className="w-full p-3 border-2 rounded-lg"
                                    placeholder={t.control.nmBbrdPlaceholder}
                                    value={formData.nmBbrd}
                                    onChange={e => setFormData({ ...formData, nmBbrd: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            <div>
                                <div className="text-lg font-bold mb-4" style={{ color: COLORS.primary }}>
                                    {getPartierLabel('Partier 1')} - {getPartierLabel('Partier 3')} - {getPartierLabel('Partier 5')}
                                </div>

                                {[PARTIERS[0], PARTIERS[2], PARTIERS[4]].map(partier => (
                                    <details key={partier} className="mb-3 border-2 rounded-lg" style={{ borderColor: COLORS.lightBg }}>
                                        <summary
                                            className="cursor-pointer font-semibold p-3 rounded"
                                            style={{
                                                background: COLORS.lightBg,
                                                color: COLORS.primary,
                                                listStyle: 'none',
                                                userSelect: 'none'
                                            }}
                                        >
                                            <span>▼ {getPartierLabel(partier)} ({formData.partierDefauts[partier].length})</span>
                                        </summary>
                                        <div className="p-3">
                                            <div className="flex flex-wrap gap-2">
                                                {DEFAUTS.map(defaut => (
                                                    <button
                                                        key={defaut}
                                                        className="px-3 py-2 rounded-md text-xs font-medium border-2 transition-all"
                                                        style={{
                                                            background: formData.partierDefauts[partier].includes(defaut) ? COLORS.danger : COLORS.white,
                                                            color: formData.partierDefauts[partier].includes(defaut) ? COLORS.white : COLORS.darkGray,
                                                            borderColor: formData.partierDefauts[partier].includes(defaut) ? COLORS.danger : COLORS.gray
                                                        }}
                                                        onClick={() => toggleDefaut(partier, defaut)}
                                                    >
                                                        {getDefautLabel(defaut)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </details>
                                ))}
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold" style={{ color: COLORS.darkGray }}>
                                    {t.control.image} *
                                </label>

                                {!formData.imageFile ? (
                                    <div className="p-6 border-2 border-dashed rounded-lg text-center" style={{ borderColor: COLORS.primary }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                            id="imageUpload"
                                        />
                                        <label
                                            htmlFor="imageUpload"
                                            className="cursor-pointer"
                                            style={{ display: 'block' }}
                                        >
                                            <div style={{ fontSize: '48px', marginBottom: '8px' }}>📤</div>
                                            <div className="font-semibold mb-2" style={{ color: COLORS.primary, fontSize: '16px' }}>
                                                {t.control.imageUpload}
                                            </div>
                                            <div className="text-xs" style={{ color: COLORS.gray }}>
                                                {t.control.imageFormats}
                                            </div>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="p-3 border-2 rounded-lg" style={{ borderColor: COLORS.success }}>
                                        <img
                                            src={formData.imageFile}
                                            alt="Uploaded"
                                            style={{
                                                maxWidth: '100%',
                                                height: 'auto',
                                                margin: '0 auto',
                                                borderRadius: '8px',
                                                display: 'block'
                                            }}
                                        />
                                        <div className="mt-2 p-2 rounded text-center text-xs" style={{ background: COLORS.success, color: 'white' }}>
                                            ✓ {t.control.locked}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="text-lg font-bold mb-4" style={{ color: COLORS.primary }}>
                                    {getPartierLabel('Partier 2')} - {getPartierLabel('Partier 4')} - {getPartierLabel('Partier 6')}
                                </div>

                                {[PARTIERS[1], PARTIERS[3], PARTIERS[5]].map(partier => (
                                    <details key={partier} className="mb-3 border-2 rounded-lg" style={{ borderColor: COLORS.lightBg }}>
                                        <summary
                                            className="cursor-pointer font-semibold p-3 rounded"
                                            style={{
                                                background: COLORS.lightBg,
                                                color: COLORS.primary,
                                                listStyle: 'none',
                                                userSelect: 'none'
                                            }}
                                        >
                                            <span>▼ {getPartierLabel(partier)} ({formData.partierDefauts[partier].length})</span>
                                        </summary>
                                        <div className="p-3">
                                            <div className="flex flex-wrap gap-2">
                                                {DEFAUTS.map(defaut => (
                                                    <button
                                                        key={defaut}
                                                        className="px-3 py-2 rounded-md text-xs font-medium border-2 transition-all"
                                                        style={{
                                                            background: formData.partierDefauts[partier].includes(defaut) ? COLORS.danger : COLORS.white,
                                                            color: formData.partierDefauts[partier].includes(defaut) ? COLORS.white : COLORS.darkGray,
                                                            borderColor: formData.partierDefauts[partier].includes(defaut) ? COLORS.danger : COLORS.gray
                                                        }}
                                                        onClick={() => toggleDefaut(partier, defaut)}
                                                    >
                                                        {getDefautLabel(defaut)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow mb-5">
                        <div className="text-xl font-bold mb-5" style={{ color: COLORS.primary }}>
                            {t.control.comment}
                        </div>
                        <textarea
                            className="w-full p-3 border-2 rounded-lg min-h-24"
                            placeholder={t.control.commentPlaceholder}
                            value={formData.commentaire}
                            onChange={e => setFormData({ ...formData, commentaire: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        <button
                            className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 text-white"
                            style={{ background: COLORS.success }}
                            onClick={saveControl}
                        >
                            <Save size={18} />
                            {t.control.save}
                        </button>
                        <button
                            className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 border-2"
                            style={{ borderColor: COLORS.danger, color: COLORS.danger }}
                            onClick={async () => {
                                if (window.confirm(t.control.alerts.confirmReset)) {
                                    try {
                                        await storage.delete('draexlmaier_shared_image', true);
                                        setFormData({
                                            nmKsk: '',
                                            nmBbrd: '',
                                            commentaire: '',
                                            selectedImage: null,
                                            imageFile: null,
                                            partierDefauts: {
                                                'Partier 1': [],
                                                'Partier 2': [],
                                                'Partier 3': [],
                                                'Partier 4': [],
                                                'Partier 5': [],
                                                'Partier 6': []
                                            }
                                        });
                                        alert(t.control.alerts.imageDeleted);
                                    } catch (error) {
                                        console.error('Erreur lors de la suppression:', error);
                                    }
                                }
                            }}
                        >
                            <Trash2 size={18} />
                            {t.control.reset}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (currentPage === 'history') {
        return (
            <div className="min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'} style={{ background: COLORS.lightBg }}>
                <Header />
                <div className="max-w-7xl mx-auto p-8">
                    <div className="bg-white p-6 rounded-xl shadow">
                        <div className="text-xl font-bold mb-5 flex items-center gap-2" style={{ color: COLORS.primary }}>
                            <Calendar size={24} />
                            {t.history.title}
                        </div>

                        <div className="flex gap-4 mb-5 flex-wrap">
                            <div className="flex-1 relative min-w-64">
                                <Search size={18} className="absolute left-3 top-3 rtl:right-3 rtl:left-auto" style={{ color: COLORS.gray }} />
                                <input
                                    className="w-full pl-10 rtl:pr-10 rtl:pl-3 p-3 border-2 rounded-lg"
                                    placeholder={t.history.searchPlaceholder}
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="p-3 border-2 rounded-lg w-48"
                                value={filterShift}
                                onChange={e => setFilterShift(e.target.value)}
                            >
                                <option value="all">{t.history.allShifts}</option>
                                <option value="Matin">{t.login.shifts.morning}</option>
                                <option value="Soir">{t.login.shifts.evening}</option>
                                <option value="Nuit">{t.login.shifts.night}</option>
                            </select>
                        </div>

                        {filteredData.length === 0 ? (
                            <div className="text-center py-12" style={{ color: COLORS.gray }}>
                                {t.history.noData}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2">
                                            <th className="p-3 text-left rtl:text-right font-semibold" style={{ color: COLORS.darkGray }}>{t.history.table.date}</th>
                                            <th className="p-3 text-left rtl:text-right font-semibold" style={{ color: COLORS.darkGray }}>{t.history.table.nmKsk}</th>
                                            <th className="p-3 text-left rtl:text-right font-semibold" style={{ color: COLORS.darkGray }}>{t.history.table.nmBbrd}</th>
                                            <th className="p-3 text-left rtl:text-right font-semibold" style={{ color: COLORS.darkGray }}>{t.history.table.shift}</th>
                                            <th className="p-3 text-left rtl:text-right font-semibold" style={{ color: COLORS.darkGray }}>{t.history.table.user}</th>
                                            <th className="p-3 text-left rtl:text-right font-semibold" style={{ color: COLORS.darkGray }}>{t.history.table.defects}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.slice().reverse().map(control => (
                                            <React.Fragment key={control.id}>
                                                <tr
                                                    className="border-b cursor-pointer hover:bg-gray-50"
                                                    onClick={() => setExpandedControlId(expandedControlId === control.id ? null : control.id)}
                                                >
                                                    <td className="p-3">
                                                        <span className="mr-2 rtl:ml-2 rtl:mr-0">{expandedControlId === control.id ? '▼' : '▶'}</span>
                                                        {control.date}
                                                    </td>
                                                    <td className="p-3 font-medium">{control.nmKsk}</td>
                                                    <td className="p-3">{control.nmBbrd}</td>
                                                    <td className="p-3">
                                                        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                                                            background: control.shift === 'Matin' ? '#dbeafe' : control.shift === 'Soir' ? '#fef3c7' : '#e9d5ff',
                                                            color: control.shift === 'Matin' ? '#1e40af' : control.shift === 'Soir' ? '#92400e' : '#6b21a8'
                                                        }}>
                                                            {control.shift === 'Matin' ? t.login.shifts.morning : control.shift === 'Soir' ? t.login.shifts.evening : t.login.shifts.night}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">{control.username}</td>
                                                    <td className="p-3">
                                                        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                                                            background: control.totalDefauts > 5 ? '#fee2e2' : control.totalDefauts > 0 ? '#fef3c7' : '#dcfce7',
                                                            color: control.totalDefauts > 5 ? '#991b1b' : control.totalDefauts > 0 ? '#92400e' : '#166534'
                                                        }}>
                                                            {control.totalDefauts}
                                                        </span>
                                                    </td>
                                                </tr>
                                                {expandedControlId === control.id && (
                                                    <tr>
                                                        <td colSpan={6} className="p-4" style={{ background: COLORS.lightBg }}>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                {PARTIERS.map(partier => {
                                                                    // Use safety check for partierDefauts[partier]
                                                                    const defautsList = control.partierDefauts?.[partier] || [];
                                                                    const defautsCount = defautsList.length;
                                                                    const totalDefauts = control.totalDefauts;
                                                                    const taux = totalDefauts > 0 ? ((defautsCount / totalDefauts) * 100).toFixed(1) : 0;

                                                                    return (
                                                                        <div key={partier} className="bg-white rounded-lg p-4 shadow">
                                                                            <div className="font-bold mb-2" style={{ color: COLORS.primary }}>
                                                                                {getPartierLabel(partier)}
                                                                            </div>
                                                                            <div className="mb-2">
                                                                                <div className="text-2xl font-bold" style={{ color: COLORS.danger }}>
                                                                                    {defautsCount} {t.analytics.defects}
                                                                                </div>
                                                                                <div className="text-sm" style={{ color: COLORS.gray }}>
                                                                                    {t.history.details.rate}: {taux}%
                                                                                </div>
                                                                            </div>
                                                                            {defautsCount > 0 && (
                                                                                <div className="mt-3 pt-3 border-t">
                                                                                    <div className="text-xs font-semibold mb-2" style={{ color: COLORS.darkGray }}>
                                                                                        {t.history.details.defectsDetected}:
                                                                                    </div>
                                                                                    {defautsList.map((defaut: string, idx: number) => (
                                                                                        <div key={idx} className="text-xs py-1 px-2 mb-1 rounded" style={{ background: '#fee2e2', color: '#991b1b' }}>
                                                                                            • {getDefautLabel(defaut)}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                            {control.commentaire && (
                                                                <div className="mt-4 bg-white rounded-lg p-4 shadow">
                                                                    <div className="font-bold mb-2" style={{ color: COLORS.primary }}>
                                                                        {t.history.details.comment}:
                                                                    </div>
                                                                    <div className="text-sm" style={{ color: COLORS.darkGray }}>
                                                                        {control.commentaire}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (currentPage === 'analytics') {
        const totalControls = controlData.length;
        const totalDefauts = controlData.reduce((acc, c) => acc + c.totalDefauts, 0);
        const avgDefauts = totalControls > 0 ? (totalDefauts / totalControls).toFixed(1) : 0;

        const getPartierDefautsCount = (partierName: string) => {
            return controlData
                .filter(c => c.shift === shift)
                .reduce((acc, c) => acc + (c.partierDefauts[partierName]?.length || 0), 0);
        };

        return (
            <div className="min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'} style={{ background: COLORS.lightBg }}>
                <Header />
                <div className="max-w-7xl mx-auto p-8">
                    <div className="bg-white p-6 rounded-xl shadow mb-5">
                        <div className="text-xl font-bold mb-5" style={{ color: COLORS.primary }}>
                            {t.analytics.referenceImages}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[1, 2, 3, 4, 5, 6].map(num => {
                                const partierName = `Partier ${num}`;
                                const defautsCount = getPartierDefautsCount(partierName);
                                const isResolved = partierResolved[partierName];
                                const hasAlert = defautsCount > 10 && !isResolved;

                                return (
                                    <div key={num} className="border-2 rounded-lg overflow-hidden" style={{
                                        borderColor: hasAlert ? COLORS.danger : COLORS.lightBg,
                                        borderWidth: hasAlert ? '4px' : '2px'
                                    }}>
                                        {dashboardImages[`img${num}`] ? (
                                            <div className="relative">
                                                <img
                                                    src={dashboardImages[`img${num}`] as string}
                                                    alt={`Partier ${num}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '100px',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <div
                                                    className={hasAlert ? "cursor-pointer" : ""}
                                                    onClick={() => hasAlert && handlePartierResolve(partierName)}
                                                    style={{
                                                        background: hasAlert ? COLORS.danger : COLORS.success,
                                                        color: 'white',
                                                        padding: '8px',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <div className="text-xs font-semibold">
                                                        {getPartierLabel(`Partier ${num}`)}
                                                    </div>
                                                    {hasAlert && (
                                                        <div className="text-xs mt-1">
                                                            ⚠️ {defautsCount} {t.analytics.defects}
                                                            <div className="text-xs mt-1 font-bold">
                                                                {t.analytics.clickToFinish}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center" style={{ height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleDashboardImageUpload(num, e)}
                                                    style={{ display: 'none' }}
                                                    id={`dashImg${num}`}
                                                />
                                                <label
                                                    htmlFor={`dashImg${num}`}
                                                    className="cursor-pointer"
                                                    style={{ display: 'block' }}
                                                >
                                                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>📤</div>
                                                    <div className="text-xs font-semibold" style={{ color: COLORS.primary }}>
                                                        {getPartierLabel(`Partier ${num}`)}
                                                    </div>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 text-sm" style={{ color: COLORS.gray }}>
                            {t.analytics.infoImages}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow" style={{ borderLeft: `4px solid ${COLORS.primary}` }}>
                            <div className="text-4xl font-bold mb-2" style={{ color: COLORS.primary }}>
                                {totalControls}
                            </div>
                            <div className="text-sm font-medium" style={{ color: COLORS.gray }}>
                                {t.analytics.totalControls}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow" style={{ borderLeft: `4px solid ${COLORS.danger}` }}>
                            <div className="text-4xl font-bold mb-2" style={{ color: COLORS.primary }}>
                                {totalDefauts}
                            </div>
                            <div className="text-sm font-medium" style={{ color: COLORS.gray }}>
                                {t.analytics.totalDefects}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow" style={{ borderLeft: `4px solid ${COLORS.warning}` }}>
                            <div className="text-4xl font-bold mb-2" style={{ color: COLORS.primary }}>
                                {avgDefauts}
                            </div>
                            <div className="text-sm font-medium" style={{ color: COLORS.gray }}>
                                {t.analytics.avgDefects}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow mb-5">
                        <div className="text-xl font-bold mb-5" style={{ color: COLORS.primary }}>
                            {t.analytics.defectsByType}
                        </div>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={analyticsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill={COLORS.danger} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div className="bg-white p-6 rounded-xl shadow">
                            <div className="text-xl font-bold mb-5" style={{ color: COLORS.primary }}>
                                {t.analytics.defectsByHour}
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={periodeData.heure}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="defauts" stroke={COLORS.danger} strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow">
                            <div className="text-xl font-bold mb-5" style={{ color: COLORS.primary }}>
                                {t.analytics.defectsByDay}
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={periodeData.jour}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="defauts" fill={COLORS.warning} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div className="bg-white p-6 rounded-xl shadow">
                            <div className="text-xl font-bold mb-5" style={{ color: COLORS.primary }}>
                                {t.analytics.defectsByWeek}
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={periodeData.semaine}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="defauts" fill={COLORS.accent} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow">
                            <div className="text-xl font-bold mb-5" style={{ color: COLORS.primary }}>
                                {t.analytics.defectRateByShift}
                            </div>
                            <div className="space-y-4">
                                {shiftData.map((shift, index) => (
                                    <div key={shift.name} className="border-2 rounded-lg p-4" style={{ borderColor: COLORS.lightBg }}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-lg" style={{ color: COLORS.primary }}>
                                                {shift.name}
                                            </span>
                                            <span className="text-2xl font-bold" style={{
                                                color: shift.taux > 3 ? COLORS.danger : shift.taux > 1.5 ? COLORS.warning : COLORS.success
                                            }}>
                                                {shift.taux}
                                            </span>
                                        </div>
                                        <div className="text-sm" style={{ color: COLORS.gray }}>
                                            {shift.defauts} {t.analytics.defects} / {shift.value} {t.analytics.controls}
                                        </div>
                                        <div className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${Math.min(shift.taux * 20, 100)}%`,
                                                    background: shift.taux > 3 ? COLORS.danger : shift.taux > 1.5 ? COLORS.warning : COLORS.success
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div className="bg-white p-6 rounded-xl shadow">
                            <div className="text-xl font-bold mb-5" style={{ color: COLORS.primary }}>
                                {t.analytics.defectsByPartier}
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={partierData} layout="horizontal">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={80} />
                                    <Tooltip />
                                    <Bar dataKey="defauts" fill={COLORS.accent} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {trendData.length > 0 && (
                        <div className="bg-white p-6 rounded-xl shadow mb-5">
                            <div className="text-xl font-bold mb-5" style={{ color: COLORS.primary }}>
                                {t.analytics.defectTrend}
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="defauts" stroke={COLORS.primary} strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return null;
};

export default DraexlmaierApp;
