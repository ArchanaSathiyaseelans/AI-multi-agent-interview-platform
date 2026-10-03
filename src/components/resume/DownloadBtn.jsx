import React, { useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import { useCoins } from '../../apis/user.api';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

function DownloadBtn({ docRef, user, setUser }) {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (!docRef || !docRef.current) {
            alert("Document not ready for download.");
            return;
        }

        try {
            setDownloading(true);

            // Deduce coins if user has coin balance
            try {
                const coinResponse = await useCoins({ coins: 10, action: "download-pdf" });
                if (coinResponse && setUser) {
                    setUser((prev) => ({
                        ...prev, interviewCoin: coinResponse.interviewCoin,
                    }));
                }
            } catch (err) {
                console.warn("Coin deduction note:", err);
            }

            const element = docRef.current;
            const filename = `${user?.name ? user.name.replace(/\s+/g, '_') : 'Document'}_PrepIQ.pdf`;

            // Render element using native browser SVG/Canvas rendering pipeline (supports oklab/oklch natively)
            const dataUrl = await toPng(element, {
                quality: 0.95,
                pixelRatio: 2,
                backgroundColor: '#ffffff',
                cacheBust: true,
                filter: (node) => {
                    return !node?.classList?.contains('no-print');
                }
            });

            // Instantiate A4 PDF document
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Calculate element image aspect ratio
            const img = new Image();
            img.src = dataUrl;
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            const imgWidth = pdfWidth;
            const imgHeight = (img.height * pdfWidth) / img.width;

            if (imgHeight <= pdfHeight) {
                pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight);
            } else {
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;

                while (heightLeft > 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pdfHeight;
                }
            }

            pdf.save(filename);
        } catch (error) {
            console.error("PDF download error:", error);
            try {
                window.print();
            } catch (pErr) {
                alert("Could not generate PDF download.");
            }
        } finally {
            setDownloading(false);
        }
    };

    return (
        <button 
            onClick={handleDownload} 
            disabled={downloading}
            className='flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white px-4 py-2 text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50'
        >
            <FiDownload size={14} />
            <span>{downloading ? "Preparing PDF..." : "Download PDF"}</span>
        </button>
    );
}

export default DownloadBtn;
