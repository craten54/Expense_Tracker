/** @type {import('next').NextConfig} */
const nextConfig = {
    // 1. Matikan source maps agar kodingan asli gak bisa diintip di browser
    productionBrowserSourceMaps: false,
    
    // 2. Hapus header "X-Powered-By: Next.js" untuk keamanan tambahan
    poweredByHeader: false,

    // 3. (Opsional) Jika kamu ingin memaksa gambar SS Dashboard teroptimasi
    images: {
        remotePatterns: [],
    },
};

export default nextConfig;