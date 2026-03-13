"use client";
import { useState, useEffect } from "react"; // Tambah useEffect
import { X, UploadCloud, Save } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onUpdate: () => void;
}

export default function EditProfileModal({ isOpen, onClose, user, onUpdate }: Props) {
    const [name, setName] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);

    // Sync data saat modal dibuka
    useEffect(() => {
        if (isOpen && user) {
        setName(user.name || "");
        setImagePreview(user.image || ""); // Ambil foto yang sudah ada
        }
    }, [isOpen, user]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
        if (file.size > 1024 * 1024) return alert("File kegedean Stan! Max 1MB");

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
        const res = await fetch("/api/user/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, image: imagePreview }),
        });

        if (res.ok) {
            alert("Profil Updated!");
            onUpdate(); 
            onClose();
        }
        } catch (error) {
        console.error(error);
        } finally {
        setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
            <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600">
            <X size={24} />
            </button>

            <h3 className="text-2xl font-bold mb-8">Edit Profil</h3>

            <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
                <div className="w-28 h-28 rounded-full border-4 border-slate-100 overflow-hidden shadow-inner bg-slate-50 relative flex items-center justify-center">
                {/* Logika render foto agar tidak tulisan Preview doang */}
                {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-slate-300 text-xs text-center p-2">Belum ada foto</span>
                )}
                </div>
                
                <label className="flex items-center gap-2 text-sm text-blue-600 font-semibold cursor-pointer p-3 bg-blue-50 rounded-full hover:bg-blue-100 transition-all">
                <UploadCloud size={18} />
                Ganti Foto Profile
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
            </div>

            <div>
                <label className="text-sm font-bold text-slate-600 block mb-2 tracking-wide uppercase">Nama Lengkap</label>
                <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium focus:ring-2 focus:ring-blue-300 outline-none text-slate-800"
                placeholder="Masukkan namamu Stan"
                />
            </div>

            <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full mt-6 bg-slate-900 text-white p-5 rounded-2xl font-bold text-lg hover:bg-slate-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
            >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            </div>
        </div>
        </div>
    );
}