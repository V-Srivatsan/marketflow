import { useState } from "react";
import { Radio } from "lucide-react";

import { makeRequest } from "../../lib/utils";

const News = () => {
    const [message, setMessage] = useState("")

    const handleSend = () =>
        makeRequest("admin/news", 'POST', { message }, true);

    return (
        <div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                <div className="space-y-4">
                    <div>
                        <textarea
                            value={message} rows={15}
                            onChange={(e) => setMessage(e.currentTarget.value)}
                            required placeholder="Enter announcement"
                            className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[120px] resize-y transition-colors"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSend}
                        className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                    >
                        <Radio className="w-4 h-4" /> Send to everyone
                    </button>
                </div>
            </div>
        </div>
    );
}

export default News