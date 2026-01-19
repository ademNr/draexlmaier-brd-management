export type Language = 'fr' | 'en' | 'ar';

export const translations = {
    fr: {
        appTitle: "DRÄXLMAIER",
        appSubtitle: "Systeme de Controle de Qualité de Production",
        login: {
            usernamePlaceholder: "Votre nom",
            passwordPlaceholder: "Mot de passe",
            selectShift: "Sélectionner un shift",
            shifts: {
                morning: "Matin",
                evening: "Soir",
                night: "Nuit"
            },
            button: "Se connecter",
            errors: {
                enterName: "Veuillez entrer votre nom",
                selectShift: "Veuillez sélectionner un shift",
                wrongPassword: "Mot de passe incorrect"
            }
        },
        header: {
            logout: "Déconnexion",
            history: "Historique",
            newControl: "Nouveau Contrôle",
            dashboard: "Tableau de bord"
        },
        control: {
            title: "Informations du Contrôle",
            nmKsk: "NM KSK",
            nmKskPlaceholder: "Entrez le NM KSK",
            nmBbrd: "NM BBRD",
            nmBbrdPlaceholder: "Entrez le NM BBRD",
            image: "Image",
            imageUpload: "Cliquez pour télécharger",
            imageFormats: "JPG, PNG, GIF",
            locked: "Verrouillée",
            comment: "Commentaire",
            commentPlaceholder: "Ajoutez vos observations...",
            save: "Enregistrer le Contrôle",
            reset: "Réinitialiser TOUT",
            alerts: {
                enterKsk: "Veuillez saisir le NM KSK",
                enterBbrd: "Veuillez saisir le NM BBRD",
                selectImage: "Veuillez sélectionner ou télécharger une image",
                saved: "Contrôle enregistré avec succès",
                confirmReset: "Voulez-vous vraiment réinitialiser tous les champs ET supprimer l'image partagée pour TOUS les utilisateurs?",
                imageDeleted: "Image supprimée pour tous les utilisateurs"
            }
        },
        history: {
            title: "Historique des Contrôles",
            searchPlaceholder: "Rechercher par NM KSK, NM BBRD ou utilisateur...",
            allShifts: "Tous les shifts",
            noData: "Aucun contrôle trouvé",
            table: {
                date: "Date",
                nmKsk: "NM KSK",
                nmBbrd: "NM BBRD",
                shift: "Shift",
                user: "Utilisateur",
                defects: "Défauts"
            },
            details: {
                rate: "Taux",
                defectsDetected: "Défauts détectés",
                comment: "Commentaire"
            },
            confirmDelete: "Êtes-vous sûr de vouloir supprimer ce contrôle?"
        },
        analytics: {
            referenceImages: "Images de Référence par Partier",
            clickToFinish: "Cliquer: Contrôle terminé",
            infoImages: "ℹ️ Ces images sont partagées entre tous les utilisateurs. Un cadre rouge indique plus de 10 défauts. Cliquez sur le badge rouge pour marquer le contrôle comme terminé.",
            totalControls: "Total Contrôles",
            totalDefects: "Total Défauts",
            avgDefects: "Moyenne Défauts/Contrôle",
            defectsByType: "Défauts par Type",
            defectsByHour: "Défauts par Heure",
            defectsByDay: "Défauts par Jour",
            defectsByWeek: "Défauts par Semaine",
            defectRateByShift: "Taux de Défauts par Shift",
            defectsByPartier: "Défauts par Partier",
            defectTrend: "Tendance des Défauts (10 derniers contrôles)",
            defects: "défauts",
            controls: "contrôles",
            saveImage: "Image {number} sauvegardée pour tous les utilisateurs!",
            selectValidImage: "Veuillez sélectionner une image valide"
        },
        defects: {
            'Faux Acheminement': 'Faux Acheminement',
            'Câble Endommagé': 'Câble Endommagé',
            'Ushall non conforme': 'Ushall non conforme',
            'Croisement': 'Croisement',
            'Connecteur Endommagé': 'Connecteur Endommagé',
            'Module Manquant': 'Module Manquant'
        },
        partiers: {
            'Partier 1': 'Partier 1',
            'Partier 2': 'Partier 2',
            'Partier 3': 'Partier 3',
            'Partier 4': 'Partier 4',
            'Partier 5': 'Partier 5',
            'Partier 6': 'Partier 6'
        }
    },
    en: {
        appTitle: "DRÄXLMAIER",
        appSubtitle: "Production Quality Monitoring System",
        login: {
            usernamePlaceholder: "Your name",
            passwordPlaceholder: "Password",
            selectShift: "Select a shift",
            shifts: {
                morning: "Morning",
                evening: "Evening",
                night: "Night"
            },
            button: "Login",
            errors: {
                enterName: "Please enter your name",
                selectShift: "Please select a shift",
                wrongPassword: "Incorrect password"
            }
        },
        header: {
            logout: "Logout",
            history: "History",
            newControl: "New Control",
            dashboard: "Dashboard"
        },
        control: {
            title: "Control Information",
            nmKsk: "KSK Number",
            nmKskPlaceholder: "Enter KSK Number",
            nmBbrd: "BBRD Number",
            nmBbrdPlaceholder: "Enter BBRD Number",
            image: "Image",
            imageUpload: "Click to upload",
            imageFormats: "JPG, PNG, GIF",
            locked: "Locked",
            comment: "Comment",
            commentPlaceholder: "Add your observations...",
            save: "Save Control",
            reset: "Reset ALL",
            alerts: {
                enterKsk: "Please enter KSK Number",
                enterBbrd: "Please enter BBRD Number",
                selectImage: "Please select or upload an image",
                saved: "Control saved successfully",
                confirmReset: "Are you sure you want to reset all fields AND delete the shared image for ALL users?",
                imageDeleted: "Image deleted for all users"
            }
        },
        history: {
            title: "Control History",
            searchPlaceholder: "Search by KSK, BBRD or user...",
            allShifts: "All shifts",
            noData: "No controls found",
            table: {
                date: "Date",
                nmKsk: "KSK Number",
                nmBbrd: "BBRD Number",
                shift: "Shift",
                user: "User",
                defects: "Defects"
            },
            details: {
                rate: "Rate",
                defectsDetected: "Defects detected",
                comment: "Comment"
            },
            confirmDelete: "Are you sure you want to delete this control?"
        },
        analytics: {
            referenceImages: "Reference Images by Board",
            clickToFinish: "Click: Control finished",
            infoImages: "ℹ️ These images are shared among all users. A red frame indicates more than 10 defects. Click the red badge to mark the control as finished.",
            totalControls: "Total Controls",
            totalDefects: "Total Defects",
            avgDefects: "Avg Defects/Control",
            defectsByType: "Defects by Type",
            defectsByHour: "Defects by Hour",
            defectsByDay: "Defects by Day",
            defectsByWeek: "Defects by Week",
            defectRateByShift: "Defect Rate by Shift",
            defectsByPartier: "Defects by Board",
            defectTrend: "Defect Trend (Last 10 controls)",
            defects: "defects",
            controls: "controls",
            saveImage: "Image {number} saved for all users!",
            selectValidImage: "Please select a valid image"
        },
        defects: {
            'Faux Acheminement': 'Wrong Routing',
            'Câble Endommagé': 'Damaged Cable',
            'Ushall non conforme': 'Non-compliant Ushall',
            'Croisement': 'Crossing',
            'Connecteur Endommagé': 'Damaged Connector',
            'Module Manquant': 'Missing Module'
        },
        partiers: {
            'Partier 1': 'Board 1',
            'Partier 2': 'Board 2',
            'Partier 3': 'Board 3',
            'Partier 4': 'Board 4',
            'Partier 5': 'Board 5',
            'Partier 6': 'Board 6'
        }
    },
    ar: {
        appTitle: "DRÄXLMAIER",
        appSubtitle: "نظام مراقبة جودة الإنتاج",
        login: {
            usernamePlaceholder: "اسمك",
            passwordPlaceholder: "كلمة المرور",
            selectShift: "اختر الورديّة",
            shifts: {
                morning: "صباح",
                evening: "مساء",
                night: "ليل"
            },
            button: "تسجيل الدخول",
            errors: {
                enterName: "يرجى إدخال اسمك",
                selectShift: "يرجى اختيار ورديّة",
                wrongPassword: "كلمة المرور غير صحيحة"
            }
        },
        header: {
            logout: "تسجيل الخروج",
            history: "السجل",
            newControl: "فحص جديد",
            dashboard: "لوحة القيادة"
        },
        control: {
            title: "معلومات الفحص",
            nmKsk: "رقم KSK",
            nmKskPlaceholder: "أدخل رقم KSK",
            nmBbrd: "رقم BBRD",
            nmBbrdPlaceholder: "أدخل رقم BBRD",
            image: "صورة",
            imageUpload: "اضغط للتحميل",
            imageFormats: "JPG, PNG, GIF",
            locked: "مقفلة",
            comment: "ملاحظات",
            commentPlaceholder: "أضف ملاحظاتك...",
            save: "حفظ الفحص",
            reset: "إعادة ضبط الكل",
            alerts: {
                enterKsk: "يرجى إدخال رقم KSK",
                enterBbrd: "يرجى إدخال رقم BBRD",
                selectImage: "يرجى اختيار أو تحميل صورة",
                saved: "تم حفظ الفحص بنجاح",
                confirmReset: "هل أنت متأكد من أنك تريد إعادة تعيين جميع الحقول وحذف الصورة المشتركة لجميع المستخدمين؟",
                imageDeleted: "تم حذف الصورة لجميع المستخدمين"
            }
        },
        history: {
            title: "سجل الفحوصات",
            searchPlaceholder: "بحث برقم KSK أو BBRD أو المستخدم...",
            allShifts: "كل الورديات",
            noData: "لا توجد فحوصات",
            table: {
                date: "التاريخ",
                nmKsk: "رقم KSK",
                nmBbrd: "رقم BBRD",
                shift: "الورديّة",
                user: "المستخدم",
                defects: "العيوب"
            },
            details: {
                rate: "المعدل",
                defectsDetected: "العيوب المكتشفة",
                comment: "ملاحظات"
            },
            confirmDelete: "هل أنت متأكد من حذف هذا الفحص؟"
        },
        analytics: {
            referenceImages: "الصور المرجعية",
            clickToFinish: "اضغط: الفحص انتهى",
            infoImages: "ℹ️ هذه الصور مشتركة بين جميع المستخدمين. الإطار الأحمر يشير إلى أكثر من 10 عيوب. اضغط على الشارة الحمراء لإنهاء الفحص.",
            totalControls: "مجموع الفحوصات",
            totalDefects: "مجموع العيوب",
            avgDefects: "معدل العيوب/فحص",
            defectsByType: "العيوب حسب النوع",
            defectsByHour: "العيوب حسب الساعة",
            defectsByDay: "العيوب حسب اليوم",
            defectsByWeek: "العيوب حسب الأسبوع",
            defectRateByShift: "معدل العيوب حسب الورديّة",
            defectsByPartier: "العيوب حسب اللوحة",
            defectTrend: "اتجاه العيوب (آخر 10 فحوصات)",
            defects: "عيوب",
            controls: "فحوصات",
            saveImage: "تم حفظ الصورة {number} لجميع المستخدمين!",
            selectValidImage: "يرجى اختيار صورة صالحة"
        },
        defects: {
            'Faux Acheminement': 'توجيه خاطئ',
            'Câble Endommagé': 'كابل تالف',
            'Ushall non conforme': 'Ushall غير مطابق',
            'Croisement': 'تقاطع',
            'Connecteur Endommagé': 'موصل تالف',
            'Module Manquant': 'وحدة مفقودة'
        },
        partiers: {
            'Partier 1': 'لوحة 1',
            'Partier 2': 'لوحة 2',
            'Partier 3': 'لوحة 3',
            'Partier 4': 'لوحة 4',
            'Partier 5': 'لوحة 5',
            'Partier 6': 'لوحة 6'
        }
    }
};
