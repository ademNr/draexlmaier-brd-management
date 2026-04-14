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
    description: 'Technical documentation and feature overview for the DRÄXLMAIER Production Quality Management platform.',
};

export default function DocsPage() {
    const techStack = [
        {
            name: 'Next.js 16',
            description: 'React framework for production, utilizing App Router and Server Components for optimal performance.',
            icon: <Zap className="text-blue-500" size={24} />,
            color: 'from-blue-500/10 to-blue-600/10 border-blue-200'
        },
        {
            name: 'Tailwind CSS v4',
            description: 'Utility-first CSS framework for rapid UI development with a focus on modern design aesthetics.',
            icon: <Layout className="text-cyan-500" size={24} />,
            color: 'from-cyan-500/10 to-cyan-600/10 border-cyan-200'
        },
        {
            name: 'MongoDB & Mongoose',
            description: 'NoSQL database for flexible data modeling and robust storage of production control records.',
            icon: <Database className="text-emerald-500" size={24} />,
            color: 'from-emerald-500/10 to-emerald-600/10 border-emerald-200'
        },
        {
            name: 'Recharts',
            description: 'A composable charting library built with React components for detailed data visualization.',
            icon: <BarChart3 className="text-orange-500" size={24} />,
            color: 'from-orange-500/10 to-orange-600/10 border-orange-200'
        },
        {
            name: 'Lucide React',
            description: 'Beautiful & consistent icon toolkit for modern web applications.',
            icon: <Cpu className="text-purple-500" size={24} />,
            color: 'from-purple-500/10 to-purple-600/10 border-purple-200'
        },
        {
            name: 'SheetJS (XLSX)',
            description: 'Library for spreadsheet data processing and export capabilities.',
            icon: <FileSpreadsheet className="text-green-600" size={24} />,
            color: 'from-green-500/10 to-green-600/10 border-green-200'
        }
    ];

    const features = [
        {
            title: 'Real-time QC Monitoring',
            description: 'Instant logging of quality controls with multi-user synchronization.',
            icon: <RefreshCw size={20} />
        },
        {
            title: 'Shared Reference Images',
            description: 'Global access to reference images to ensure consistent quality standards across shifts.',
            icon: <Layout size={20} />
        },
        {
            title: 'Advanced Analytics',
            description: 'Deep insights into defect trends, shift performance, and partier reliability.',
            icon: <BarChart3 size={20} />
        },
        {
            title: 'Multi-lingual Support',
            description: 'Full interface translations for French, English, and Arabic (RTL support).',
            icon: <Globe size={20} />
        },
        {
            title: 'History Management',
            description: 'Comprehensive historical logs with search, filter, and drill-down details.',
            icon: <History size={20} />
        },
        {
            title: 'Data Reliability',
            description: 'Session persistence and robust data validation to prevent data loss.',
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
                        Back to App <ArrowRight size={16} />
                    </Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">
                {/* Hero Section */}
                <section className="text-center mb-24">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#003d7a] to-blue-500 bg-clip-text text-transparent">
                        Production Quality Management
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        A state-of-the-art platform designed to streamline quality control, provide real-time insights, 
                        and ensure manufacturing excellence at every stage of production.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-[#003d7a] text-sm font-medium">
                            <Shield size={16} /> Production Ready
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-sm font-medium">
                            <Zap size={16} /> High Performance
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left Column: Tech Stack */}
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                <Cpu className="text-blue-600" /> Technology Stack
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
                                <Zap className="text-orange-500" /> Key Capability Features
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
                                <h3 className="text-2xl font-bold mb-4">Platform Overview</h3>
                                <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                                    Our platform integrates directly into the production workflow, providing operators and managers 
                                    with the tools they need to maintain zero-defect standards.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        'Centralized Data Architecture',
                                        'Real-time Dashboard Metrics',
                                        'Automated PDF & XLSX Reports',
                                        'Shift-based Access Control'
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
                                Dedicated to continuous improvement and technical superiority in industrial quality management.
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
                        &copy; {new Date().getFullYear()} DRÄXLMAIER Group. All rights reserved. 
                        Designed for Internal Quality Management Excellence.
                    </p>
                </footer>
            </main>
        </div>
    );
}
