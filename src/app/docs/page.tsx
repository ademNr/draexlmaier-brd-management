import React from 'react';
import { 
    Cpu, 
    Database, 
    Layout, 
    Shield, 
    Zap, 
    BarChart3, 
    Globe, 
    FileSpreadsheet, 
    ArrowRight,
    Search,
    History,
    RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Documentation | DRÄXLMAIER PQM',
    description: 'Documentation technique et aperçu des fonctionnalités pour la plateforme DRÄXLMAIER Production Quality Management.',
};

export default function DocsPage() {
    const techStack = [
        {
            name: 'Next.js 16',
            description: 'Framework React pour la production, utilisant l\'App Router et les Server Components pour des performances optimales.',
            icon: <Zap className="text-blue-500" size={24} />,
            color: 'from-blue-500/10 to-blue-600/10 border-blue-200'
        },
        {
            name: 'Tailwind CSS v4',
            description: 'Framework CSS utilitaire pour un développement UI rapide avec une esthétique moderne.',
            icon: <Layout className="text-cyan-500" size={24} />,
            color: 'from-cyan-500/10 to-cyan-600/10 border-cyan-200'
        },
        {
            name: 'MongoDB & Mongoose',
            description: 'Base de données NoSQL pour une modélisation flexible et un stockage robuste des enregistrements de production.',
            icon: <Database className="text-emerald-500" size={24} />,
            color: 'from-emerald-500/10 to-emerald-600/10 border-emerald-200'
        },
        {
            name: 'Recharts',
            description: 'Bibliothèque de graphiques composables construite avec des composants React pour une visualisation détaillée.',
            icon: <BarChart3 className="text-orange-500" size={24} />,
            color: 'from-orange-500/10 to-orange-600/10 border-orange-200'
        },
        {
            name: 'Lucide React',
            description: 'Kit d\'icônes cohérent et élégant pour les applications web modernes.',
            icon: <Cpu className="text-purple-500" size={24} />,
            color: 'from-purple-500/10 to-purple-600/10 border-purple-200'
        },
        {
            name: 'SheetJS (XLSX)',
            description: 'Bibliothèque pour le traitement des feuilles de calcul et les capacités d\'exportation.',
            icon: <FileSpreadsheet className="text-green-600" size={24} />,
            color: 'from-green-500/10 to-green-600/10 border-green-200'
        }
    ];

    const features = [
        {
            title: 'Suivi Qualité en Temps Réel',
            description: 'Enregistrement instantané des contrôles qualité avec synchronisation multi-utilisateurs.',
            icon: <RefreshCw size={20} />
        },
        {
            title: 'Images de Référence Partagées',
            description: 'Accès global aux images de référence pour garantir des standards de qualité constants.',
            icon: <Layout size={20} />
        },
        {
            title: 'Analyses Avancées',
            description: 'Informations approfondies sur les tendances de défauts et les performances des shifts.',
            icon: <BarChart3 size={20} />
        },
        {
            title: 'Support Multilingue',
            description: 'Interface entièrement traduite en Français, Anglais et Arabe (support RTL).',
            icon: <Globe size={20} />
        },
        {
            title: 'Gestion de l\'Historique',
            description: 'Journaux historiques complets avec recherche, filtrage et détails approfondis.',
            icon: <History size={20} />
        },
        {
            title: 'Fiabilité des Données',
            description: 'Persistance de session et validation robuste des données pour éviter toute perte.',
            icon: <Shield size={20} />
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
            {/* Nav */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#003d7a] rounded-lg flex items-center justify-center text-white font-bold text-xs ring-2 ring-blue-500/20">
                            DRX
                        </div>
                        <span className="font-bold text-lg tracking-tight text-[#003d7a]">PQM DOCS</span>
                    </div>
                    <Link href="/" className="px-4 py-2 text-sm font-semibold text-[#003d7a] hover:bg-blue-50 rounded-full transition-colors flex items-center gap-2">
                        Retour à l'App <ArrowRight size={16} />
                    </Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">
                {/* Hero Section */}
                <section className="text-center mb-24">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#003d7a] to-blue-500 bg-clip-text text-transparent">
                        Gestion de la Qualité de Production
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Une plateforme de pointe conçue pour optimiser le contrôle qualité, fournir des informations en temps réel 
                        et garantir l'excellence de fabrication à chaque étape de la production.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-[#003d7a] text-sm font-medium">
                            <Shield size={16} /> Prêt pour la Production
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-sm font-medium">
                            <Zap size={16} /> Haute Performance
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left Column: Tech Stack */}
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                <Cpu className="text-blue-600" /> Stack Technologique
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {techStack.map((tech) => (
                                    <div 
                                        key={tech.name} 
                                        className={`p-6 rounded-2xl border bg-gradient-to-br ${tech.color} shadow-sm hover:shadow-md transition-shadow`}
                                    >
                                        <div className="mb-4">{tech.icon}</div>
                                        <h3 className="font-bold text-lg mb-2">{tech.name}</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">{tech.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* System Features Grid */}
                        <div>
                            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                <Zap className="text-orange-500" /> Fonctionnalités Clés
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {features.map((feature) => (
                                    <div key={feature.title} className="group">
                                        <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-4 shadow-blue-200 shadow-lg group-hover:scale-110 transition-transform">
                                            {feature.icon}
                                        </div>
                                        <h3 className="font-bold mb-2">{feature.title}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Platform Overview */}
                    <aside className="space-y-8">
                        <div className="p-8 rounded-3xl bg-[#003d7a] text-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-4">Aperçu de la Plateforme</h3>
                                <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                                    Notre plateforme s'intègre directement dans le flux de production, offrant aux opérateurs et aux gestionnaires 
                                    les outils nécessaires pour maintenir des standards de zéro défaut.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        'Architecture de Données Centralisée',
                                        'Métriques du Tableau de Bord en Temps Réel',
                                        'Rapports PDF & XLSX Automatisés',
                                        'Contrôle d\'Accès Basé sur les Shifts'
                                    ].map(item => (
                                        <li key={item} className="flex items-center gap-3 text-sm">
                                            <div className="w-1.5 h-1.5 bg-blue-300 rounded-full" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                        </div>

                        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
                            <h3 className="font-bold mb-4 text-slate-800">Support & Excellence</h3>
                            <p className="text-sm text-slate-500 mb-6 font-medium">
                                Dédié à l'amélioration continue et à la supériorité technique dans la gestion de la qualité industrielle.
                            </p>
                            <div className="pt-6 border-t border-slate-100">
                                <div className="text-xs uppercase tracking-widest text-[#003d7a] font-bold mb-2">Version</div>
                                <div className="text-2xl font-black text-slate-300">v1.2.4-stable</div>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Footer Section */}
                <footer className="mt-32 pt-12 border-t border-slate-200 text-center">
                    <p className="text-slate-400 text-sm">
                        &copy; {new Date().getFullYear()} Groupe DRÄXLMAIER. Tous droits réservés. 
                        Conçu pour l'excellence de la gestion de la qualité interne.
                    </p>
                </footer>
            </main>
        </div>
    );
}
